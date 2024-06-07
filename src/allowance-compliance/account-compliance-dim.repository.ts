import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { StreamAllowanceComplianceParamsDTO } from '../dto/allowance-compliance.params.dto';
import { AccountComplianceDim } from '../entities/account-compliance-dim.entity';
import { AccountQueryBuilder } from '../utils/account-query-builder';
import { includesOtcNbp } from '../utils/includes-otc-nbp.const';

@Injectable()
export class AccountComplianceDimRepository extends Repository<
  AccountComplianceDim
> {
  constructor(entityManager: EntityManager) {
    super(AccountComplianceDim, entityManager);
  }

  private getColumns(isOTCNBP: boolean): string[] {
    let columns = [];

    columns.push(
      'acd.programCodeInfo',
      'acd.year',
      'acd.accountNumber',
      'af.accountName',
      'af.facilityName',
      'af.facilityId',
      'acd.unitsAffected',
      'acd.allocated',
    );

    if (isOTCNBP) {
      columns.push('acd.bankedHeld', 'acd.currentHeld');
    }

    columns.push(
      'acd.totalAllowancesHeld',
      'acd.complianceYearEmissions',
      'acd.otherDeductions',
    );

    if (isOTCNBP) {
      columns.push(
        'acd.totalRequiredDeductions',
        'acd.currentDeductions',
        'acd.deductOneToOne',
        'acd.deductTwoToOne',
      );
    }

    columns.push(
      'acd.totalAllowancesDeducted',
      'acd.carriedOver',
      'acd.excessEmissions',
      'af.ownerOperator',
      'af.stateCode',
    );

    return columns.map(col => {
      return `${col} AS "${col.split('.')[1]}"`;
    });
  }

  async buildQuery(
    params: StreamAllowanceComplianceParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('acd')
      .select(this.getColumns(includesOtcNbp(params)))
      .innerJoin('acd.accountFact', 'af');

    query = AccountQueryBuilder.createAccountQuery(
      query,
      params,
      ['facilityId', 'ownerOperator', 'stateCode', 'programCodeInfo'],
      'acd',
      'af',
      true,
    );
    query = AccountQueryBuilder.createComplianceQuery(
      query,
      params,
      ['year'],
      'acd',
    );

    query
      .orderBy('acd.programCodeInfo')
      .addOrderBy('acd.year')
      .addOrderBy('acd.accountNumber');

    return query.getQueryAndParameters();
  }
}
