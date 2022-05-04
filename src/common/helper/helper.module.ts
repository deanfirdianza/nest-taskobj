import { Global, Module } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { DateService } from './date/date.service';
import { ResponseHandlerService } from './response-handler/response-handler.service';

@Global()
@Module({
  providers: [HashService, DateService, ResponseHandlerService],
  exports: [HashService, DateService, ResponseHandlerService],
})
export class HelperModule {}
