import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tamagotchi } from '../entity/tamagotchi.entity';

@Injectable()
export class TamagotchiRepository {
  constructor(
    @InjectRepository(Tamagotchi)
    private readonly tamagotchiRepository: Repository<Tamagotchi>,
  ) {}

  async createTamagotchi(data: Partial<Tamagotchi>): Promise<Tamagotchi> {
    const newTamagotchi = this.tamagotchiRepository.create(data);
    await this.tamagotchiRepository.save(newTamagotchi);

    // 저장된 엔티티를 다시 조회하여 반환
    return this.tamagotchiRepository.findOne({
      where: { user_id: newTamagotchi.user_id },
    });
  }

  async getOneByPk(userId: number): Promise<Tamagotchi | null> {
    return this.tamagotchiRepository.findOne({ where: { user_id: userId } });
  }
}
