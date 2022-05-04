import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as moment from 'moment';
import { ResponseHandlerService } from './common/helper/response-handler/response-handler.service';

@Injectable()
export class UnixValidationPipe implements PipeTransform {
  constructor(private responseHandler: ResponseHandlerService) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const unixParam = (({
      Action_Time_Start,
      Action_Time_End,
      Action_Time,
    }) => ({
      Action_Time_Start: Action_Time_Start,
      Action_Time_End: Action_Time_End,
      Action_Time: Action_Time,
    }))(value);

    Object.keys(unixParam).forEach(
      (key) => unixParam[key] === undefined && delete unixParam[key],
    );
    Object.keys(unixParam).forEach((e) => {
      if (!moment(unixParam[e], 'X', true).isValid()) {
        throw new HttpException(
          {
            error: this.responseHandler.errorMessage.param,
            message: `${e} is not a valid Unix timestamp`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    return value;
  }
}
