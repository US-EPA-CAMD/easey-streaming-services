import { Repository, EntityRepository } from 'typeorm';

import { AccountFact } from '../entities/account-fact.entity';
import { AccountAttributesParamsDTO } from '../dto/account-attributes.params.dto';
import { AccountQueryBuilder } from '../utils/account-query-builder';

@EntityRepository(AccountFact)
export class AccountFactRepository extends Repository<AccountFact> {
  async buildQuery(
    columns: any[],
    params: AccountAttributesParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('af')
      .select(columns.map(col => `af.${col.value} AS "${col.value}"`))
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
