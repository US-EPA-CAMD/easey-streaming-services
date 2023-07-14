import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { HourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';

@EntityRepository(HourUnitDataView)
export class HourUnitDataRepository extends Repository<HourUnitDataView> {
  buildQuery(
    columns: any[],
    params: HourlyApportionedEmissionsParamsDTO,
  ): [string, any[]] {
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

  buildFacilityAggregationQuery(
    params: HourlyApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    const selectColumns = [
      'hud.stateCode',
      'hud.facilityName',
      'hud.facilityId',
      'hud.date',
      'hud.hour',
    ];
    const orderByColumns = ['hud.facilityId', 'hud.date', 'hud.hour'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    return query.getQueryAndParameters();
  }

  buildStateAggregationQuery(
    params: HourlyApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    const selectColumns = ['hud.stateCode', 'hud.date', 'hud.hour'];
    const orderByColumns = ['hud.stateCode', 'hud.date', 'hud.hour'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    return query.getQueryAndParameters();
  }

  buildNationalAggregationQuery(
    params: HourlyApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    const selectColumns = ['hud.date', 'hud.hour'];
    const orderByColumns = ['hud.date', 'hud.hour'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    return query.getQueryAndParameters();
  }

  private buildAggregationQuery(
    params,
    selectColumns: string[],
    orderByColumns: string[],
  ): SelectQueryBuilder<HourUnitDataView> {
    let query = this.createQueryBuilder('hud').select(
      selectColumns.map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );

    query
      .addSelect('SUM(hud.grossLoad)', 'grossLoad')
      .addSelect('SUM(hud.steamLoad)', 'steamLoad')
      .addSelect('SUM(hud.so2Mass)', 'so2Mass')
      .addSelect('SUM(hud.co2Mass)', 'co2Mass')
      .addSelect('SUM(hud.noxMass)', 'noxMass')
      .addSelect('SUM(hud.heatInput)', 'heatInput');

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

    selectColumns.forEach(c => query.addGroupBy(c));
    orderByColumns.forEach(c => query.addOrderBy(c));

    return query;
  }
}
