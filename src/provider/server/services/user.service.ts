import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import {
  HttpDeleteRequest,
  HttpGetRequest,
  HttpPostRequest,
  HttpPutRequest,
} from '../utils/server.type';
import { axiosErrorHandler } from 'src/common/util/axios-error.handler';
import { SERVICE_NAME } from '../constants/service-name.constant';

@Injectable()
export class UserService {
  public serviceName = SERVICE_NAME.USER;
  constructor(
    @Inject('USER_SERVER')
    private readonly userServer: AxiosInstance,
  ) {}

  async get(data: HttpGetRequest) {
    try {
      return await this.userServer.get(data.path, data.config);
    } catch (error) {
      axiosErrorHandler(error, this.serviceName);
    }
  }

  async post(data: HttpPostRequest) {
    try {
      return await this.userServer.post(data.path, data.data, data.config);
    } catch (error) {
      axiosErrorHandler(error, this.serviceName);
    }
  }

  async put(data: HttpPutRequest) {
    try {
      return await this.userServer.put(data.path, data.data, data.config);
    } catch (error) {
      axiosErrorHandler(error, this.serviceName);
    }
  }

  async delete(data: HttpDeleteRequest) {
    try {
      return await this.userServer.delete(data.path, data.config);
    } catch (error) {
      axiosErrorHandler(error, this.serviceName);
    }
  }
}
