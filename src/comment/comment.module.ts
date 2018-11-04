import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentService } from './comment.service';
import { CommentEntity } from './comment.entity';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, PostEntity, UserEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
