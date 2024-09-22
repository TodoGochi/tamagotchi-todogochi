import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TamagotchiService } from 'src/tamagotchi/tamagotchi.service';
import { Tamagotchi } from 'src/tamagotchi/entity/tamagotchi.entity';

@Injectable()
export class LevelUpInterceptor implements NestInterceptor {
  constructor(private readonly tamagotchiService: TamagotchiService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap(async (data: any) => {
        // data가 Tamagotchi 타입인지 확인
        if (data instanceof Tamagotchi) {
          // 현재 userId로 Tamagotchi 엔티티 가져오기
          const tamagotchi = await this.tamagotchiService.findOne(data.user_id);

          // 다음 레벨 결정
          const nextLevel = this.tamagotchiService.getNextLevel(tamagotchi);

          // 레벨 업이 필요한 경우에만 수행
          if (nextLevel !== tamagotchi.level) {
            await this.tamagotchiService.levelUp(tamagotchi.user_id, nextLevel);
          }
        }

        // Tamagotchi 타입이 아닐 경우, 그냥 원래 데이터를 반환
        return data;
      }),
    );
  }
}
