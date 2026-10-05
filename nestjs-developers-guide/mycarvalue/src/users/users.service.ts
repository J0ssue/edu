import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  /**
   *
   */
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  /**
   * create
   * @param email: string
   * @param password: string
   */
  public create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  /**
   * findOne
   * @param id: number
   */
  findOne(id: number): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
    });
  }

  find(email: string): Promise<User[]> {
    return this.repo.find({
      where: { email },
    });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Useer not found');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Useer not found');
    }

    return this.repo.remove(user);
  }
}
