import { Module } from '@nestjs/common';
import { HelperModule } from './common/helper/helper.module';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HelperModule,
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}
