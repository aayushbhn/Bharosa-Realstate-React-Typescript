import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class SavedSearch {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) user!: User;
  @Column('jsonb') query!: any;
  @Column('timestamptz', { default: () => 'now()' }) createdAt!: Date;
}