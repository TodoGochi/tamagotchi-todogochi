import { Injectable } from '@nestjs/common';
import { TamagotchiRepository } from './repository/tamagotchi.repository';
import { Tamagotchi } from './entity/tamagotchi.entity';

@Injectable()
export class TamagotchiService {
  constructor(private readonly tamagotchiRepository: TamagotchiRepository) {}

  async createTamagotchi(input: {
    userId: number;
    nickname: string;
  }): Promise<Tamagotchi> {
    // Tamagotchi를 생성할 때 필요한 기본값 설정
    const tamagotchiData: Partial<Tamagotchi> = {
      user_id: input.userId,
      nickname: input.nickname,
      happiness: 10,
      created_at: new Date(),
    };

    return this.tamagotchiRepository.createTamagotchi(tamagotchiData);
  }

  async getTamagotchiByUserId(userId: number): Promise<Tamagotchi | null> {
    return this.tamagotchiRepository.getOneByPk(userId);
  }
}
