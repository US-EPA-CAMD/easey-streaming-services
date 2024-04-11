import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { StreamAllowanceHoldingsParamsDTO } from '../dto/allowance-holdings.params.dto';
import { AllowanceHoldingDim } from '../entities/allowance-holding-dim.entity';
import { AccountQueryBuilder } from '../utils/account-query-builder';

@Injectable()
export class AllowanceHoldingDimRepository extends Repository<
  AllowanceHoldingDim
> {
  constructor(entityManager: EntityManager) {
    super(AllowanceHoldingDim, entityManager);
  }

  private getColumns(): string[] {
    const columns = [
      'ahd.accountNumber',
      'ahd.accountName',
      'af.facilityId',
      'ahd.programCodeInfo',
      'ahd.vintageYear',
      'ahd.totalBlock',
      'ahd.startBlock',
      'ahd.endBlock',
      'af.stateCode',
      'af.epaRegion',
      'af.ownerOperator',
      'af.accountType',
      'atc.accountTypeDescription',
    ];

    const newCol = columns.map(col => {
      if (col === 'atc.accountTypeDescription') {
        return `${col} AS "accountType"`;
      } else {
        return `${col} AS "${col.split('.')[1]}"`;
      }
    });

    newCol.splice(columns.indexOf('af.accountType'), 1);

    return newCol;
  }

  async buildQuery(
    params: StreamAllowanceHoldingsParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('ahd')
      .select(this.getColumns())
      .innerJoin('ahd.accountFact', 'af')
      .innerJoin('af.accountTypeCd', 'atc');

    query = AccountQueryBuilder.createAccountQuery(
      query,
      params,
      [
        'vintageYear',
        'accountNumber',
        'facilityId',
        'ownerOperator',
        'stateCode',
        'programCodeInfo',
        'accountType',
      ],
      'ahd',
      'af',
      false,
      'atc',
    );

    query
      .orderBy('ahd.programCodeInfo')
      .addOrderBy('ahd.accountNumber')
      .addOrderBy('ahd.vintageYear')
      .addOrderBy('ahd.startBlock');

    return query.getQueryAndParameters();
  }
}
