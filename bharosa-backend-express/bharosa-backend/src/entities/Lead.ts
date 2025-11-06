import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Property } from './Property';
import { Visit } from './Visit';

export type LeadStage = 'new'|'contacted'|'qualified'|'visit_scheduled'|'revisit'|'negotiation'|'won'|'lost';

@Entity()
export class Lead {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => User, (u) => u.leads, { eager: true }) customer!: User;
  @ManyToOne(() => Property, { nullable: true, eager: true }) property?: Property;
  @Column({ default: 'new' }) stage!: LeadStage;
  @Column({ nullable: true }) notes?: string;
  @Column({ type: 'timestamptz', default: () => 'now()' }) createdAt!: Date;
  @OneToMany(() => Visit, (v) => v.lead) visits!: Visit[];
}