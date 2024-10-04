import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TamagotchiParamDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}
