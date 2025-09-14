import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { SocialUser } from './interfaces/social-user.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly MAIN_SERVER_URL: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.MAIN_SERVER_URL = this.configService.get('MAIN_SERVER_URL');
    if (!this.MAIN_SERVER_URL) {
      this.logger.warn(
        'MAIN_SERVER_URL이 설정되지 않았습니다. 목(mock) 모드로 동작합니다.',
      );
    }
  }

  async kakaoLogin(user: SocialUser) {
    this.logger.log('카카오 로그인 시작', user);

    const existingUser = await this.findUserByProviderId(
      user.provider,
      user.providerId,
    );

    if (existingUser) {
      this.logger.log('기존 유저 확인', existingUser);
      // TODO: JWT 토큰 생성 및 반환
      return existingUser;
    }

    this.logger.log('신규 유저 생성');
    const newUser = await this.createUser(user);
    // TODO: JWT 토큰 생성 및 반환
    return newUser;
  }

  private async findUserByProviderId(provider: string, providerId: string) {
    if (!this.MAIN_SERVER_URL) {
      this.logger.log('MOCKING: findUserByProviderId - 항상 null을 반환합니다.');
      return null;
    }

    const url = `${this.MAIN_SERVER_URL}/users/provider/${provider}/${providerId}`;
    this.logger.log(`메인 서버에 유저 조회 요청: ${url}`);

    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error) => {
          if (error.response?.status === HttpStatus.NOT_FOUND) {
            return [null]; // RxJS 스트림에서 null을 반환하기 위해 배열 사용
          }
          this.logger.error('메인 서버 통신 오류', error.response?.data);
          throw new HttpException(
            '메인 서버 통신 중 오류가 발생했습니다.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );

    return data;
  }

  private async createUser(user: SocialUser) {
    if (!this.MAIN_SERVER_URL) {
      this.logger.log('MOCKING: createUser - 목업 유저를 생성합니다.');
      return {
        id: `mock-${Date.now()}`,
        ...user,
      };
    }

    const url = `${this.MAIN_SERVER_URL}/users`;
    this.logger.log(`메인 서버에 유저 생성 요청: ${url}`);

    const { data } = await firstValueFrom(
      this.httpService.post(url, user).pipe(
        catchError((error) => {
          this.logger.error('메인 서버 통신 오류', error.response?.data);
          throw new HttpException(
            '메인 서버 통신 중 오류가 발생했습니다.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );

    return data;
  }
}
