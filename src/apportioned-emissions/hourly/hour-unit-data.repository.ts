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

  getFacilityStreamQuery(params: HourlyApportionedEmissionsParamsDTO): [string, any[]] {
    return this.buildFacilityAggregationQuery(params).getQueryAndParameters();
  }

  private buildFacilityAggregationQuery(
    params: HourlyApportionedEmissionsParamsDTO,
  ): SelectQueryBuilder<HourUnitDataView> {
    let query = this.createQueryBuilder('hud').select(
      [
        'hud.stateCode',
        'hud.facilityName',
        'hud.facilityId',
        'hud.date',
        'hud.hour',
      ].map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );
    query = this.buildAggregationQuery(query, params);
    query
      .addGroupBy('hud.stateCode')
      .addGroupBy('hud.facilityName')
      .addGroupBy('hud.facilityId')
      .addGroupBy('hud.date')
      .addGroupBy('hud.hour');

    query
      .orderBy('hud.facilityId')
      .addOrderBy('hud.date')
      .addOrderBy('hud.hour');

    return query;
  }

  // private buildStateAggregationQuery(
  //   params: HourlyApportionedEmissionsParamsDTO,
  // ): SelectQueryBuilder<HourUnitDataView> {
  //   let query = this.createQueryBuilder('hud').select(
  //     ['hud.stateCode', 'hud.date', 'hud.hour'].map(col => {
  //       return `${col} AS "${col.split('.')[1]}"`;
  //     }),
  //   );
  //   query = this.buildAggregationQuery(query, params);
  //   query
  //     .addGroupBy('hud.stateCode')
  //     .addGroupBy('hud.date')
  //     .addGroupBy('hud.hour');

  //   query
  //     .orderBy('hud.stateCode')
  //     .addOrderBy('hud.date')
  //     .addOrderBy('hud.hour');

  //   return query;
  // }

  // private buildNationalAggregationQuery(
  //   params: HourlyApportionedEmissionsParamsDTO,
  // ): SelectQueryBuilder<HourUnitDataView> {
  //   let query = this.createQueryBuilder('hud').select(
  //     ['hud.date', 'hud.hour'].map(col => {
  //       return `${col} AS "${col.split('.')[1]}"`;
  //     }),
  //   );
  //   query = this.buildAggregationQuery(query, params);
  //   query.addGroupBy('hud.date').addGroupBy('hud.hour');
  //   query.addOrderBy('hud.date').addOrderBy('hud.hour');

  //   return query;
  // }

  private buildAggregationQuery(query, params): SelectQueryBuilder<HourUnitDataView> {
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

    return query;
  }
}
