import { Body, Controller, Post } from '@nestjs/common';
import { TamagotchiService } from './tamagotchi.service';
import { CreateTamagotchiDto } from './dto/create-Tamagotchi.dto';
import { Tamagotchi } from './entity/tamagotchi.entity';

@Controller('tamagotchi')
export class TamagotchiController {
  constructor(private readonly tamagotchiService: TamagotchiService) {}

  @Post('create')
  async createTamagotchi(
    @Body() createTamagotchiDto: CreateTamagotchiDto,
  ): Promise<Tamagotchi> {
    return await this.tamagotchiService.createTamagotchi(createTamagotchiDto);
  }
}
