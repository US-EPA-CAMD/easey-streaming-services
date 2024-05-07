import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { StreamAllowanceTransactionsParamsDTO } from '../dto/allowance-transactions.params.dto';
import { TransactionBlockDim } from '../entities/transaction-block-dim.entity';
import { AccountQueryBuilder } from '../utils/account-query-builder';

@Injectable()
export class TransactionBlockDimRepository extends Repository<
  TransactionBlockDim
> {
  constructor(entityManager: EntityManager) {
    super(TransactionBlockDim, entityManager);
  }

  private getColumns(): string[] {
    const columns = [
      'tbd.programCodeInfo',
      'tbd.transactionBlockId', //primarykey
      'tbd.transactionId',
      'tf.transactionTotal',
      'ttc.transactionTypeDescription',
      'tf.sellAccountNumber',
      'tf.sellAccountName',
      'satc.accountTypeDescription',
      'tf.sellFacilityName',
      'tf.sellFacilityId',
      'tf.sellState',
      'tf.sellEpaRegion',
      'tf.sellSourceCategory',
      'tf.sellOwner',
      'tf.buyAccountNumber',
      'tf.buyAccountName',
      'batc.accountTypeDescription',
      'tf.buyFacilityName',
      'tf.buyFacilityId',
      'tf.buyState',
      'tf.buyEpaRegion',
      'tf.buySourceCategory',
      'tf.buyOwner',
      'tf.transactionDate',
      'tbd.vintageYear',
      'tbd.startBlock',
      'tbd.endBlock',
      'tbd.totalBlock',
    ];

    return columns.map(col => {
      if (col === 'ttc.transactionTypeDescription') {
        return `${col} AS "transactionType"`;
      } else if (col === 'satc.accountTypeDescription') {
        return `${col} AS "sellAccountType"`;
      } else if (col === 'batc.accountTypeDescription') {
        return `${col} AS "buyAccountType"`;
      } else {
        return `${col} AS "${col.split('.')[1]}"`;
      }
    });
  }

  async buildQuery(
    params: StreamAllowanceTransactionsParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('tbd')
      .select(this.getColumns())
      .innerJoin('tbd.transactionFact', 'tf')
      .innerJoin('tf.buyAccountTypeCd', 'batc')
      .innerJoin('tf.sellAccountTypeCd', 'satc')
      .innerJoin('tf.transactionTypeCd', 'ttc');

    query = AccountQueryBuilder.createAccountQuery(
      query,
      params,
      ['vintageYear', 'programCodeInfo'],
      'tbd',
      'tf',
      true,
    );

    query = AccountQueryBuilder.createTransactionQuery(
      query,
      params,
      [
        'accountType',
        'accountNumber',
        'facilityId',
        'ownerOperator',
        'stateCode',
        'transactionBeginDate',
        'transactionEndDate',
        'transactionType',
      ],
      'tf',
      'batc',
      'satc',
      'ttc',
    );

    query
      .orderBy('tbd.programCodeInfo')
      .addOrderBy('tbd.transactionId')
      .addOrderBy('tbd.vintageYear')
      .addOrderBy('tbd.startBlock');

    return query.getQueryAndParameters();
  }
}
