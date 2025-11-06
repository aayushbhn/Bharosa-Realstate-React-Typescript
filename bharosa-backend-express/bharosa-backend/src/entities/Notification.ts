import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) user!: User;
  @Column() type!: string;
  @Column('jsonb', { nullable: true }) payload?: any;
  @Column({ default: false }) read!: boolean;
  @Column('timestamptz', { default: () => 'now()' }) createdAt!: Date;
}