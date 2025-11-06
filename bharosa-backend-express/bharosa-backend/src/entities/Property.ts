import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AgentProfile } from './AgentProfile';

export type Status = 'sale' | 'rent';
export type PType = 'apartment' | 'house' | 'land' | 'office' | 'villa';

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column() title!: string;
  @Column('text') description!: string;

  @Column({ type: 'varchar', default: 'sale' }) status!: Status;
  @Column({ type: 'varchar', default: 'apartment' }) type!: PType;

  @Column('int') beds!: number;
  @Column('int') baths!: number;
  @Column('int') areaSqft!: number;

  // Note: pg BIGINT returns string in JS; change to numeric if desired
  @Column('bigint') price!: string;

  @Column({ nullable: true }) city?: string;
  @Column({ nullable: true }) area?: string;

  @Column('float', { nullable: true }) lat?: number;
  @Column('float', { nullable: true }) lng?: number;

  @Column('simple-array', { nullable: true })
  imageUrls?: string[];

  @Column('simple-json', { nullable: true })
  floorPlan?: { url: string };

  @Column('simple-json', { nullable: true })
  meta?: Record<string, any>;

  @ManyToOne(() => AgentProfile, { nullable: false })
  agent!: AgentProfile;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;

  @Column({ default: false })
  isApproved!: boolean;

  // ✅ keep ONE definition, as a plain column
  @Column('simple-array', { nullable: true })
  amenities?: string[];

  @Column({ type: 'varchar', nullable: true })
  furnishing?: 'furnished' | 'semi' | 'unfurnished';

  @Column({ type: 'date', nullable: true })
  possessionDate?: Date;
}
