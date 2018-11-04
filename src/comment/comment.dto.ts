import { IsString } from 'class-validator';
import { UserRO } from 'user/user.dto';

export class CommentDTO {
  @IsString()
  comment: string;
}

export class CommentRO {
  id: string;
  comment: string;
  author?: UserRO;
}
