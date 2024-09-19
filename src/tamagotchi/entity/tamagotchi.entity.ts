import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { LevelType as Level } from '../constant/level.enum';
import { HealthStatusType as HealthStatus } from '../constant/health-status.enum';
import { Experience } from './experience.entity';

@Entity('tamagotchi')
export class Tamagotchi {
  @PrimaryColumn()
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
  happiness: number;

  @Column({ type: 'date', nullable: false })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  sick_at: Date | null;

  @OneToOne(() => Experience, (experience) => experience.user_id)
  experience: Experience;
}
