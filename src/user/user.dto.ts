import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
import { PostEntity } from '../post/post.entity';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  avatar: string;
}

export class UserRO {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
  posts?: PostEntity[];
  bookmarks?: PostEntity[];
}
