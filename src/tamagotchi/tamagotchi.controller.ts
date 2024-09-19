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
import { TamagotchiStatusInterceptor } from 'src/interceptors/tamagotchi-status.interceptor';

@Controller('tamagotchi')
export class TamagotchiController {
  constructor(private readonly tamagotchiService: TamagotchiService) {}

  @Post('create')
  async createTamagotchi(
    @Body() body: CreateTamagotchiDto,
  ): Promise<Tamagotchi> {
    return await this.tamagotchiService.createTamagotchi(body);
  }

  @Get()
  async getTamagotchiByUserId(@Body('userId') userId: number) {
    return this.tamagotchiService.getTamagotchiByUserId(userId);
  }

  @Post('feed')
  @UseInterceptors(TamagotchiStatusInterceptor)
  async feed(@Body('userId') userId: number) {
    return this.tamagotchiService.feed(userId);
  }

  @Post('pet')
  @UseInterceptors(TamagotchiStatusInterceptor)
  async pet(@Body('userId') userId: number) {
    return this.tamagotchiService.pet(userId);
  }

  // @Post('play')
  // @UseInterceptors(TamagotchiStatusInterceptor)
  // async play(@Body('userId') userId: number) {
  //   return this.tamagotchiService.play(userId);
  // }
}
