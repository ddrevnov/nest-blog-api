import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { TagRO } from './tag.dto';
import { BaseEntity } from 'shared/base.entity';

@Entity('tag')
export class TagEntity extends BaseEntity<TagRO> {
  @Column('varchar', { unique: true })
  tag: string;

  toResponseObject() {
    return this;
  }
}
