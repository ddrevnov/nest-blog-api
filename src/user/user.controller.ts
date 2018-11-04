import {
  Controller,
  Get,
  Post,
  UsePipes,
  Body,
  Query,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from 'shared/auth.guard';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('users')
  showAllUsers(@Query('page') page: number) {
    return this.userService.showAll(page);
  }

  @Delete('users/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  deleteById(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post('auth/register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
}
