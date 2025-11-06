import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Lead } from './Lead';
import { Property } from './Property';

@Entity()
export class Visit {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => Lead, (l) => l.visits, { onDelete: 'CASCADE' }) lead!: Lead;
  @ManyToOne(() => Property, { nullable: false }) property!: Property;
  @Column('timestamptz') dateTime!: Date;
  @Column({ default: false }) revisit!: boolean;
  @Column({ nullable: true }) revisitReason?: string;
  @Column({ default: 'scheduled' }) status!: 'scheduled'|'no_show'|'completed';
  @Column({ nullable: true }) meetingLocation?: string;
  @Column({ nullable: true }) internalNotes?: string;
}