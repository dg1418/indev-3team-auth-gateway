import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
  private readonly logger = new Logger(GatewayService.name);
  private readonly MAIN_SERVER_URL: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.MAIN_SERVER_URL = this.configService.get('MAIN_SERVER_URL');
    if (!this.MAIN_SERVER_URL) {
      // MAIN_SERVER_URL이 없으면 게이트웨이가 동작할 수 없으므로 에러를 발생시킵니다.
      throw new Error('MAIN_SERVER_URL is not defined in environment variables.');
    }
  }

  async proxyRequest(req: Request) {
    const { method, body } = req;
    const userId = (req.user as { id: number | string }).id;

    // 1. 메인 서버로 전달될 최종 URL 생성
    // 예: /api/posts -> http://main-server/posts
    const requestUrl = req.originalUrl.replace('/api', '');
    const targetUrl = `${this.MAIN_SERVER_URL}${requestUrl}`;

    this.logger.log(`Proxying request to: ${targetUrl}`);

    // 2. 원본 요청의 헤더를 복사하고, 필요한 헤더 추가
    const headers = { ...req.headers };
    // 호스트 헤더는 목적지 서버의 것으로 자동 변경되므로 삭제합니다.
    delete headers.host;
    // 커스텀 헤더에 인증된 사용자 ID 추가
    headers['X-User-ID'] = String(userId);

    // 3. HttpService(axios)를 사용해 메인 서버로 요청 전송
    return this.httpService.request({
      method,
      url: targetUrl,
      headers,
      data: body,
      // 응답을 스트림 형태로 받기 위해 설정
      responseType: 'stream',
    });
  }
}
