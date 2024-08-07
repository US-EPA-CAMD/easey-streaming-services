import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AccountFact } from '../entities/account-fact.entity';
import { AccountAttributesParamsDTO } from '../dto/account-attributes.params.dto';
import { AccountQueryBuilder } from '../utils/account-query-builder';

@Injectable()
export class AccountFactRepository extends Repository<AccountFact> {
  constructor(entityManager: EntityManager) {
    super(AccountFact, entityManager);
  }

  private getColumns(): string[] {
    const columns = [
      'af.accountNumber',
      'af.accountName',
      'af.programCodeInfo',
      'atc.accountTypeDescription',
      'af.facilityId',
      'af.unitId',
      'af.ownerOperator',
      'af.stateCode',
      'af.epaRegion',
      'af.nercRegion',
    ];

    return columns.map(col => {
      if (col === 'atc.accountTypeDescription') return `${col} AS "accountType"`;
      return `${col} AS "${col.split('.')[1]}"`;
    });
  }

  async buildQuery(
    params: AccountAttributesParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('af')
      .select(this.getColumns())
      .innerJoin('af.accountTypeCd', 'atc');

    query = AccountQueryBuilder.createAccountQuery(
      query,
      params,
      [
        'accountNumber',
        'programCodeInfo',
        'facilityId',
        'ownerOperator',
        'stateCode',
        'accountType',
      ],
      'af',
      'af',
      false,
      'atc',
    );
    
    query.orderBy('af.accountNumber').addOrderBy('af.programCodeInfo');

    return query.getQueryAndParameters();
  }
}
