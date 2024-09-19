import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TamagotchiRepository } from './repository/tamagotchi.repository';
import { CreateTamagotchiDto } from './dto/create-Tamagotchi.dto';
import { Tamagotchi } from './entity/tamagotchi.entity';

@Injectable()
export class TamagotchiService {
  constructor(
    @InjectRepository(TamagotchiRepository)
    private readonly tamagotchiRepository: TamagotchiRepository,
  ) {}

  async createTamagotchi(
    createTamagotchiDto: CreateTamagotchiDto,
  ): Promise<Tamagotchi> {
    const { userId, nickName } = createTamagotchiDto;

    const tamagotchi = await this.tamagotchiRepository.createDamagotchi(
      userId,
      nickName,
    );
    return tamagotchi;
  }
}
