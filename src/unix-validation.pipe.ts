import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as moment from 'moment';
import { ErrorHandlerService } from './common/helper/error-handler/error-handler.service';

@Injectable()
export class UnixValidationPipe implements PipeTransform {
  constructor(private errorHandler: ErrorHandlerService) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const unixParam = (({ Action_Time_Start, Action_Time_End }) => ({
      Action_Time_Start: Action_Time_Start,
      Action_Time_End: Action_Time_End,
    }))(value);
    Object.keys(unixParam).forEach(
      (key) => unixParam[key] === undefined && delete unixParam[key],
    );
    Object.keys(unixParam).forEach((e) => {
      if (!moment(unixParam[e], 'X', true).isValid()) {
        throw new HttpException(
          {
            error: this.errorHandler.errorMessage.param,
            message: `${e} is not a valid Unix timestamp`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    return value;
  }
}
