import { Injectable } from '@nestjs/common';
import { Tamagotchi } from './entity/tamagotchi.entity';
import { Experience } from './entity/experience.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiError } from 'src/common/error/api.error';
import { Interval } from '@nestjs/schedule';
import { HealthStatusType as HealthStatus } from 'src/tamagotchi/constant/health-status.enum';
import { LevelType } from './constant/level.enum';
import { UserService as UserServer } from 'src/provider/server/services/user.service';
import { rewardComment } from 'src/common/constants/reward-comments';
import { LevelEffect } from './entity/level-effect.entity';
@Injectable()
export class TamagotchiService {
  constructor(
    @InjectRepository(Tamagotchi)
    private readonly tamagotchiRepository: Repository<Tamagotchi>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    @InjectRepository(LevelEffect)
    private readonly levelEffectRepository: Repository<LevelEffect>,
    private readonly dataSource: DataSource,
    private readonly userService: UserServer,
  ) {}

  // happiness 1시간에 1씩 감소
  @Interval(3600000) // 1시간 = 3600000 밀리초
  async updateHappiness(): Promise<void> {
    const tamagotchis = await this.tamagotchiRepository.find();

    for (const tamagotchi of tamagotchis) {
      let updatedHappiness = tamagotchi.happiness;

      // happiness가 0보다 크면 1씩 감소
      if (updatedHappiness > 0) {
        updatedHappiness -= 1;
      }

      // Tamagotchi 엔티티 업데이트
      await this.tamagotchiRepository.update(
        { id: tamagotchi.id },
        { happiness: updatedHappiness },
      );
    }
    console.log('Happiness 업데이트 완료');
  }

  // hunger 3시간에 1씩 감소
  @Interval(10800000) // 3시간 = 10800000 밀리초
  async updateHunger(): Promise<void> {
    const tamagotchis = await this.tamagotchiRepository.find();

    for (const tamagotchi of tamagotchis) {
      let updatedHunger = tamagotchi.hunger;
      let updatedHealthStatus = tamagotchi.health_status;
      let updatedSickAt = tamagotchi.sick_at;

      // hunger가 0보다 크면 1씩 감소
      if (updatedHunger > 0 && tamagotchi.level !== LevelType.EGG) {
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
          (currentTime.getTime() - updatedSickAt.getTime()) / (1000 * 60 * 60); // 시간 차이 계산

        if (hoursDifference >= 10) {
          updatedHealthStatus = HealthStatus.DEAD;
        }
      }

      // Tamagotchi 엔티티 업데이트
      await this.tamagotchiRepository.update(
        { id: tamagotchi.id },
        {
          hunger: updatedHunger,
          health_status: updatedHealthStatus,
          sick_at: updatedSickAt,
        },
      );
    }
    console.log('hunger 업데이트 완료');
  }

  // 10분 간격으로 SICK 상태 확인 및 DEAD 상태 업데이트
  // 1시간
  @Interval(600000) // 10분 = 600000 밀리초
  async updateDeadStatus(): Promise<void> {
    const currentTime = new Date();

    const tamagotchis = await this.tamagotchiRepository.find({
      where: { health_status: HealthStatus.SICK },
    });

    for (const tamagotchi of tamagotchis) {
      if (tamagotchi.sick_at) {
        const hoursDifference =
          (currentTime.getTime() - tamagotchi.sick_at.getTime()) /
          (1000 * 60 * 60); // 시간 차이 계산

        if (hoursDifference >= 10) {
          // DEAD 상태로 업데이트
          await this.tamagotchiRepository.update(
            { id: tamagotchi.id }, // user_id 대신 id 사용
            { health_status: HealthStatus.DEAD },
          );
          console.log(
            `ID ${tamagotchi.id}의 Tamagotchi가 DEAD 상태로 변경되었습니다.`,
          );
        }
      }
    }

    console.log('Sick 상태 확인 및 DEAD 상태 업데이트 완료');
  }

