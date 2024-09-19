import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TamagotchiService } from 'src/tamagotchi/tamagotchi.service';
import { Tamagotchi } from 'src/tamagotchi/entity/tamagotchi.entity';

@Injectable()
export class LevelUpInterceptor implements NestInterceptor {
  constructor(private readonly tamagotchiService: TamagotchiService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data: Tamagotchi) => {
        // 현재 userId로 Tamagotchi 엔티티 가져오기
        const tamagotchi = await this.tamagotchiService.findOne(data.user_id);

        // 다음 레벨 결정
        const nextLevel = this.tamagotchiService.getNextLevel(tamagotchi);

        // 레벨 업이 필요한 경우에만 수행
        if (nextLevel !== tamagotchi.level) {
          await this.tamagotchiService.levelUp(tamagotchi.user_id, nextLevel);
        }

        return data;
      }),
    );
  }
}
