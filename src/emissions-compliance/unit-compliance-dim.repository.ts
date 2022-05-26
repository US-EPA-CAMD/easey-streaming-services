import { UnitComplianceDim } from 'src/entities/unit-compliance-dim.entity';
import { EntityRepository, Repository } from 'typeorm';

import { StreamEmissionsComplianceParamsDTO } from '../dto/emissions-compliance.params.dto';
import { AccountQueryBuilder } from '../utils/account-query-builder';

@EntityRepository(UnitComplianceDim)
export class UnitComplianceDimRepository extends Repository<UnitComplianceDim> {
  private getColumns(): string[] {
    const columns = [
      'ucd.id',
      'uf.programCodeInfo',
      'ucd.year',
      'uf.facilityName',
      'uf.facilityId',
      'uf.unitId',
      'odf.owner',
      'odf.operator',
      'uf.stateCode',
      'ucd.complianceApproach',
      'ucd.avgPlanId',
      'ucd.emissionsLimitDisplay',
      'ucd.actualEmissionsRate',
      'ucd.avgPlanActual',
      'ucd.inCompliance',
    ];

    return columns.map(col => {
      if (col === 'odf.owner') {
        return `${col} AS "ownerOperator"`;
      } else {
        return `${col} AS "${col.split('.')[1]}"`;
      }
    });
  }

  async buildQuery(
    params: StreamEmissionsComplianceParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('ucd')
      .select(this.getColumns())
      .leftJoin('ucd.unitFact', 'uf')
      .leftJoin('ucd.ownerDisplayFact', 'odf');

    query = AccountQueryBuilder.createAccountQuery(
      query,
      params,
      ['facilityId', 'stateCode'],
      'ucd',
      'uf',
      true,
    );
    query = AccountQueryBuilder.createComplianceQuery(
      query,
      params,
      ['year', 'ownerOperator'],
      'ucd',
    );

    query
      .orderBy('uf.programCodeInfo')
      .addOrderBy('ucd.year')
      .addOrderBy('uf.facilityId')
      .addOrderBy('uf.unitId');

    return query.getQueryAndParameters();
  }
}
