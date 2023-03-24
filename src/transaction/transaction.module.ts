import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  providers: [TransactionService],
  exports: [TransactionService],
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
