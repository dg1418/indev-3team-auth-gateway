import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envVariableKeys } from './const/env.const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(envVariableKeys.accessTokenSecret),
    });
  }

  async validate(payload: { sub: number | string }) {
    // passport-jwt가 토큰 검증을 완료한 후, 유효한 경우에만 validate 메소드를 호출합니다.
    // 여기서 반환되는 값은 request.user에 담기게 됩니다.
    return { id: payload.sub };
  }
}
