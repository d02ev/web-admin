import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards';
import { UseRole } from './decorator';
import { Role } from './enum';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.POWER_USER)
  @Get()
  public async accessAllUsers() {
    return await this._userService.getAllUsers();
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.POWER_USER)
  @Get(':userId')
  public async accessUser(@Param('userId') userId: string) {
    return await this._userService.getUserById(userId);
  }
}
