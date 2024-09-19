import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TamagotchiController } from './tamagotchi.controller';
import { TamagotchiService } from './tamagotchi.service';
import { Experience } from './entity/experience.entity';
import { Tamagotchi } from './entity/tamagotchi.entity';
import { TamagotchiRepository } from './repository/tamagotchi.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Experience, Tamagotchi, TamagotchiRepository]),
  ],
  controllers: [TamagotchiController],
  providers: [TamagotchiService, TamagotchiRepository],
})
export class TamagotchiModule {}
