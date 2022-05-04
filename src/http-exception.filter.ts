import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public errorKey = {
    param: 'error_param',
    internalServer: 'error_internal_server',
    idNotFound: 'error_id_not_found',
  };

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status == HttpStatus.BAD_REQUEST) {
      response.status(status).json({
        message: 'Failed',
        error_key: this.errorKey.param,
        error_message: exception.getResponse()['error'],
        error_data: exception.getResponse()['message'],
      });
    } else if (status == HttpStatus.NOT_FOUND) {
      response.status(status).json({
        message: 'Failed',
        error_key: this.errorKey.idNotFound,
        error_message: exception.getResponse()['error'],
        error_data:
          exception.getResponse()['message']['name'] ??
          exception.getResponse()['message'],
      });
    } else {
      response.json({
        message: 'Failed',
        error_key: this.errorKey.internalServer,
        error_message: exception.getResponse()['error'],
        error_data: exception.getResponse()['message'],
      });
    }
  }
}
