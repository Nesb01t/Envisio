import { Module } from '@nestjs/common';
import { TransformService } from './transform.service';
import { TransformController } from './transform.controller';

@Module({
  providers: [TransformService],
  controllers: [TransformController],
})
export class TransformModule {}
