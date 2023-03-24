import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, BaseUserDto, ResetPasswordDto } from './dto';
import { User, UserDocument } from './schema';
import * as Argon from 'argon2';
import { Role } from './enum';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BaseTokenDto } from 'src/token/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
    private readonly _tokenService: TokenService,
  ) {}

  public async createUser(
    creationData: CreateUserDto,
  ): Promise<User | any | null> {
    if (await this._userExists(creationData.email)) {
      throw new BadRequestException('User Already Exists!');
    }

    const passwordHash = await Argon.hash(creationData.password);
    const newUserData: BaseUserDto = {
      fullName: creationData.fullName,
      email: creationData.email,
      passwordHash: passwordHash,
      role: Role.USER,
    };
    const newUser = await new this._userModel(newUserData).save();

    let resetToken = await this._tokenService.getTokenByUserId(newUser._id);
    if (!resetToken) {
      const jwtToken = await this._signToken(newUser._id);
      const newUserToken: BaseTokenDto = {
        userId: newUser._id,
        token: jwtToken,
      };
      resetToken = await this._tokenService.createToken(newUserToken);
    }

    const link = `${this._configService.get('RESET_PASS_BASE_URL')}/${
      newUser._id
    }/${resetToken.token}`;

    return { newUser, link };
  }

  public async createPowerUser(
    creationData: CreateUserDto,
  ): Promise<User | any | null> {
    if (await this._userExists(creationData.email)) {
      throw new BadRequestException('User Already Exists!');
    }

    const passwordHash = await Argon.hash(creationData.password);
    const newUserData: BaseUserDto = {
      fullName: creationData.fullName,
      email: creationData.email,
      passwordHash: passwordHash,
      role: Role.POWER_USER,
    };
    const newPowerUser = await new this._userModel(newUserData).save();
    let resetToken = await this._tokenService.getTokenByUserId(
      newPowerUser._id,
    );

    if (!resetToken) {
      const jwtToken = await this._signToken(newPowerUser._id);
      const newUserToken: BaseTokenDto = {
        userId: newPowerUser._id,
        token: jwtToken,
      };
      resetToken = await this._tokenService.createToken(newUserToken);
    }

    const link = `${this._configService.get('RESET_PASS_BASE_URL')}/${
      newPowerUser._id
    }/${resetToken.token}`;

    return { newPowerUser, link };
  }

  public async createSupportDesk(
    creationData: CreateUserDto,
  ): Promise<User | any | null> {
    if (await this._userExists(creationData.email)) {
      throw new BadRequestException('User Already Exists!');
    }

    const passwordHash = await Argon.hash(creationData.password);
    const newUserData: BaseUserDto = {
      fullName: creationData.fullName,
      email: creationData.email,
      passwordHash: passwordHash,
      role: Role.SUPPORT_DESK,
    };

    return await new this._userModel(newUserData).save();
  }

  public async createAdmin(creationData: CreateUserDto): Promise<User | any> {
    if (await this._userExists(creationData.email)) {
      throw new BadRequestException('User Already Exists!');
    }

    const passwordHash = await Argon.hash(creationData.password);
    const newUserData: BaseUserDto = {
      fullName: creationData.fullName,
      email: creationData.email,
      passwordHash: passwordHash,
      role: Role.ADMIN,
    };

    return await new this._userModel(newUserData).save();
  }

  public async getAllUsers(): Promise<User[] | any | null> {
    return await this._userModel.find({}).exec();
  }

  public async getUserByEmail(userEmail: string): Promise<User | any | null> {
    return await this._userModel.findOne({ email: userEmail }).exec();
  }

  public async getUserById(userId: string): Promise<User | any | null> {
    return await this._userModel.findById(userId).exec();
  }

  public async resetUserPasswordHash(
    userId: string,
    newPasswordHash: ResetPasswordDto,
  ): Promise<User | any | null> {
    return await this._userModel.findByIdAndUpdate(userId, {
      ...newPasswordHash,
    });
  }

  private async _userExists(userEmail: string): Promise<boolean> {
    return !!(await this._userModel.findOne({ email: userEmail }).exec());
  }

  private async _signToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
    };
    return await this._jwtService.signAsync(payload, {
      secret: this._configService.get('JWT_SECRET'),
      expiresIn: '10m',
    });
  }
}
