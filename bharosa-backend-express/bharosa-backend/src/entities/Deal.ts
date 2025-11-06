import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Lead } from './Lead';
import { Property } from './Property';

@Entity()
export class Deal {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => Lead, { nullable: false }) lead!: Lead;
  @ManyToOne(() => Property, { nullable: false }) property!: Property;
  @Column('timestamptz') closedAt!: Date;
  @Column('bigint') value!: number;
  @Column('float', { nullable: true }) commissionPct?: number;
  @Column({ default: 'won' }) status!: 'won'|'lost';
  @Column({ nullable: true }) closeNotes?: string;
}