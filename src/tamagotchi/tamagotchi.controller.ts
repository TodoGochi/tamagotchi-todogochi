import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TamagotchiService } from './tamagotchi.service';
import { CreateTamagotchiDto } from './dto/create-Tamagotchi.dto';
import { Tamagotchi } from './entity/tamagotchi.entity';
import { TamagotchiStatusHealthyInterceptor } from 'src/interceptors/tamagotchi-status-healthy.interceptor';
import { TamagotchiStatusSickInterceptor } from 'src/interceptors/tamagotchi-status-sick.interceptor';
import { LevelUpInterceptor } from 'src/interceptors/level-up.interceptor';

@Controller('tamagotchi')
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
  async feed(@Param('id') id: number) {
    return this.tamagotchiService.feed(id);
  }

  @Post(':id/pet')
  @UseInterceptors(TamagotchiStatusHealthyInterceptor, LevelUpInterceptor)
  async pet(@Param('id') id: number) {
    return this.tamagotchiService.pet(id);
  }

  @Post(':id/cure')
  @UseInterceptors(TamagotchiStatusSickInterceptor, LevelUpInterceptor)
  async cure(@Param('id') id: number) {
    return this.tamagotchiService.cure(id);
  }

  @Post(':id/resurrect')
  @UseInterceptors(LevelUpInterceptor)
  async resurrect(@Param('id') id: number) {
    return this.tamagotchiService.resurrect(id);
  }

  @Post(':id/play')
  @UseInterceptors(TamagotchiStatusHealthyInterceptor, LevelUpInterceptor)
  async play(@Body('userId') userId: number, @Param('id') id: number) {
    return this.tamagotchiService.play(userId, id);
  }

  @Post(':id/restart')
  async restart(@Param('id') id: number) {
    return this.tamagotchiService.restart(id);
  }

  @Get(':id/level-progress')
  @UseInterceptors(LevelUpInterceptor)
  async levelProgress(@Param('id') id: number) {
    return this.tamagotchiService.levelProgress(id);
  }
}
