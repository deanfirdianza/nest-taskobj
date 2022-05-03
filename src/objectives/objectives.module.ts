import { Module } from '@nestjs/common';
import { ObjectivesService } from './objectives.service';
import { ObjectivesController } from './objectives.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ObjectivesController],
  providers: [ObjectivesService, PrismaService],
  exports: [ObjectivesService],
})
export class ObjectivesModule {}
