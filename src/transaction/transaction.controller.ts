import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { AuthenticatedGuard } from 'src/auth/guards';
import { UseRole } from 'src/user/decorator';
import { Role } from 'src/user/enum';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly _transactionService: TransactionService) {}

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.SUPPORT_DESK)
  @Get()
  public async accessLogs() {
    return await this._transactionService.getAllLogs();
  }

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.USER)
  @Get('user')
  public async accessUserLogs(@GetUser('userId') userId: string) {
    return await this._transactionService.getLogsByUser(userId);
  }
}
