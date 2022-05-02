import { Global, Module } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { DateService } from './date/date.service';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { ResponseHandlerService } from './response-handler/response-handler.service';

@Global()
@Module({
  providers: [
    HashService,
    DateService,
    ErrorHandlerService,
    ResponseHandlerService,
  ],
  exports: [
    HashService,
    DateService,
    ErrorHandlerService,
    ResponseHandlerService,
  ],
})
export class HelperModule {}
