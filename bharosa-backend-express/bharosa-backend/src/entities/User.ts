import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { AgentProfile } from './AgentProfile';
import { Lead } from './Lead';
import { SavedProperty } from './SavedProperty';

export type Role = 'super_admin' | 'agency_admin' | 'agent' | 'customer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ unique: true }) email!: string;
  @Column() passwordHash!: string;
  @Column() name!: string;
  @Column({ nullable: true }) phone?: string;
  @Column({ type: 'varchar' }) role!: Role;
  @Column({ default: true }) isActive!: boolean;
  @Column({ type: 'timestamptz', default: () => 'now()' }) createdAt!: Date;

  @OneToOne(() => AgentProfile, (a) => a.user) agentProfile?: AgentProfile;
  @OneToMany(() => Lead, (l) => l.customer) leads?: Lead[];
  @OneToMany(() => SavedProperty, (s) => s.user) saved?: SavedProperty[];
}