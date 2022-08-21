import { PaginationDto } from './../../dto/pagination.dto';
import { GetBalanceDto, GetBalanceReturnDto } from './dtos/get-balance.dto';
import { P2PDto } from './dtos/p2p.dto';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ReplenishmentDto } from './dtos/replenishment.dto';
import { TransactionDto } from './dtos/transaction.dto';
import { TransactionsService } from './transactions.service';
import { TransactionsListDto } from './dtos/transactions-list.dto';
import { BuyingDto } from './dtos/buying.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/balance')
  async getBalance(
    @Query() { user, currency }: GetBalanceDto,
  ): Promise<GetBalanceReturnDto> {
    return await this.transactionsService.getBalance({ user, currency });
  }

  @Get('/:user')
  async transactionsList(
    @Param('user') user: number,
    @Query() { page, limit, sort }: PaginationDto,
  ): Promise<TransactionsListDto> {
    return await this.transactionsService.transactionsList(user, {
      page,
      limit,
      sort,
    });
  }

  @Post('/replenishment')
  async replenishment(
    @Body() replenishmentDto: ReplenishmentDto,
  ): Promise<TransactionDto> {
    return await this.transactionsService.replenishment(replenishmentDto);
  }

  @Post('/p2p')
  async p2p(@Body() p2pDto: P2PDto): Promise<TransactionDto> {
    const balance = await this.transactionsService.getBalance({
      user: p2pDto.user,
    });
    if (balance.balance < p2pDto.amount * -1) {
      throw new HttpException(
        {
          statusCode: 400,
          message: ['There are insufficient funds on the balance'],
          error: 'Bad Request',
        },
        400,
      );
    }

    if (p2pDto.user === p2pDto.userTo) {
      throw new HttpException(
        {
          statusCode: 400,
          message: ['You cannot send funds to yourself'],
          error: 'Bad Request',
        },
        400,
      );
    }

    return await this.transactionsService.p2p(p2pDto);
  }

  @Post('/buying')
  async buying(@Body() buyingDto: BuyingDto): Promise<TransactionDto> {
    const balance = await this.transactionsService.getBalance({
      user: buyingDto.user,
    });
    if (balance.balance < buyingDto.amount * -1) {
      throw new HttpException(
        {
          statusCode: 400,
          message: ['There are insufficient funds on the balance'],
          error: 'Bad Request',
        },
        400,
      );
    }
    return await this.transactionsService.buying(buyingDto);
  }
}
