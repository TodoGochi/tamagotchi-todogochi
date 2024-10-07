import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { TamagotchiService } from './tamagotchi.service';
import { CreateTamagotchiDto } from './dto/create-Tamagotchi.dto';
import { Tamagotchi } from './entity/tamagotchi.entity';
import { TamagotchiStatusHealthyInterceptor } from 'src/interceptors/tamagotchi-status-healthy.interceptor';
import { TamagotchiStatusSickInterceptor } from 'src/interceptors/tamagotchi-status-sick.interceptor';
import { LevelUpInterceptor } from 'src/interceptors/level-up.interceptor';
import { TamagotchiParamDto } from './dto/tamagotchi-param.dto';

@Controller('tamagotchi')
@UseInterceptors(ClassSerializerInterceptor)
export class TamagotchiController {
  constructor(private readonly tamagotchiService: TamagotchiService) {}

  @Post('create')
  async createTamagotchi(
    @Body() body: CreateTamagotchiDto,
  ): Promise<Tamagotchi> {
    return await this.tamagotchiService.createTamagotchi(body);
  }

  @Get(':id/status')
  @UseInterceptors(LevelUpInterceptor)
  async getTamagotchiByUserId(@Param('id') id: number) {
    return this.tamagotchiService.findOne(id);
  }

  @Post(':id/feed')
  @UseInterceptors(TamagotchiStatusHealthyInterceptor, LevelUpInterceptor)
  async feed(@Param() params: TamagotchiParamDto) {
    return this.tamagotchiService.feed(params.id);
  }

  @Post(':id/pet')
  @UseInterceptors(TamagotchiStatusHealthyInterceptor, LevelUpInterceptor)
  async pet(@Param() params: TamagotchiParamDto) {
    return this.tamagotchiService.pet(params.id);
  }

  @Post(':id/cure')
  @UseInterceptors(TamagotchiStatusSickInterceptor, LevelUpInterceptor)
  async cure(@Param() params: TamagotchiParamDto) {
    return this.tamagotchiService.cure(params.id);
  }

  @Post(':id/resurrect')
  @UseInterceptors(LevelUpInterceptor)
  async resurrect(@Param() params: TamagotchiParamDto) {
    return this.tamagotchiService.resurrect(params.id);
  }

  @Post(':id/play')
  @UseInterceptors(TamagotchiStatusHealthyInterceptor, LevelUpInterceptor)
  async play(@Param() params: TamagotchiParamDto) {
    return this.tamagotchiService.play(params.id);
  }

  @Post(':id/restart')
  async restart(@Param() params: TamagotchiParamDto) {
    return this.tamagotchiService.restart(params.id);
  }

  @Get(':id/level-progress')
  @UseInterceptors(LevelUpInterceptor)
  async levelProgress(@Param() params: TamagotchiParamDto) {
    return this.tamagotchiService.levelProgress(params.id);
  }

  @Get(':id/statusbytamagotchi')
  async statusByTamagotchiId(@Param() params: TamagotchiParamDto) {
    return this.tamagotchiService.findOneByTamagotchiId(params.id);
  }
}
