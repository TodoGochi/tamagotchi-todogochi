import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TamagotchiService } from 'src/tamagotchi/tamagotchi.service';
import { ApiError } from 'src/common/error/api.error';
import { HealthStatusType } from 'src/tamagotchi/constant/health-status.enum';
@Injectable()
export class TamagotchiStatusInterceptor implements NestInterceptor {
  constructor(private readonly tamagotchiService: TamagotchiService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.body; // 사용자 ID를 요청에서 가져옴

    // 다마고치 상태 확인
    const tamagotchi = await this.tamagotchiService.getTamagotchiByUserId(
      userId,
    );
    if (tamagotchi.health_status !== HealthStatusType.HEALTHY) {
      throw new ApiError('TAMAGOTCHI-0001');
    }

    return next.handle();
  }
}