  getNextLevel(tamagotchi: Tamagotchi): LevelType {
    const currentLevel = tamagotchi.level;

    if (currentLevel === LevelType.EGG) {
      const currentTime = new Date();
      const createdAt = new Date(tamagotchi.created_at);
      // 1레벨에서 2레벨로: 생성 후 2일이 지나면 자동 업그레이드
      // const daysDifference =
      //   (currentTime.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      // if (daysDifference >= 2) {
      //   console.log('2일 지남');
      //   return LevelType.BABY;
      // }

      //1분뒤 레벨업
      const secondsDifference =
        (currentTime.getTime() - createdAt.getTime()) / 1000;

      // 3분(180초) 경과 시 레벨 업
      if (secondsDifference >= 180) {
        console.log('1분 경과');
        return LevelType.BABY;
      }
    }

    // 2레벨에서 3레벨로: 행동이 각각 10번 이상일 때 업그레이드
    if (currentLevel === LevelType.BABY) {
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
  async levelUp(id: number, newLevel: LevelType): Promise<void> {
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { id },
    });

    if (tamagotchi) {
      // 레벨을 새로운 레벨로 변경
      tamagotchi.level = newLevel;

      console.log('레벨은', tamagotchi.level);

      await this.tamagotchiRepository.update(
        { id },
        { level: tamagotchi.level },
      );
    }
  }

  async createTamagotchi(input: {
    userId: number;
    nickname: string;
  }): Promise<Tamagotchi> {
    return await this.dataSource.transaction(async (manager) => {
      const existingTamagotchi = await manager.findOne(Tamagotchi, {
        where: { user_id: input.userId },
      });
      if (existingTamagotchi) {
        throw new ApiError('TAMAGOTCHI-0006');
      }

      const experience = new Experience();
      experience.feed = 0;
      experience.play = 0;
      experience.pet = 0;

      // Experience 엔티티를 먼저 저장
      const savedExperience = await manager.save(Experience, experience);

      // 3. LevelEffect 엔티티 두 개 생성 (1레벨, 2레벨)
      const levelEffects = Array.from({ length: 2 }, (_, i) => {
        const levelEffect = new LevelEffect();
        levelEffect.level = i + 1; // 레벨 1, 2
        levelEffect.effectApplied = false;
        return levelEffect;
      });

      const tamagotchiData: Partial<Tamagotchi> = {
        user_id: input.userId,
        nickname: input.nickname,
        happiness: 10,
        created_at: new Date(),
        hunger: 10,
        experience: savedExperience, // 저장된 experience 할당
        levelEffects: levelEffects,
      };

      // Tamagotchi 생성 및 저장
      const tamagotchi = await manager.save(Tamagotchi, tamagotchiData);

      return tamagotchi;
    });
  }

  async findOne(userId: number): Promise<Tamagotchi | null> {
    return this.tamagotchiRepository.findOne({
      where: { user_id: userId },
      relations: ['experience', 'levelEffects'],
    });
  }
  async findOneByTamagotchiId(
    tamagotchiId: number,
  ): Promise<Tamagotchi | null> {
    return this.tamagotchiRepository.findOne({
      where: { id: tamagotchiId },
      relations: ['experience'],
    });
  }

