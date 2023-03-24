import { Controller, UseGuards, Post, Body, Param } from '@nestjs/common';
import { UseRole } from 'src/user/decorator';
import { UpdateUserDto } from 'src/user/dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Role } from 'src/user/enum';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './guards';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.ADMIN)
  @Post('user/register')
  public async registerUser(
    @Body() registrationBody: CreateUserDto,
  ): Promise<any> {
    return await this._authService.createUser(registrationBody);
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.ADMIN)
  @Post('power/register')
  public async registerPowerUser(
    @Body() registrationBody: CreateUserDto,
  ): Promise<any> {
    return await this._authService.createPowerUser(registrationBody);
  }

  @Post('reset/:userId/:token')
  public async resetPassword(
    @Param('userId') userId: string,
    @Param('token') token: string,
    @Body() updatedUserData: UpdateUserDto,
  ): Promise<any> {
    return this._authService.resetPassword(userId, token, updatedUserData);
  }

  @Post('support/register')
  public async registerSupportDesk(
    @Body() registrationBody: CreateUserDto,
  ): Promise<any> {
    return await this._authService.createSupportDesk(registrationBody);
  }

  @Post('admin/register')
  public async registerAdmin(
    @Body() registrationBody: CreateUserDto,
  ): Promise<any> {
    return await this._authService.createAdmin(registrationBody);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public login(): any {
    return this._authService.login();
  }
}
