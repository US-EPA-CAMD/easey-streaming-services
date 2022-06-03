import { Repository, EntityRepository } from 'typeorm';

import { HourUnitMatsDataView } from '../../../entities/vw-hour-unit-mats-data.entity';
import { HourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { EmissionsQueryBuilder } from '../../../utils/emissions-query-builder';

@EntityRepository(HourUnitMatsDataView)
export class HourUnitMatsDataRepository extends Repository<
  HourUnitMatsDataView
> {
  buildQuery(
    columns: any[],
    params: HourlyMatsApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    let query = this.createQueryBuilder('humd').select(
      columns.map(col => `humd.${col.value} AS "${col.value}"`),
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
        'operatingHoursOnly',
      ],
      'humd',
    );
    query
      .orderBy('humd.facilityId')
      .addOrderBy('humd.unitId')
      .addOrderBy('humd.date')
      .addOrderBy('humd.hour');

    return query.getQueryAndParameters();
  }
}
