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
  'TAMAGOTCHI-0003': {
    errorCode: 'TAMAGOTCHI-0003',
    message: 'Tamagotchi is not sick',
    statusCode: HttpStatusCode.Forbidden,
  },
  'TAMAGOTCHI-0004': {
    errorCode: 'TAMAGOTCHI-0004',
    message: 'Tamagotchi can not be cured',
    statusCode: HttpStatusCode.Forbidden,
  },
  'TAMAGOTCHI-0005': {
    errorCode: 'TAMAGOTCHI-0005',
    message: 'Tamagotchi is not dead',
    statusCode: HttpStatusCode.Forbidden,
  },
  'TAMAGOTCHI-0006': {
    errorCode: 'TAMAGOTCHI-0006',
    message: 'User already has a tamagotchi',
    statusCode: HttpStatusCode.Forbidden,
  },
  'TAMAGOTCHI-0007': {
    errorCode: 'TAMAGOTCHI-0007',
    message: 'LevelUp Effect already applied',
    statusCode: HttpStatusCode.Forbidden,
  },
  'TAMAGOTCHI-0008': {
    errorCode: 'TAMAGOTCHI-0008',
    message: 'Not Valid Level',
    statusCode: HttpStatusCode.Forbidden,
  },
};
