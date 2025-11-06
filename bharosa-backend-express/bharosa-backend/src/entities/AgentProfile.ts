import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Agency } from './Agency';
import { User } from './User';

@Entity()
export class AgentProfile {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @OneToOne(() => User, (u) => u.agentProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Agency, (a) => a.agents, { nullable: true })
  agency?: Agency;

  @Column({ nullable: true }) bio?: string;
  @Column({ nullable: true }) avatarUrl?: string;
  @Column({ default: 0 }) totalSales!: number;
  @Column({ default: 0 }) totalRent!: number;
  @Column({ default: 0 }) avgResponseMins!: number;
  @Column('simple-array', { nullable: true }) languages?: string[];
  @Column('simple-array', { nullable: true }) specializations?: string[];
}