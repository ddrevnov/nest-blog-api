import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from './comment.entity';
import { CommentDTO } from './comment.dto';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showByPost(postId: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['author', 'post'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return comments.map(comment => comment.toResponseObject());
  }

  async showByUser(userId: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { author: { id: userId } },
      relations: ['author', 'post'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return comments.map(comment => comment.toResponseObject());
  }

  async show(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    });
    return comment.toResponseObject();
  }

  async create(postId: string, userId: string, data: CommentDTO) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const comment = await this.commentRepository.create({
      ...data,
      post,
      author: user,
    });
    await this.commentRepository.save(comment);
    return comment.toResponseObject();
  }

  async destroy(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    });

    if (comment.author.id !== userId) {
      throw new HttpException(
        'You do not own this comment',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.commentRepository.remove(comment);
    return comment.toResponseObject();
  }
}
