import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostEntity } from './post.entity';
import { PostDTO, PostRO } from './post.dto';
import { UserEntity } from '../user/user.entity';
import { Votes } from '../shared/votes.enum';
import { CategoryEntity } from 'category/category.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  private ensureOwnership(post: PostEntity, userId: string) {
    if (post.author.id !== userId) {
      throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
    }
  }

  private async vote(post: PostEntity, user: UserEntity, vote: Votes) {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      post[opposite].filter(voter => voter.id === user.id).length > 0 ||
      post[vote].filter(voter => voter.id === user.id).length > 0
    ) {
      post[opposite] = post[opposite].filter(voter => voter.id !== user.id);
      post[vote] = post[vote].filter(voter => voter.id !== user.id);
      await this.postRepository.save(post);
    } else if (post[vote].filter(voter => voter.id === user.id).length < 1) {
      post[vote].push(user);
      await this.postRepository.save(post);
    } else {
      throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
    }

    return post;
  }

  async showAll(page: number = 1, newest?: boolean): Promise<PostRO[]> {
    const posts = await this.postRepository.find({
      relations: [
        'author',
        'upvotes',
        'downvotes',
        'comments',
        'tags',
        'category',
      ],
      take: 25,
      skip: 25 * (page - 1),
      order: newest && { created: 'DESC' },
    });
    return posts.map(post => post.toResponseObject());
  }

  async read(id: string): Promise<PostRO> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: [
        'author',
        'upvotes',
        'downvotes',
        'comments',
        'tags',
        'category',
      ],
    });

    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return post.toResponseObject();
  }

  async create(userId: string, data: PostDTO): Promise<PostRO> {
    const category = await this.categoryRepository.findOne({
      where: { category: data.category },
    });

    if (!category) {
      throw new HttpException('Category Not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const post = await this.postRepository.create({ ...data, author: user });
    await this.postRepository.save(post);
    return post.toResponseObject();
  }

  async update(
    id: string,
    userId: string,
    data: Partial<PostDTO>,
  ): Promise<PostRO> {
    const category = await this.categoryRepository.findOne({
      where: { category: data.category },
    });

    if (!category) {
      throw new HttpException('Category Not found', HttpStatus.NOT_FOUND);
    }

    const post = await this.postRepository.findOne({
      where: { id },
      relations: [
        'author',
        'upvotes',
        'downvotes',
        'comments',
        'tags',
        'category',
      ],
    });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(post, userId);
    await this.postRepository.update({ id }, data);
    return post.toResponseObject();
  }

  async destroy(id: string, userId: string): Promise<PostRO> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(post, userId);
    await this.postRepository.remove(post);
    return post.toResponseObject();
  }

  async upvote(id: string, userId: string) {
    let post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    post = await this.vote(post, user, Votes.UP);

    return post.toResponseObject();
  }

  async downvote(id: string, userId: string) {
    let post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    post = await this.vote(post, user, Votes.DOWN);

    return post.toResponseObject();
  }

  async bookmark(id: string, userId: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (user.bookmarks.filter(bookmark => bookmark.id === post.id).length < 1) {
      user.bookmarks.push(post);
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'post already bookmarked ',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject(false);
  }

  async unbookmark(id: string, userId: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (user.bookmarks.filter(bookmark => bookmark.id === post.id).length > 0) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== post.id,
      );
      await this.userRepository.save(user);
    } else {
      throw new HttpException('Cannot remove bookmark', HttpStatus.BAD_REQUEST);
    }

    return user.toResponseObject(false);
  }
}
