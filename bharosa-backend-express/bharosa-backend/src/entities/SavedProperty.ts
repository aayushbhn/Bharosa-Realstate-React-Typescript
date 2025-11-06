import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './User';
import { Property } from './Property';

@Entity()
export class SavedProperty {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => User, (u) => u.saved, { onDelete: 'CASCADE' }) user!: User;
  @ManyToOne(() => Property, { onDelete: 'CASCADE' }) property!: Property;
  @Column('timestamptz', { default: () => 'now()' }) savedAt!: Date;
}