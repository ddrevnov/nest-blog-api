import { IsString } from 'class-validator';

export class TagDTO {
  @IsString()
  readonly tag: string;
}

export class TagRO {
  @IsString()
  readonly id: string;

  @IsString()
  readonly tag: string;
}
