import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TamagotchiController } from './tamagotchi.controller';
import { TamagotchiService } from './tamagotchi.service';
import { Experience } from './entity/experience.entity';
import { Tamagotchi } from './entity/tamagotchi.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ServerModule } from 'src/provider/server/server.module';
import { LevelEffect } from './entity/level-effect.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Experience, Tamagotchi, LevelEffect]),
    ScheduleModule.forRoot(),
    ServerModule,
  ],
  controllers: [TamagotchiController],
  providers: [TamagotchiService],
})
export class TamagotchiModule {}
