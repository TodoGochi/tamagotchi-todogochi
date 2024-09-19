import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TamagotchiController } from './tamagotchi.controller';
import { TamagotchiService } from './tamagotchi.service';
import { Experience } from './entity/experience.entity';
import { Tamagotchi } from './entity/tamagotchi.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Experience, Tamagotchi]),
    ScheduleModule.forRoot(),
  ],
  controllers: [TamagotchiController],
  providers: [TamagotchiService],
})
export class TamagotchiModule {}
