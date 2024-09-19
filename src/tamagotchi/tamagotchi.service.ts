import { Injectable } from '@nestjs/common';
import { Tamagotchi } from './entity/tamagotchi.entity';
import { Experience } from './entity/experience.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiError } from 'src/common/error/api.error';
import { Interval } from '@nestjs/schedule';
import { HealthStatusType as HealthStatus } from 'src/tamagotchi/constant/health-status.enum';
import { LevelType } from './constant/level.enum';

@Injectable()
export class TamagotchiService {
  constructor(
    @InjectRepository(Tamagotchi)
    private readonly tamagotchiRepository: Repository<Tamagotchi>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    private readonly dataSource: DataSource,
  ) {}

  @Interval(2000) // 1시간 = 3600000 밀리초
  async updateTamagotchiStatus(): Promise<void> {
    // 모든 Tamagotchi 가져오기
    const tamagotchis = await this.tamagotchiRepository.find();

    for (const tamagotchi of tamagotchis) {
      let updatedHappiness = tamagotchi.happiness;
      let updatedHunger = tamagotchi.hunger;
      let updatedHealthStatus = tamagotchi.health_status;
      let updatedSickAt = tamagotchi.sick_at;

      // happiness와 hunger가 0보다 크면 1씩 감소
      if (updatedHappiness > 0) {
        updatedHappiness -= 1;
      }
      if (updatedHunger > 0) {
        updatedHunger -= 1;
      }

      // hunger가 0이 되면 health_status를 "sick"으로 변경하고 sick_at에 현재 시간 입력
      if (updatedHunger === 0 && updatedHealthStatus !== HealthStatus.SICK) {
        updatedHealthStatus = HealthStatus.SICK;
        updatedSickAt = new Date();
      }

      // sick 상태일 때 10시간이 지났는지 확인
      if (updatedHealthStatus === HealthStatus.SICK && updatedSickAt) {
        const currentTime = new Date();
        const hoursDifference =
          // (currentTime.getTime() - updatedSickAt.getTime()) / (1000 * 60 * 60);
          currentTime.getTime() - updatedSickAt.getTime();

        if (hoursDifference >= 10) {
          updatedHealthStatus = HealthStatus.DEAD;
        }
      }

      // Tamagotchi 엔티티 업데이트
      await this.tamagotchiRepository.update(
        { user_id: tamagotchi.user_id },
        {
          happiness: updatedHappiness,
          hunger: updatedHunger,
          health_status: updatedHealthStatus,
          sick_at: updatedSickAt,
        },
      );
    }
  }

  getNextLevel(tamagotchi: Tamagotchi): LevelType {
    const currentLevel = tamagotchi.level;

    // 1레벨에서 2레벨로: 생성 후 2일이 지나면 자동 업그레이드
    if (currentLevel === LevelType.EGG) {
      const currentTime = new Date();
      const createdAt = new Date(tamagotchi.created_at);
      const daysDifference =
        (currentTime.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDifference >= 2) {
        return LevelType.YOUTH;
      }
    }

    // 2레벨에서 3레벨로: 행동이 각각 10번 이상일 때 업그레이드
    if (currentLevel === LevelType.YOUTH) {
      const experience = tamagotchi.experience;

      if (
        experience.feed >= 10 &&
        experience.play >= 10 &&
        experience.pet >= 10
      ) {
        return LevelType.ADULT;
      }
    }

    // 조건을 만족하지 않으면 현재 레벨 유지
    return currentLevel;
  }

  // 레벨 업을 수행하는 메소드
  async levelUp(userId: number, newLevel: LevelType): Promise<void> {
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { user_id: userId },
    });

    if (tamagotchi) {
      // 레벨을 새로운 레벨로 변경
      tamagotchi.level = newLevel;

      await this.tamagotchiRepository.update(
        { user_id: userId },
        { level: tamagotchi.level },
      );
    }
  }

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

  async cure(userId: number): Promise<Tamagotchi> {
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { user_id: userId },
    });

    if (!tamagotchi) {
      throw new ApiError('TAMAGOTCHI-0000'); // Tamagotchi가 없을 때의 에러 처리
    }

    // 현재 상태가 sick인지 확인
    if (tamagotchi.health_status !== HealthStatus.SICK) {
      throw new ApiError('TAMAGOTCHI-0003'); // Tamagotchi가 sick 상태가 아닐 때의 에러 처리
    }

    // sick_at으로부터 10시간이 지났는지 확인
    const currentTime = new Date();
    const sickTime = tamagotchi.sick_at;
    const hoursDifference =
      (currentTime.getTime() - sickTime.getTime()) / (1000 * 60 * 60);

    if (hoursDifference > 10) {
      throw new ApiError('TAMAGOTCHI-0004'); // 10시간이 지났을 때의 에러 처리
    }

    // 치료 진행: 상태를 HEALTHY로 변경, sick_at을 null로 설정, happiness와 hunger를 최대값으로 설정
    tamagotchi.health_status = HealthStatus.HEALTHY;
    tamagotchi.sick_at = null;
    tamagotchi.happiness = 10; // happiness 최대값 설정
    tamagotchi.hunger = 10; // hunger 최대값 설정

    // 변경사항 저장
    await this.tamagotchiRepository.update(
      { user_id: userId },
      {
        health_status: tamagotchi.health_status,
        sick_at: tamagotchi.sick_at,
        happiness: tamagotchi.happiness,
        hunger: tamagotchi.hunger,
      },
    );

    return tamagotchi;
  }

  async resurrect(userId: number): Promise<Tamagotchi> {
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { user_id: userId },
    });

    // 현재 상태가 "Dead"인지 확인
    if (tamagotchi.health_status !== HealthStatus.DEAD) {
      throw new ApiError('TAMAGOTCHI-0005'); // Tamagotchi가 Dead 상태가 아닐 때의 에러 처리
    }

    // Experience 엔티티 가져오기
    const experience = await this.experienceRepository.findOne({
      where: { user_id: userId },
    });

    // 부활 진행: health_status를 "HEALTHY"로 변경, happiness와 hunger를 10으로 설정
    tamagotchi.health_status = HealthStatus.HEALTHY;
    tamagotchi.happiness = 10;
    tamagotchi.hunger = 10;

    // Experience의 모든 속성을 0으로 초기화
    experience.feed = 0;
    experience.play = 0;
    experience.pet = 0;

    // Tamagotchi와 Experience 업데이트
    await this.tamagotchiRepository.update(
      { user_id: userId },
      {
        health_status: tamagotchi.health_status,
        happiness: tamagotchi.happiness,
        hunger: tamagotchi.hunger,
        sick_at: null, // 부활 시 sick_at을 null로 초기화
      },
    );

    await this.experienceRepository.update(
      { user_id: userId },
      {
        feed: experience.feed,
        play: experience.play,
        pet: experience.pet,
      },
    );

    return tamagotchi;
  }
}
