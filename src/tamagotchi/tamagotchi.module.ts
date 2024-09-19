import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TamagotchiController } from './tamagotchi.controller';
import { TamagotchiService } from './tamagotchi.service';
import { Experience } from './entity/experience.entity';
import { Tamagotchi } from './entity/tamagotchi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, Tamagotchi])],
  controllers: [TamagotchiController],
  providers: [TamagotchiService],
})
export class TamagotchiModule {}
