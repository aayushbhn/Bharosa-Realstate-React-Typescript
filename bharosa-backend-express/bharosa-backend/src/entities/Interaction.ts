import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Property } from './Property';

@Entity()
export class Interaction {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) user!: User;
  @ManyToOne(() => Property, { onDelete: 'CASCADE' }) property!: Property;
  @Column({ default: 'view' }) type!: 'view'|'save'|'lead'|'whatsapp_click';
  @Column('float', { default: 1.0 }) weight!: number;
  @Column('timestamptz', { default: () => 'now()' }) at!: Date;
}