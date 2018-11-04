import { Entity, Column, ManyToOne, JoinTable } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { PostEntity } from '../post/post.entity';
import { CommentRO } from './comment.dto';
import { BaseEntity } from 'shared/base.entity';

@Entity('comment')
export class CommentEntity extends BaseEntity<CommentRO> {
  @Column('text')
  comment: string;

  @ManyToOne(type => UserEntity)
  @JoinTable()
  author: UserEntity;

  @ManyToOne(type => PostEntity, post => post.comments)
  post: PostEntity;

  toResponseObject() {
    const { id, comment, author } = this;
    return {
      id,
      comment,
      author: author && author.toResponseObject(),
    };
  }
}
