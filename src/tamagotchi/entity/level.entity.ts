import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('level')
export class Level {
  @PrimaryGeneratedColumn()
  level_id: number;

  @Column({ type: 'int', nullable: false })
  level: number;
}
