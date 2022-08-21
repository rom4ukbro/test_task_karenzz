import { TransactionDto } from './transaction.dto';

export class TransactionsListDto {
  transactions: TransactionDto[];
  count: number;
}
