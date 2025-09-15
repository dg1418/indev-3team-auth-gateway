import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { HttpModule } from '@nestjs/axios';
import { GatewayService } from './gateway.service';

@Module({
  imports: [HttpModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
