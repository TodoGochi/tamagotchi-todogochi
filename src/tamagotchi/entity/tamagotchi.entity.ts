import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { LevelType as Level } from '../constant/level.enum';
import { HealthStatusType as HealthStatus } from '../constant/health-status.enum';
import { Experience } from './experience.entity';
import { Max } from 'class-validator';

@Entity('tamagotchi')
export class Tamagotchi {
  @PrimaryGeneratedColumn()
  id: number; // 자동 증가 기본 키

  @Column()
  user_id: number;

  @Column({
    type: 'enum',
    enum: Level,
    default: Level.EGG,
  })
  level: Level;

  @Column({
    type: 'enum',
    enum: HealthStatus,
    default: HealthStatus.HEALTHY,
  })
  health_status: HealthStatus;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nickname: string;

  @Column({ type: 'int', nullable: false })
  @Max(10)
  happiness: number;

  @Column({ type: 'timestamp', nullable: false })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  sick_at: Date | null;

  @Column({ type: 'int', nullable: false })
  @Max(10)
  hunger: number;

  @OneToOne(() => Experience, (experience) => experience.id, { cascade: true })
  @JoinColumn()
  experience: Experience; // 외래 키 관계 정의
}
