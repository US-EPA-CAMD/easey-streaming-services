import { Repository, EntityRepository } from 'typeorm';

import { MonthUnitDataView } from '../../entities/vw-month-unit-data.entity';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { MonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';

@EntityRepository(MonthUnitDataView)
export class MonthUnitDataRepository extends Repository<MonthUnitDataView> {

  async buildQuery(
    columns: any[],
    params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('mud').select(
      columns.map(col => `mud.${col.value} AS "${col.value}"`),
    );

    query = EmissionsQueryBuilder.createEmissionsQuery(
      query,
      params,
      [
        'year',
        'month',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'mud',
    );

    query
      .orderBy('mud.facilityId')
      .addOrderBy('mud.unitId')
      .addOrderBy('mud.year')
      .addOrderBy('mud.month');

    return query.getQueryAndParameters();
  }
}
