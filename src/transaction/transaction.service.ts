import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionDto } from './dto';
import { LogType } from './enum';
import { Transaction, TransactionDocument } from './schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly _transactionModel: Model<TransactionDocument>,
  ) {}

  public async createLog(
    blogId: string,
    userId: string,
    logType: LogType,
  ): Promise<any> {
    const log$: TransactionDto = {
      log: `User ${userId} ${logType}d Blog ${blogId}`,
      user: userId,
    };
    await new this._transactionModel(log$).save();
  }

  public async getAllLogs(): Promise<Transaction[]> {
    return await this._transactionModel
      .find()
      .select({ log: 1, _id: 0, user: 1 })
      .exec();
  }

  public async getLogsByUser(userId: string): Promise<Transaction[]> {
    return await this._transactionModel.find({ user: userId }).exec();
  }
}
