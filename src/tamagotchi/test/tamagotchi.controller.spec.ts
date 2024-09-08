import { Test, TestingModule } from '@nestjs/testing';
import { TamagotchiController } from './tamagotchi.controller';

describe('TamagotchiController', () => {
  let controller: TamagotchiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TamagotchiController],
    }).compile();

    controller = module.get<TamagotchiController>(TamagotchiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
