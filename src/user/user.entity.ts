import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { UserRO } from './user.dto';
import { PostEntity } from '../post/post.entity';
import { BaseEntity } from 'shared/base.entity';

@Entity('user')
export class UserEntity extends BaseEntity<UserRO> {
  @Column('varchar', { length: 100, nullable: true })
  name: string;

  @Column('varchar', { length: 200, nullable: true })
  avatar: string;

  @Column('varchar', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @OneToMany(type => PostEntity, post => post.author, { cascade: true })
  posts: PostEntity[];

  @ManyToMany(type => PostEntity, { cascade: true })
  @JoinTable()
  bookmarks: PostEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(showToken: boolean = true) {
    const {
      id,
      createdAt,
      updatedAt,
      email,
      avatar,
      name,
      token,
      posts,
      bookmarks,
    } = this;
    const responseObject: UserRO = {
      id,
      email,
      name,
      avatar,
      createdAt,
      updatedAt,
    };

    if (posts) {
      responseObject.posts = posts;
    }

    if (bookmarks) {
      responseObject.bookmarks = bookmarks;
    }

    if (showToken) {
      responseObject.token = token;
    }

    return responseObject;
  }

  private get token(): string {
    const { id, email } = this;

    const token = jwt.sign(
      {
        id,
        email,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );

    return token;
  }
}
