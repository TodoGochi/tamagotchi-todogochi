import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tamagotchi } from './tamagotchi.entity';
import { Exclude } from 'class-transformer';

@Entity('level_effects')
export class LevelEffect {
  @PrimaryGeneratedColumn()
  @Exclude({
    toPlainOnly: true,
  })
  id: number;

  @ManyToOne(() => Tamagotchi, (tamagotchi) => tamagotchi.levelEffects)
  tamagotchi: Tamagotchi;

  @Column()
  level: number; // 해당 레벨

  @Column({ default: false })
  effectApplied: boolean; // 효과가 적용되었는지 여부
}
