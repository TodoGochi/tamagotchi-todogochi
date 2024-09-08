import { Module } from '@nestjs/common';
import { TamagotchiController } from './tamagotchi.controller';
import { TamagotchiService } from './tamagotchi.service';

@Module({
  controllers: [TamagotchiController],
  providers: [TamagotchiService],
})
export class TamagotchiModule {}
