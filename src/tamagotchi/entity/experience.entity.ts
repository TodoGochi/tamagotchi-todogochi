import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Tamagotchi } from './tamagotchi.entity';

@Entity('experience')
export class Experience {
  @OneToOne(() => Tamagotchi)
  @JoinColumn({ name: 'user_id' })
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  feed: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  play: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  pet: number;
}