  async feed(id: number): Promise<Tamagotchi> {
    // 이미 존재하는 Tamagotchi 엔티티 가져오기
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { id },
      relations: ['experience'], // experience 관계를 포함하여 가져오기
    });

    if (!tamagotchi) {
      throw new ApiError('TAMAGOTCHI-0000');
    }

    // 현재 hunger 상태가 10 이상이면 먹일 수 없음
    if (tamagotchi.hunger >= 10) {
      throw new ApiError('TAMAGOTCHI-0002');
    }

    // feed 값을 증가시킴
    if (tamagotchi.experience) {
      tamagotchi.experience.feed += 1;
    } else {
      throw new ApiError('TAMAGOTCHI-0001'); // Experience가 없을 경우 에러 처리
    }

    // hunger 값 증가
    tamagotchi.hunger += 1;

    // Experience와 Tamagotchi 업데이트
    await this.tamagotchiRepository.save(tamagotchi);

    return tamagotchi;
  }

  async pet(id: number): Promise<Tamagotchi> {
    // 이미 존재하는 Tamagotchi 엔티티 가져오기 (experience 관계 포함)
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { id },
      relations: ['experience'], // experience를 포함하여 가져오기
    });

    if (!tamagotchi) {
      throw new ApiError('TAMAGOTCHI-0000');
    }

    // happiness가 10 미만일 때만 증가
    if (tamagotchi.happiness < 10) {
      tamagotchi.happiness += 1;
    }

    // experience의 pet 값 증가
    if (tamagotchi.experience) {
      tamagotchi.experience.pet += 1;
    } else {
      throw new ApiError('TAMAGOTCHI-0001'); // Experience가 없을 경우 에러 처리 (이 경우는 발생하지 않아야 함)
    }

    // Tamagotchi와 Experience 업데이트 및 저장
    await this.tamagotchiRepository.save(tamagotchi);

    return tamagotchi;
  }

  async cure(id: number): Promise<Tamagotchi> {
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { id },
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
    if (!sickTime) {
      throw new ApiError('TAMAGOTCHI-0003');
    }
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
      { id },
      {
        health_status: tamagotchi.health_status,
        sick_at: tamagotchi.sick_at,
        happiness: tamagotchi.happiness,
        hunger: tamagotchi.hunger,
      },
    );

    return tamagotchi;
  }

  async resurrect(id: number): Promise<Tamagotchi> {
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { id },
    });

    // 현재 상태가 "Dead"인지 확인
    if (tamagotchi.health_status !== HealthStatus.DEAD) {
      throw new ApiError('TAMAGOTCHI-0005'); // Tamagotchi가 Dead 상태가 아닐 때의 에러 처리
    }

    // 부활 진행: health_status를 "HEALTHY"로 변경, happiness와 hunger를 10으로 설정
    tamagotchi.health_status = HealthStatus.HEALTHY;
    tamagotchi.happiness = 10;
    tamagotchi.hunger = 10;

    // Tamagotchi와 Experience 업데이트
    await this.tamagotchiRepository.update(
      { id },
      {
        health_status: tamagotchi.health_status,
        happiness: tamagotchi.happiness,
        hunger: tamagotchi.hunger,
        sick_at: null, // 부활 시 sick_at을 null로 초기화
      },
    );

    return tamagotchi;
  }

  async restart(id: number): Promise<Tamagotchi> {
    // Tamagotchi 엔티티 가져오기 (experience 관계 포함)
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { id },
      relations: ['experience'],
    });

    if (!tamagotchi) {
      throw new ApiError('TAMAGOTCHI-0000'); // Tamagotchi가 존재하지 않을 경우 에러 처리
    }

    // 현재 상태가 "Dead"인지 확인
    if (tamagotchi.health_status !== HealthStatus.DEAD) {
      throw new ApiError('TAMAGOTCHI-0005'); // Tamagotchi가 Dead 상태가 아닐 때의 에러 처리
    }

    // 부활 진행: health_status를 "HEALTHY"로 변경, happiness와 hunger를 10으로 설정
    tamagotchi.health_status = HealthStatus.HEALTHY;
    tamagotchi.happiness = 10;
    tamagotchi.hunger = 10;
    tamagotchi.sick_at = null; // 부활 시 sick_at을 null로 초기화

    if (tamagotchi.experience) {
      tamagotchi.experience.feed = 0;
      tamagotchi.experience.pet = 0;
      tamagotchi.experience.play = 0;
    } else {
      throw new ApiError('TAMAGOTCHI-0001'); // Experience가 없을 경우 에러 처리 (이 경우는 발생하지 않아야 함)
    }

    // Tamagotchi와 Experience 업데이트 및 저장
    await this.tamagotchiRepository.save(tamagotchi);

    return tamagotchi;
  }

  async play(id: number): Promise<any> {
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { id },
      relations: ['experience'],
    });

    if (!tamagotchi) {
      throw new ApiError('TAMAGOTCHI-0000'); // Tamagotchi가 존재하지 않을 경우 에러 처리
    }

    // play 값 증가
    if (tamagotchi.experience) {
      tamagotchi.experience.play += 1;
    } else {
      throw new ApiError('TAMAGOTCHI-0001'); // Experience가 없을 경우 에러 처리 (이 경우는 발생하지 않아야 함)
    }

    // 30% 확률로 특정 기능 실행
    const randomValue = Math.random();
    if (randomValue <= 0.3) {
      // 50% 확률로 a 또는 b 실행
      const randomValueForAction = Math.random();
      const changeAmount = randomValueForAction <= 0.66 ? 1 : 2;

      console.log(`30% 확률로 ${changeAmount}코인 획득`);
      const response = await this.userService.post({
        path: `/user/${tamagotchi.user_id}/coin-transactions`,
        data: {
          changeAmount,
          description: `${rewardComment.play}`,
        },
      });

      const { coin } = response.data;

      // Tamagotchi 객체에 추가
      const updatedTamagotchi = {
        ...tamagotchi,
        coin, // 코인 정보 추가
        changeAmount, // 변경된 코인 양 추가
      };

      await this.tamagotchiRepository.save(tamagotchi);
      return updatedTamagotchi;
    }

    console.log('꽝');
    const response = await this.userService.get({
      path: `/user/${tamagotchi.user_id}`,
    });

    const { coin } = response.data;

    const updatedTamagotchi = {
      ...tamagotchi,
      coin, // 코인 정보 추가
      changeAmount: 0, // 변경된 코인 양 추가
    };

    await this.tamagotchiRepository.save(tamagotchi);
    return updatedTamagotchi;
  }

  async levelProgress(id: number): Promise<any> {
    const tamagotchi = await this.tamagotchiRepository.findOne({
      where: { id },
    });

    if (!tamagotchi) {
      throw new ApiError('TAMAGOTCHI-0000');
    }

    const createdAt = new Date(tamagotchi.created_at);
    console.log(createdAt);
    const now = new Date();

    // 48시간을 밀리초로 변환 (48시간 * 60분 * 60초 * 1000밀리초)
    // const fortyEightHoursInMs = 48 * 60 * 60 * 1000;

    const fortyEightHoursInMs = 60 * 1000 * 3;

    // 48시간에서 경과한 시간을 빼서 남은 시간 계산
    const elapsedMs = now.getTime() - createdAt.getTime();
    const remainedMs = fortyEightHoursInMs - elapsedMs;

    if (remainedMs <= 0) {
      return {
        hour: 0,
        min: 0,
      };
    }

    // 남은 시간을 시간과 분으로 변환
    const remainedHours = Math.floor(remainedMs / (60 * 60 * 1000));
    const remainedMinutes = Math.floor(
      (remainedMs % (60 * 60 * 1000)) / (60 * 1000),
    );

    return {
      hour: remainedHours,
      min: remainedMinutes,
    };
  }

  async levelUpEffect(tamagotchiId: number, level: number) {
    const tamagotchi = await this.tamagotchiRepository.findOneBy({
      id: tamagotchiId,
    });
    if (!tamagotchi) {
      throw new ApiError('TAMAGOTCHI-0000');
    }

    const existingEffect = await this.levelEffectRepository.findOne({
      where: { tamagotchi: { id: tamagotchiId }, level },
    });

    if (existingEffect) {
      throw new ApiError('TAMAGOTCHI-0007');
    }

    // 3. 중복되지 않은 경우 레벨 효과 생성 및 저장
    const levelEffect = this.levelEffectRepository.create({
      tamagotchi,
      level,
      effectApplied: true,
    });

    await this.levelEffectRepository.save(levelEffect);

    // 4. Tamagotchi와 레벨 효과 포함한 상태 반환
    const updatedTamagotchi = await this.tamagotchiRepository.findOne({
      where: { id: tamagotchiId },
      relations: ['levelEffects'], // 레벨 효과 포함
    });

    return updatedTamagotchi;
  }
}
