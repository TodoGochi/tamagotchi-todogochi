import { Test, TestingModule } from '@nestjs/testing';
import { TamagotchiService } from './tamagotchi.service';

describe('TamagotchiService', () => {
  let service: TamagotchiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TamagotchiService],
    }).compile();

    service = module.get<TamagotchiService>(TamagotchiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
