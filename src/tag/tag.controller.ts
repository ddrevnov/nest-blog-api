import {
  Controller,
  Logger,
  Get,
  Post,
  UseGuards,
  Param,
  UsePipes,
  Body,
} from '@nestjs/common';
import { AuthGuard } from './../shared/auth.guard';
import { TagService } from './tag.service';
import { ValidationPipe } from '../shared/validation.pipe';
import { TagDTO } from './tag.dto';

@Controller('tags')
export class TagController {
  private logger = new Logger('TagController');

  constructor(private tagService: TagService) {}

  @Get()
  getAll() {
    return this.tagService.getAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  create(@Body() body: TagDTO) {
    return this.tagService.create(body);
  }
}
