import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(private usersService: UsersService) {}

  /**
   * @param email: string,
   * @param password: string,
   * - STEPS:
   * 1 - Check email exists
   * 2 - encrypt/hash user pw
   * 2.1 -- generate a salt
   * 2.2 -- hash the salt and pw together
   * 2.3 -- join the hash result and the salt together
   * 3 - store new user record
   * 4 - send back cookie with user id
   */
  async signup(email: string, password: string) {
    // 1:
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // 2.1:
    const salt = randomBytes(8).toString('hex');

    // 2.2:
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // 2.3:
    const result = salt + '.' + hash.toString('hex');

    // 3:
    const user = await this.usersService.create(email, result);

    // 4:
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    return user;
  }
}
