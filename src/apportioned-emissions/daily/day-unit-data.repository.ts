import { Repository, EntityRepository } from 'typeorm';

import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { DailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';

@EntityRepository(DayUnitDataView)
export class DayUnitDataRepository extends Repository<DayUnitDataView> {
  
  async buildQuery(
    columns: any[],
    params: DailyApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('dud').select(
      columns.map(col => `dud.${col.value} AS "${col.value}"`),
    );

    query = EmissionsQueryBuilder.createEmissionsQuery(
      query,
      params,
      [
        'beginDate',
        'endDate',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'dud',
    );

    query
      .orderBy('dud.facilityId')
      .addOrderBy('dud.unitId')
      .addOrderBy('dud.date');

    return query.getQueryAndParameters();
  }
}
