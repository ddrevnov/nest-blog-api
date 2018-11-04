import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';
import { TagDTO, TagRO } from './tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity) private tagRepository: Repository<TagEntity>,
  ) {}

  getAll() {
    return this.tagRepository.find({});
  }

  async create(data: TagDTO): Promise<TagRO> {
    let tag = await this.tagRepository.findOne({ where: { tag: data.tag } });
    if (tag) {
      throw new HttpException('Tag already exists', HttpStatus.BAD_REQUEST);
    }
    tag = await this.tagRepository.create(data);
    await this.tagRepository.save(tag);
    return tag.toResponseObject();
  }
}
