import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateUserProperties(
    userInfo: Pick<User, 'id' | 'email'>,
    updateDto: Partial<User>,
  ) {
    await this.userRepository.update(userInfo, updateDto);
    return await this.userRepository.findOneBy(userInfo);
  }

  async createUser(userDto: Omit<User, 'id' | 'refresh_token' | 'Sites'>) {
    const newUser = this.userRepository.create(userDto);
    return await this.userRepository.save(newUser);
  }

  async findOneUser(searchCriteria: Partial<User>): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: searchCriteria });
  }

  async findUserByAPI_KEY(API_KEY: string) {
    return await this.userRepository.findOneBy({ api_key: API_KEY });
  }
}
