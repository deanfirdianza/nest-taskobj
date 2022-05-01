import { Global, Module } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { DateService } from './date/date.service';
import { ErrorHandlerService } from './error-handler/error-handler.service';

@Global()
@Module({
  providers: [HashService, DateService, ErrorHandlerService],
  exports: [HashService, DateService, ErrorHandlerService],
})
export class HelperModule {}
