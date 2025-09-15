import {
  All,
  Controller,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { GatewayService } from './gateway.service';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Controller('api')
@UseGuards(AuthGuard('jwt'))
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @All('*')
  async proxyRequest(@Req() req: Request, @Res() res: Response) {
    try {
      const serviceResponse = await firstValueFrom(
        await this.gatewayService.proxyRequest(req),
      );

      res.status(serviceResponse.status);
      // 응답 헤더를 클라이언트에게 그대로 전달
      for (const [key, value] of Object.entries(serviceResponse.headers)) {
        res.setHeader(key, value);
      }

      // 메인 서버의 응답 스트림을 클라이언트에게 파이핑
      serviceResponse.data.pipe(res);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // 메인 서버에서 오류를 반환한 경우, 해당 상태 코드와 응답을 그대로 전달
        res.status(error.response.status).json(error.response.data);
      } else {
        // 그 외의 오류는 내부 서버 오류로 처리
        throw new HttpException(
          'An unexpected error occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
