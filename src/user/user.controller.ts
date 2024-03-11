import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto) {
    const username = await this.userService.findUserbyHisUsername(createUserDto.username);
    const email = await this.userService.findUserByHisEmail(createUserDto.email);
    if(username) {
      throw new ConflictException(`User with username ${username} already exists`);
    }

    if(email) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
    
    const user = await this.userService.create(createUserDto);

    return {user, message: 'User created successfully'}
  }


  @Get('/user/:id')
    async getUserById(@Param('id') id:string) {
      return this.userService.findUserById(+id);
    }

  @Patch('/updates/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('/deleted/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
