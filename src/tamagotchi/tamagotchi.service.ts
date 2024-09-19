import { Injectable } from '@nestjs/common';
import { Tamagotchi } from './entity/tamagotchi.entity';
import { Experience } from './entity/experience.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiError } from 'src/common/error/api.error';

@Injectable()
export class TamagotchiService {
  constructor(
    @InjectRepository(Tamagotchi)
    private readonly tamagotchiRepository: Repository<Tamagotchi>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    private readonly dataSource: DataSource,
  ) {}

  async createTamagotchi(input: {
    userId: number;
    nickname: string;
  }): Promise<Tamagotchi> {
    return await this.dataSource.transaction(async (manager) => {
      const tamagotchiData: Partial<Tamagotchi> = {
        user_id: input.userId,
        nickname: input.nickname,
        happiness: 10,
        created_at: new Date(),
        hunger: 0,
      };

      // Tamagotchi 생성 및 저장
      const tamagotchi = await manager.save(Tamagotchi, tamagotchiData);

      // Experience 생성 및 저장
      const experience = this.experienceRepository.create({
        user_id: input.userId,
        feed: 0,
        play: 0,
        pet: 0,
      });
      await manager.save(Experience, experience);

      return tamagotchi;
    });
  }

  async findOne(userId: number): Promise<Tamagotchi | null> {
    return this.tamagotchiRepository.findOne({
      where: { user_id: userId },
      relations: ['experience'],
    });
  }

  async feed(userId: number): Promise<Experience> {
    // 이미 존재하는 Tamagotchi 엔티티 가져오기
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { user_id: userId },
    });

    if (!tamagotchi) {
      throw new ApiError('TAMAGOTCHI-0000');
    }

    // 현재 hunger 상태가 10 이상이면 먹일 수 없음
    if (tamagotchi.hunger >= 10) {
      throw new ApiError('TAMAGOTCHI-0002');
    }

    // 이미 존재하는 Experience 엔티티 가져오기
    const experience = await this.experienceRepository.findOne({
      where: { user_id: userId },
    });

    // feed 값을 증가시킴
    experience.feed += 1;

    // hunger 값 증가
    tamagotchi.hunger += 1;

    // Experience와 Tamagotchi 업데이트
    await this.experienceRepository.update(
      { user_id: userId },
      { feed: experience.feed },
    );

    await this.tamagotchiRepository.update(
      { user_id: userId },
      { hunger: tamagotchi.hunger },
    );

    return experience;
  }

  async pet(userId: number): Promise<Experience> {
    // 이미 존재하는 Experience 엔티티 가져오기
    const experience = await this.experienceRepository.findOne({
      where: { user_id: userId },
    });

    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { user_id: userId },
    });

    if (tamagotchi.happiness < 10) {
      tamagotchi.happiness += 1;
      await this.tamagotchiRepository.update(
        { user_id: userId },
        { happiness: tamagotchi.happiness },
      );
    }

    // pet 값을 증가시킴
    experience.pet += 1;

    // 엔티티 업데이트 및 저장
    await this.experienceRepository.update(
      { user_id: userId },
      { pet: experience.pet },
    );

    return experience;
  }
}
