import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Invoice } from './invoice.entity';

@Entity()
export class Insurance {
  constructor(init?: Partial<Insurance>) {
    Object.assign(this, init);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  amcNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Patient, (patient) => patient.insurance)
  @JoinColumn()
  patients: Patient[];

  @OneToMany(() => Invoice, (invoice) => invoice.insurance)
  @JoinColumn()
  invoices: Invoice[];
}
