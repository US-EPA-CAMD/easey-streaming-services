import { Repository, EntityRepository } from 'typeorm';

import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { AnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';

@EntityRepository(AnnualUnitDataView)
export class AnnualUnitDataRepository extends Repository<AnnualUnitDataView> {

  async buildQuery(
    columns: any[],
    params: AnnualApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('aud').select(
      columns.map(col => `aud.${col.value} AS "${col.value}"`),
    );

    query = EmissionsQueryBuilder.createEmissionsQuery(
      query,
      params,
      [
        'year',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'aud',
    );

    query
      .orderBy('aud.facilityId')
      .addOrderBy('aud.unitId')
      .addOrderBy('aud.year');

    return query.getQueryAndParameters();
  }
}
