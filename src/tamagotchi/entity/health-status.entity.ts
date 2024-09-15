import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('health_status')
export class HealthStatus {
  @PrimaryGeneratedColumn()
  health_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  health_status: string;
}
