import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Physiotherapist } from './physiotherapist.entity';

@Entity()
export class AccessToken {
  constructor(init?: Partial<AccessToken>) {
    Object.assign(this, init);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 86400 })
  ttl: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => Physiotherapist,
    (physiotherapist) => physiotherapist.accessTokens,
  )
  physiotherapist: Physiotherapist;

  @Column()
  @RelationId((accessToken: AccessToken) => accessToken.physiotherapist)
  physiotherapistId: number;
}
