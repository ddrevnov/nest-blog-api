import { IsString } from 'class-validator';
import { PostRO } from 'post/post.dto';

export class CategoryDTO {
  @IsString()
  readonly name: string;
}

export class CategoryRO {
  id: string;
  name: string;
  posts?: PostRO[];
}
