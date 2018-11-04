import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';
import { TagEntity } from 'tag/tag.entity';
import { CategoryEntity } from 'category/category.entity';
import { PostRO } from './post.dto';
import { BaseEntity } from 'shared/base.entity';

@Entity('post')
export class PostEntity extends BaseEntity<PostRO> {
  @Column('text')
  post: string;

  @Column('text')
  description: string;

  @ManyToOne(type => UserEntity, author => author.posts)
  author: UserEntity;

  @ManyToOne(type => CategoryEntity, category => category.posts)
  category: CategoryEntity | string;

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  upvotes: UserEntity[];

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  downvotes: UserEntity[];

  @ManyToMany(type => TagEntity, { cascade: true })
  @JoinTable()
  tags: TagEntity[];

  @OneToMany(type => CommentEntity, comment => comment.post, { cascade: true })
  comments: CommentEntity[];

  toResponseObject() {
    const {
      id,
      createdAt,
      updatedAt,
      post,
      description,
      upvotes,
      downvotes,
      tags,
      author,
    } = this;

    const responseObject: any = {
      id,
      createdAt,
      updatedAt,
      post,
      description,
      author: author ? author.toResponseObject(false) : null,
    };

    if (upvotes) {
      responseObject.upvotes = upvotes.length;
    }
    if (downvotes) {
      responseObject.downvotes = downvotes.length;
    }
    if (tags) {
      responseObject.tags = tags.length;
    }
    return responseObject;
  }
}
