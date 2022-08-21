import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '@/dto/pagination.dto';
import { GetBalanceDto, GetBalanceReturnDto } from './dtos/get-balance.dto';
import { Transaction, TransactionDocument } from './transaction.scheme';
import { TransactionDto } from './dtos/transaction.dto';
import { ReplenishmentDto } from './dtos/replenishment.dto';
import { P2PDto } from './dtos/p2p.dto';
import { TransactionType } from './enums/transaction-type.enum';
import { BuyingDto } from './dtos/buying.dto';
import { TransactionsListDto } from './dtos/transactions-list.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionsModel: Model<TransactionDocument>,
    private readonly httpService: HttpService,
  ) {}

  async getBalance({
    user,
    currency = 'USD',
  }: GetBalanceDto): Promise<GetBalanceReturnDto> {
    const doc = await this.transactionsModel
      .aggregate()
      .match({ user: +user })
      .group({ _id: null, balance: { $sum: '$amount' } });

    let balance = doc[0] ? doc[0].balance : 0;
    balance = await this.currencyExchanger(currency, balance);
    return { balance, currency };
  }

  async replenishment({
    user,
    amount,
    bill,
  }: ReplenishmentDto): Promise<TransactionDto> {
    const transaction = new this.transactionsModel({
      _id: new Types.ObjectId(),
      user,
      amount,
      bill,
      type: TransactionType.BILL,
    });
    await transaction.save();

    return transaction.toJSON();
  }

  async p2p({ user, amount, userTo }: P2PDto): Promise<TransactionDto> {
    const transactionSend = new this.transactionsModel({
      _id: new Types.ObjectId(),
      user,
      amount,
      userTo,
      type: TransactionType.P2P,
    });
    await transactionSend.save();

    const transactionGet = new this.transactionsModel({
      _id: new Types.ObjectId(),
      user: userTo,
      amount: amount * -1,
      userFrom: user,
      type: TransactionType.P2P,
    });

    await transactionGet.save();

    return transactionSend.toJSON();
  }

  async buying({ user, amount, product }: BuyingDto): Promise<TransactionDto> {
    const transaction = new this.transactionsModel({
      _id: new Types.ObjectId(),
      user,
      amount,
      product,
      type: TransactionType.BUYING,
    });
    await transaction.save();
    return transaction.toJSON();
  }

  async transactionsList(
    user: number,
    { page, limit, sort }: PaginationDto,
  ): Promise<TransactionsListDto> {
    const transactions = await this.transactionsModel
      .find({ user }, { __v: 0, updatedAt: 0 })
      .sort(sort)
      .skip(Math.ceil(limit * page - limit))
      .limit(+limit);

    const count = await this.transactionsModel.countDocuments({ user });

    return { transactions, count };
  }

  private async currencyExchanger(
    toCurrency: string,
    amount: number,
    fromCurrency = 'USD',
  ): Promise<number> {
    if (amount === 0) return 0;
    if (toCurrency === fromCurrency) return amount;
    const exchanged = await firstValueFrom(
      this.httpService.get(
        `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`,
      ),
    );
    if (exchanged.data.result === null) {
      throw new HttpException(
        {
          statusCode: 400,
          message: ['A non-existent currency is specified'],
          error: 'Bad Request',
        },
        400,
      );
    }
    return exchanged.data.result;
  }
}
