import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Physiotherapist } from './physiotherapist.entity';
import { Invoice } from './invoice.entity';
import { Insurance } from './insurance.entity';

@Entity()
export class Patient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastname: string;

  @Column()
  firstname: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column('date', { nullable: true })
  dateOfBirth: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => Physiotherapist,
    (physiotherapist) => physiotherapist.patients,
  )
  @JoinColumn()
  physiotherapist: Physiotherapist;

  @Column()
  @RelationId((patient: Patient) => patient.physiotherapist)
  physiotherapistId: number;

  @OneToMany(() => Invoice, (invoice) => invoice.patient)
  @JoinColumn()
  invoices: Invoice[];

  @ManyToOne(() => Insurance, (insurance) => insurance.patients)
  @JoinColumn()
  insurance: Insurance;

  @Column({ nullable: true })
  @RelationId((patient: Patient) => patient.insurance)
  insuranceId: number;
}
