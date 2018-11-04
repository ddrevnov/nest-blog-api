import {
  Controller,
  Get,
  Logger,
  Post,
  Param,
  Body,
  Delete,
  Put,
  UsePipes,
  UseGuards,
  Query,
} from '@nestjs/common';

import { PostService } from './post.service';
import { PostDTO } from './post.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';

@Controller('posts')
export class PostController {
  private logger = new Logger('PostController');

  constructor(private postService: PostService) {}

  private logData(options: any) {
    options.user && this.logger.log('USER ' + JSON.stringify(options.user));
    options.body && this.logger.log('BODY ' + JSON.stringify(options.body));
    options.id && this.logger.log('POST ' + JSON.stringify(options.id));
  }

  @Get()
  showAllPosts(@Query('page') page: number) {
    return this.postService.showAll(page);
  }

  @Get('/newest')
  showNewestPosts(@Query('page') page: number) {
    return this.postService.showAll(page, true);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createPost(@User('id') user, @Body() body: PostDTO) {
    this.logData({ user, body });
    return this.postService.create(user, body);
  }

  @Get(':id')
  readPost(@Param('id') id: string) {
    this.logData({ id });
    return this.postService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updatePost(
    @Param('id') id: string,
    @User('id') user,
    @Body() body: Partial<PostDTO>,
  ) {
    this.logData({ id, user, body });
    return this.postService.update(id, user, body);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyPost(@Param('id') id: string, @User('id') user) {
    this.logData({ id, user });
    return this.postService.destroy(id, user);
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  upvotePost(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.postService.upvote(id, user);
  }

  @Post(':id/downvote')
  @UseGuards(new AuthGuard())
  downvotePost(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.postService.downvote(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmarkPost(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.postService.bookmark(id, user);
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  unbookmarkPost(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.postService.unbookmark(id, user);
  }
}
