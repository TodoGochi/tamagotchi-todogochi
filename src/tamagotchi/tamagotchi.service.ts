import { Injectable } from '@nestjs/common';
import { TamagotchiRepository } from './repository/tamagotchi.repository';
import { Tamagotchi } from './entity/tamagotchi.entity';
import { Experience } from './entity/experience.entity';
import { Repository, DataSource } from 'typeorm'; // DataSource 임포트
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TamagotchiService {
  constructor(
    private readonly tamagotchiRepository: TamagotchiRepository,
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

      // Tamagotchi 반환
      return tamagotchi;
    });
  }

  async getTamagotchiByUserId(userId: number): Promise<Tamagotchi | null> {
    return this.tamagotchiRepository.getOneByPk(userId);
  }

  async feed(userId: number): Promise<Experience> {
    // 이미 존재하는 Experience 엔티티 가져오기
    const experience = await this.experienceRepository.findOne({
      where: { user_id: userId },
    });

    // feed 값을 증가시킴
    experience.feed += 1;

    await this.experienceRepository.update(
      { user_id: userId },
      { feed: experience.feed },
    );

    return await this.experienceRepository.findOne({
      where: { user_id: userId },
    });
  }

  // Pet 요청 시 호출되는 메서드
  async pet(userId: number): Promise<Experience> {
    // 이미 존재하는 Experience 엔티티 가져오기
    const experience = await this.experienceRepository.findOne({
      where: { user_id: userId },
    });

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
