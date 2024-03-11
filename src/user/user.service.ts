import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}


   async create(createUserDto: CreateUserDto) : Promise<User> {
    const salt = await genSalt(10);
    const user: User = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = await hash(createUserDto.password, salt);
    return this.userRepository.save(user);
  }

  async findUserbyHisUsername(username:string) : Promise<User | null>{
    const user = await this.userRepository.findOne(  {where: { username: username}});
    return user;
  }

  async findUserByHisEmail (email:string) : Promise <User | null>{
    const user = await this.userRepository.findOne({where: {email:email}});
    return user;
  }

  async findUserById(id:number) : Promise<User | null>{
    const user = await this.userRepository.findOne({where: {id:id}});
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) : Promise<User | null>{
    const user: User = new User();
    user.name = updateUserDto.name;
    user.email = updateUserDto.email;
    user.username = updateUserDto.username;
    user.id = id;
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}
