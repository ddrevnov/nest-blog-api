import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ValidationPipe } from 'shared/validation.pipe';
import { AuthGuard } from 'shared/auth.guard';
import { CategoryDTO } from './category.dto';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createPost(@Body() body: CategoryDTO) {
    return this.categoryService.create(body);
  }

  @Get()
  getAll() {
    return this.categoryService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.categoryService.getById(id);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  deleteById(@Param('id') id: string) {
    return this.categoryService.deleteById(id);
  }
}
