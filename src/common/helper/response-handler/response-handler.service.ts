import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseHandlerService {
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

  error(
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

  success(
    data: any,
    currentPage: number,
    maxDataOnPage: number,
    maxPage: number,
    maxData: number,
  ) {
    return JSON.parse(
      `{
            "message": "Success",
            "data": { "List_Data" : ${data},
                "Pagination_Data": {
                    "Current_Page": ${currentPage},
                    "Max_Data_Per_Page": ${maxDataOnPage},
                    "Max_Page": ${maxPage},
                    "Total_All_Data": ${maxData}
                }    
            }
        }`,
    );
  }
}
