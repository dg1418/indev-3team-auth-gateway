import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SocialUser } from './interfaces/social-user.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    // AuthGuard will redirect
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(
    @Req() req: { user: SocialUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.kakaoLogin(
      req.user,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true, // TODO: HTTPS 적용 시 주석 해제
      sameSite: 'strict',
    });

    return { accessToken };
  }
}
