import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseTokenDto } from './dto';
import { Token, TokenDocument } from './schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly _tokenModel: Model<TokenDocument>,
  ) {}

  public async createToken(creationData: BaseTokenDto): Promise<Token | any> {
    try {
      if (await this._tokenModel.findOne({ userId: creationData.userId })) {
        throw new BadRequestException('Token For The User Already Exists!');
      }
      return await new this._tokenModel(creationData).save();
    } catch (err) {
      throw new InternalServerErrorException(
        'Token Cannot Be Created Due To An Unknown Error!',
        err,
      );
    }
  }

  public async getTokenByUserId(userId: string): Promise<Token | any> {
    try {
      return await this._tokenModel.findOne({ userId: userId }).exec();
    } catch (err) {
      throw new InternalServerErrorException(
        'Some Unknown Error Occurred While Fetching The Token!',
        err,
      );
    }
  }

  public async deleteToken(tokenId: string): Promise<Token | any> {
    try {
      if (!(await this._tokenModel.findById(tokenId))) {
        throw new NotFoundException('Token Does Not Exist!');
      }
      const deletedToken = await this._tokenModel
        .findByIdAndDelete(tokenId)
        .exec();
      return deletedToken;
    } catch (err) {
      throw new InternalServerErrorException(
        'Some Unknown Error Occurred While Deleting The Token!',
        err,
      );
    }
  }

  public async getTokenByUserIdAndToken(
    userId: string,
    token: string,
  ): Promise<Token | any> {
    try {
      return await this._tokenModel
        .findOne({ userId: userId, token: token })
        .exec();
    } catch (err) {
      throw new InternalServerErrorException(
        'Some Unknown Error Occurred While Fetching The Token!',
        err,
      );
    }
  }
}
