import { Repository } from 'typeorm';
import { Tamagotchi } from '../entity/tamagotchi.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TamagotchiRepository extends Repository<Tamagotchi> {
  async createDamagotchi(
    userId: number,
    nickname: string,
  ): Promise<Tamagotchi> {
    const tamagotchi = this.create({
      user_id: userId,
      nickname,
      // 기본값 설정
      level_id: 1,
      health_id: 1,
      happiness: 100,
      created_at: new Date(),
    });

    await this.save(tamagotchi);
    return tamagotchi;
  }
}
