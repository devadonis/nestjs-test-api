import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async createUser(@Body() createUserDto: any) {
    return this.userService.createUser(createUserDto);
  }

  @Get('user/:userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.getUserFromApi(userId);
  }

  @Get('user/:userId/avatar')
  async getUserAvatar(@Param('userId') userId: string) {
    return this.userService.getUserAvatar(userId);
  }

  @Delete('user/:userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string) {
    return this.userService.deleteUserAvatar(userId);
  }
}
