import { HttpException } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

export const axiosErrorHandler = (error: any, serviceName?: string) => {
  if (error.response) {
    responseErrorHandler(error, serviceName);
  } else if (error.request) {
    requestErrorHandler(error, serviceName);
  } else {
    throw error;
  }
};

const responseErrorHandler = (error: any, serviceName?: string) => {
  throw new HttpException(
    {
      errorCode: error.response.data.errorCode || `${serviceName}-0000`,
      message: error.response.data.message || 'Internal Server Error',
    },
    error.response.status || HttpStatusCode.InternalServerError,
  );
};

const requestErrorHandler = (error: any, serviceName?: string) => {
  throw new HttpException(
    {
      errorCode: `${serviceName}-0000`,
      message: 'Service Unavailable :: ' + serviceName,
    },
    HttpStatusCode.ServiceUnavailable,
  );
};
