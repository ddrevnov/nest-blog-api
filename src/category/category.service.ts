import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryRO, CategoryDTO } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(data: CategoryDTO): Promise<CategoryRO> {
    let category = await this.categoryRepository.findOne({
      where: { name: data.name },
    });

    if (category) {
      throw new HttpException(
        'Category already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    category = await this.categoryRepository.create(data);
    await this.categoryRepository.save(category);

    return category.toResponseObject();
  }

  async getAll(): Promise<CategoryRO[]> {
    const categories = await this.categoryRepository.find({
      relations: ['posts'],
    });
    return categories.map(category => category.toResponseObject());
  }

  async getById(id: string): Promise<CategoryRO> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    return category.toResponseObject();
  }

  async deleteById(id: string): Promise<CategoryRO> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepository.remove(category);

    return category.toResponseObject();
  }
}
