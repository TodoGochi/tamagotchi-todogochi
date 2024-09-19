import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TamagotchiController } from './tamagotchi.controller';
import { TamagotchiService } from './tamagotchi.service';
import { Experience } from './entity/experience.entity';
import { HealthStatus } from './entity/health-status.entity';
import { Level } from './entity/level.entity';
import { Tamagotchi } from './entity/tamagotchi.entity';
import { TamagotchiRepository } from './repository/tamagotchi.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Experience,
      HealthStatus,
      Level,
      Tamagotchi,
      TamagotchiRepository,
    ]),
  ],
  controllers: [TamagotchiController],
  providers: [TamagotchiService],
})
export class TamagotchiModule {}
