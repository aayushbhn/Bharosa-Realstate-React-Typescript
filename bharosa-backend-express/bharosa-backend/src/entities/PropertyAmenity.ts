import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Property } from './Property';
import { Amenity } from './Amenity';

@Entity()
export class PropertyAmenity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => Property, (p) => p.amenities, { onDelete: 'CASCADE' }) property!: Property;
  @ManyToOne(() => Amenity, (a) => a.rel, { onDelete: 'CASCADE' }) amenity!: Amenity;
}