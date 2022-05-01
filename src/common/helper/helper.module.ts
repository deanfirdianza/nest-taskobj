import { Global, Module } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { DateService } from './date/date.service';

@Global()
@Module({
  providers: [HashService, DateService],
  exports: [HashService],
})
export class HelperModule {}
