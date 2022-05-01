import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorHandlerService {
  public errorKey = {
    param: 'error_param',
    internalServer: 'error_internal_server',
    idNotFound: 'error_id_not_found',
  };

  public errorMessage = {
    param: 'Incorrect parameter',
    internalServer: 'Internal Server Error',
    idNotFound: 'One or more records that were required not found',
  };

  response(
    errorMessage = this.errorMessage.internalServer,
    errorKey = this.errorKey.internalServer,
    data = '{}',
  ) {
    return JSON.parse(
      `{
          "message": "Failed",
          "error_key": "${errorKey}",
          "error_message": "${errorMessage}",        
          "error_data": ${data}
        }`,
    );
  }
}
