import { Repository, EntityRepository } from 'typeorm';

import { AccountFact } from '../entities/account-fact.entity';
import { AccountAttributesParamsDTO } from '../dto/account-attributes.params.dto';
import { AccountQueryBuilder } from '../utils/account-query-builder';

@EntityRepository(AccountFact)
export class AccountFactRepository extends Repository<AccountFact> {
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
      if (col === 'atc.accountTypeDescription') {
        return `${col} AS "accountType"`;
      } else {
        return `${col} AS "${col.split('.')[1]}"`;
      }
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

    query.addSelect(`REPLACE(af.ownerOperator, ',', ' | ') AS "ownerOperator"`)
    query.orderBy('af.accountNumber').addOrderBy('af.programCodeInfo');

    return query.getQueryAndParameters();
  }
}
