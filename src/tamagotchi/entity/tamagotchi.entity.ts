import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Level } from './level.entity';
import { HealthStatus } from './health-status.entity';

@Entity('tamagotchi')
export class Tamagotchi {
  @PrimaryColumn()
  user_id: number;

  @ManyToOne(() => Level)
  @JoinColumn({ name: 'level_id' })
  level_id: number;

  @ManyToOne(() => HealthStatus)
  @JoinColumn({ name: 'health_id' })
  health_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nickname: string;

  @Column({ type: 'int', nullable: true })
  happiness: number;

  @Column({ type: 'date', nullable: true })
  created_at: Date;
}
