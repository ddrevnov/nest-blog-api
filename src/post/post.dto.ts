import { IsString } from 'class-validator';

import { UserRO } from '../user/user.dto';
import { TagRO } from 'tag/tag.dto';
import { CategoryRO } from 'category/category.dto';

export class PostDTO {
  @IsString()
  readonly post: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly category: string;
}

export class PostRO {
  id: string;
  created: Date;
  updated: Date;
  post: string;
  description: string;
  author: UserRO;
  category: CategoryRO;
  upvotes?: number;
  downvotes?: number;
  tags?: TagRO[];
}
