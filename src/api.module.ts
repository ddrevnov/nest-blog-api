import { CommentModule } from './comment/comment.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { UserModule } from './user/user.module';
import { PostModule } from 'post/post.module';
import { TagModule } from './tag/tag.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [UserModule, PostModule, CommentModule, TagModule, CategoryModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [UserModule, PostModule, CommentModule, TagModule, CategoryModule],
})
export class ApiModule {}
