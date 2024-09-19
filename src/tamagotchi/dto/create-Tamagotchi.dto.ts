import {
  IsInt,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTamagotchiDto {
  @IsInt()
  userId: number;

  @IsString()
  @MinLength(2, { message: 'Nickname must be at least 2 characters long.' })
  @MaxLength(15, { message: 'Nickname must be at most 15 characters long.' })
  @Matches(/^[a-zA-Z0-9가-힣]+$/, {
    message:
      'Nickname can only contain letters, numbers, and Korean characters.',
  })
  nickname: string;
}
