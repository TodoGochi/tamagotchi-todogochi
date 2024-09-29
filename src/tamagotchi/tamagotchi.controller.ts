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
  async getTamagotchiByUserId(@Param('id') id: number) {
    return this.tamagotchiService.findOne(id);
  }

  @Post('feed')
  @UseInterceptors(TamagotchiStatusHealthyInterceptor, LevelUpInterceptor)
  async feed(@Body('userId') userId: number) {
    return this.tamagotchiService.feed(userId);
  }

  @Post('pet')
  async pet(@Body('userId') userId: number) {
    return this.tamagotchiService.pet(userId);
  }

  @Post('cure')
  @UseInterceptors(TamagotchiStatusSickInterceptor)
  async cure(@Body('userId') userId: number) {
    return this.tamagotchiService.cure(userId);
  }

  @Post('resurrect')
  async resurrect(@Body('userId') userId: number) {
    return this.tamagotchiService.resurrect(userId);
  }

  @Post('play')
  @UseInterceptors(TamagotchiStatusHealthyInterceptor, LevelUpInterceptor)
  async play(@Body('userId') userId: number) {
    return this.tamagotchiService.play(userId);
  }

  @Post('restart')
  async restart(@Body('userId') userId: number) {
    return this.tamagotchiService.restart(userId);
  }

  @Get(':id/level-progress')
  async levelProgress(@Param('id') id: number) {
    return this.tamagotchiService.levelProgress(id);
  }
}
