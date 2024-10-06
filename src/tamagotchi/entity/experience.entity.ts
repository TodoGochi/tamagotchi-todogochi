import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Tamagotchi } from './tamagotchi.entity';
import { Exclude } from 'class-transformer';

@Entity('experience')
export class Experience {
  @PrimaryGeneratedColumn()
  @Exclude({
    toPlainOnly: true,
  })
  id: number; // 자동 증가 기본 키

  @OneToOne(() => Tamagotchi)
  @JoinColumn({ name: 'tamagotchi_id' }) // 외래 키 열 이름 지정
  tamagotchi: Tamagotchi;

  @Column({ type: 'int', nullable: false, default: 0 })
  feed: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  play: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  pet: number;
}
