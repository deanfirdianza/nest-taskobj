import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from '../prisma.service';
import { ObjectivesModule } from '../objectives/objectives.module';

@Module({
  imports: [ObjectivesModule],
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}
