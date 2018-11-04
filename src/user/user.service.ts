import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll(page: number = 1) {
    const users = await this.userRepository.find({
      relations: ['posts', 'bookmarks'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return users.map(user => user.toResponseObject(false));
  }

  async deleteById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts', 'bookmarks'],
    });
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.remove(user);
    return user.toResponseObject(false);
  }

  async login(data: UserDTO) {
    const { email, password } = data;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException('Invalid email/password', HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject();
  }

  async register(data: UserDTO) {
    const { email } = data;
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}
