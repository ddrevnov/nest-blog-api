import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './post.controller';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { UserEntity } from '../user/user.entity';
import { CategoryEntity } from 'category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, CategoryEntity])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
