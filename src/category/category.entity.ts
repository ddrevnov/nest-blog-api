import { Entity, Column, OneToMany } from 'typeorm';
import { PostEntity } from 'post/post.entity';
import { CategoryRO } from './category.dto';
import { BaseEntity } from 'shared/base.entity';

@Entity('category')
export class CategoryEntity extends BaseEntity<CategoryRO> {
  @Column('text', { unique: true })
  name: string;

  @OneToMany(type => PostEntity, post => post.category)
  posts: PostEntity[];

  toResponseObject(): CategoryRO {
    const { id, name, posts } = this;

    const categoryObject: CategoryRO = {
      id,
      name,
    };

    if (posts) {
      categoryObject.posts = posts.map(post => post.toResponseObject());
    }

    return categoryObject;
  }
}
