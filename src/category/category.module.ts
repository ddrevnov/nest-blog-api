import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryEntity } from './category.entity';
import { PostEntity } from 'post/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, PostEntity])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
