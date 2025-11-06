import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PropertyAmenity } from './PropertyAmenity';

@Entity()
export class Amenity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ unique: true }) name!: string;
  @OneToMany(() => PropertyAmenity, (pa) => pa.amenity) rel!: PropertyAmenity[];
}