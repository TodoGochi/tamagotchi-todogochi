import { HttpStatusCode } from 'axios';

export const ERRORS = {
  'USER-0000': {
    errorCode: 'USER-0000',
    message: 'Unknown error, please contact server administrator',
    statusCode: HttpStatusCode.InternalServerError,
  },
  'TAMAGOTCHI-0000': {
    errorCode: 'TAMAGOTCHI-0000',
    message: 'Tamagotchi does not exist',
    statusCode: HttpStatusCode.Forbidden,
  },
  'TAMAGOTCHI-0001': {
    errorCode: 'TAMAGOTCHI-0001',
    message: 'Tamagotchi is not healty',
    statusCode: HttpStatusCode.Forbidden,
  },
  'TAMAGOTCHI-0002': {
    errorCode: 'TAMAGOTCHI-0002',
    message: 'hunger status already max',
    statusCode: HttpStatusCode.Forbidden,
  },
};
