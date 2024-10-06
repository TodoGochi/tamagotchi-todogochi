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
export class TamagotchiStatusSickInterceptor implements NestInterceptor {
  constructor(private readonly tamagotchiService: TamagotchiService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    console.log('아이디', request.params.id);
    // 다마고치 상태 확인
    const tamagotchi = await this.tamagotchiService.findOneByTamagotchiId(
      request.params.id,
    );
    console.log('타마고치 정보', tamagotchi);
    if (tamagotchi.health_status !== HealthStatusType.SICK) {
      throw new ApiError('TAMAGOTCHI-0003');
    }

    return next.handle();
  }
}
