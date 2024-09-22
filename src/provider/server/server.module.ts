import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import axios from 'axios';
import { Config } from 'src/common/environment/config';

@Module({
  imports: [HttpModule],
  providers: [
    UserService,
    {
      provide: 'USER_SERVER',
      useFactory: () => {
        return axios.create({
          baseURL: Config.getEnvironment().USER_SERVER_ADDR,
        });
      },
    },
  ],
  exports: [UserService],
})
export class ServerModule {}
