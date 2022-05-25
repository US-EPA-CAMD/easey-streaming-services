import { Repository, EntityRepository } from 'typeorm';

import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { HourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';

@EntityRepository(HourUnitDataView)
export class HourUnitDataRepository extends Repository<HourUnitDataView> {

  async buildQuery(
    columns: any[],
    params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('hud').select(
      columns.map(col => `hud.${col.value} AS "${col.value}"`),
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
        'operatingHoursOnly',
      ],
      'hud',
    );

    query
      .orderBy('hud.facilityId')
      .addOrderBy('hud.unitId')
      .addOrderBy('hud.date')
      .addOrderBy('hud.hour');

    return query.getQueryAndParameters();
  }
}
