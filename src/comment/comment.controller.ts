import {
  Controller,
  Get,
  Delete,
  UseGuards,
  Param,
  Logger,
  Post,
  Body,
  UsePipes,
  Query,
} from '@nestjs/common';

import { User } from '../user/user.decorator';
import { AuthGuard } from '../shared/auth.guard';
import { ValidationPipe } from '../shared/validation.pipe';
import { CommentDTO } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  logger = new Logger('CommentController');
  constructor(private commentService: CommentService) {}

  @Get('post/:id')
  showCommentsByPost(@Param('id') post: string, @Query('page') page: number) {
    return this.commentService.showByPost(post, page);
  }

  @Post('post/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createComment(
    @Param('id') post: string,
    @User('id') user: string,
    @Body() data: CommentDTO,
  ) {
    return this.commentService.create(post, user, data);
  }

  @Get('user/:id')
  showCommentsByUser(@Param('id') user: string, @Query('page') page: number) {
    return this.commentService.showByUser(user, page);
  }

  @Get(':id')
  showComment(@Param('id') id: string) {
    return this.commentService.show(id);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyComment(@Param('id') id: string, @User('id') user: string) {
    return this.commentService.destroy(id, user);
  }
}
