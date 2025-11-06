import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AgentProfile } from './AgentProfile';

@Entity()
export class Agency {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() name!: string;
  @Column({ nullable: true }) website?: string;
  @Column({ nullable: true }) logoUrl?: string;
  @OneToMany(() => AgentProfile, (a) => a.agency) agents!: AgentProfile[];
}