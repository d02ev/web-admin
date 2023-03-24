import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/schema';
import * as Argon from 'argon2';
import { EmailService } from 'src/email/email.service';
import { TokenService } from 'src/token/token.service';
import { ResetPasswordDto, UpdateUserDto } from 'src/user/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _emailService: EmailService,
    private readonly _tokenService: TokenService,
  ) {}

  public async createUser(creationData: CreateUserDto): Promise<any> {
    const { newUser, link } = await this._userService.createUser(creationData);

    if (!newUser || !link) {
      throw new InternalServerErrorException(
        'User Cannot Be Created Due To An Unknown Error!',
      );
    }

    const emailSuccess = await this._emailService.sendPasswordResetLink(
      newUser.email,
      'Password Reset Link',
      link,
    );

    if (!emailSuccess) {
      throw new InternalServerErrorException(
        'Password Reset Link Cannot Be Sent Due To An Unknown Error!',
      );
    }

    return {
      status: 201,
      message: 'User Created And Password Reset Link Sent Successfully!',
    };
  }

  public async createPowerUser(creationData: CreateUserDto): Promise<any> {
    const { newPowerUser, link } = await this._userService.createPowerUser(
      creationData,
    );

    if (!newPowerUser || !link) {
      throw new InternalServerErrorException(
        'Power User Cannot Be Created Due To An Unknown Error!',
      );
    }

    const emailSuccess = await this._emailService.sendPasswordResetLink(
      newPowerUser.email,
      'Password Reset Link',
      link,
    );

    if (!emailSuccess) {
      throw new InternalServerErrorException(
        'Password Reset Link Cannot Be Sent Due To An Unknown Error!',
      );
    }

    return {
      status: 201,
      message: 'Power User Created Successfully!',
    };
  }

  public async createSupportDesk(creationData: CreateUserDto): Promise<any> {
    const supportDeskUser = await this._userService.createSupportDesk(
      creationData,
    );

    if (!supportDeskUser) {
      throw new InternalServerErrorException(
        'Support Desk User Cannot Be Created Due To An Unknown Error!',
      );
    }

    return {
      status: 201,
      message: 'Support Desk User Created Successfully!',
    };
  }

  public async createAdmin(creationData: CreateUserDto): Promise<any> {
    const admin = await this._userService.createAdmin(creationData);

    if (!admin) {
      throw new InternalServerErrorException(
        'Admin Cannot Be Created Due To An Unknown Error!',
      );
    }

    return {
      status: 201,
      message: 'Admin Created Successfully!',
    };
  }

  public login(): any {
    return {
      status: 200,
      message: 'Logged In Successfully!',
    };
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<User | any> {
    const user = await this._userService.getUserByEmail(email);

    if (user && (await Argon.verify(user.passwordHash, password))) {
      return user;
    }

    return null;
  }

  public async resetPassword(
    userId: string,
    userToken: string,
    newPassword: UpdateUserDto,
  ): Promise<any> {
    const user = await this._userService.getUserById(userId);
    const token = await this._tokenService.getTokenByUserIdAndToken(
      userId,
      userToken,
    );

    if (!user || !token) {
      throw new BadRequestException('The Link Is Either Invalid Or Expired!');
    }

    const newPasswordHash = await Argon.hash(newPassword.password);
    const updatedUserData: ResetPasswordDto = {
      passwordHash: newPasswordHash,
    };

    const updatedPassword = await this._userService.resetUserPasswordHash(
      userId,
      updatedUserData,
    );
    const deletedToken = await this._tokenService.deleteToken(token._id);

    if (!updatedPassword || !deletedToken) {
      throw new InternalServerErrorException(
        'Password Cannot Be Changed Due To An Unknown Error!',
      );
    }

    return {
      status: 200,
      message: 'Password Reset Successful!',
    };
  }
}
