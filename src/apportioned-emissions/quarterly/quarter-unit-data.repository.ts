import { Repository, EntityRepository } from 'typeorm';

import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { QuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';

@EntityRepository(QuarterUnitDataView)
export class QuarterUnitDataRepository extends Repository<QuarterUnitDataView> {

  async buildQuery(
    columns: any[],
    params: QuarterlyApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('qud').select(
      columns.map(col => `qud.${col.value} AS "${col.value}"`),
    );

    query = EmissionsQueryBuilder.createEmissionsQuery(
      query,
      params,
      [
        'year',
        'quarter',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'qud',
    );

    query
      .orderBy('qud.facilityId')
      .addOrderBy('qud.unitId')
      .addOrderBy('qud.year')
      .addOrderBy('qud.quarter');

    return query.getQueryAndParameters();
  }
}
