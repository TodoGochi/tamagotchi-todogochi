import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/core/filters/http-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './common/environment/config';
import { TamagotchiModule } from './tamagotchi/tamagotchi.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: Config.getEnvironment().DATABASE.type,
      host: Config.getEnvironment().DATABASE.host,
      port: Config.getEnvironment().DATABASE.port,
      username: Config.getEnvironment().DATABASE.username,
      password: Config.getEnvironment().DATABASE.password,
      database: Config.getEnvironment().DATABASE.database,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TamagotchiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
