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

  // private buildFacilityAggregationQuery(
  //   params: DailyApportionedEmissionsParamsDTO,
  // ): SelectQueryBuilder<DayUnitDataView> {
  //   let query = this.createQueryBuilder('dud').select(
  //     ['dud.stateCode', 'dud.facilityName', 'dud.facilityId', 'dud.date'].map(
  //       col => {
  //         return `${col} AS "${col.split('.')[1]}"`;
  //       },
  //     ),
  //   );
  //   query = this.buildAggregationQuery(query, params);
  //   query
  //     .addGroupBy('dud.stateCode')
  //     .addGroupBy('dud.facilityName')
  //     .addGroupBy('dud.facilityId')
  //     .addGroupBy('dud.date');

  //   query.orderBy('dud.facilityId').addOrderBy('dud.date');

  //   return query;
  // }

  // private buildStateAggregationQuery(
  //   params: DailyApportionedEmissionsParamsDTO,
  // ): SelectQueryBuilder<DayUnitDataView> {
  //   let query = this.createQueryBuilder('dud').select(
  //     ['dud.stateCode', 'dud.date'].map(col => {
  //       return `${col} AS "${col.split('.')[1]}"`;
  //     }),
  //   );
  //   query = this.buildAggregationQuery(query, params);
  //   query.addGroupBy('dud.stateCode').addGroupBy('dud.date');

  //   query.orderBy('dud.stateCode').addOrderBy('dud.date');

  //   return query;
  // }

  // private buildNationalAggregationQuery(
  //   params: DailyApportionedEmissionsParamsDTO,
  // ): SelectQueryBuilder<DayUnitDataView> {
  //   let query = this.createQueryBuilder('dud').select(
  //     ['dud.date'].map(col => {
  //       return `${col} AS "${col.split('.')[1]}"`;
  //     }),
  //   );
  //   query = this.buildAggregationQuery(query, params);
  //   query.addGroupBy('dud.date');
  //   query.addOrderBy('dud.date');

  //   return query;
  // }

  // private buildAggregationQuery(query, params): SelectQueryBuilder<DayUnitDataView> {
  //   query
  //     .addSelect('SUM(dud.grossLoad)', 'grossLoad')
  //     .addSelect('SUM(dud.steamLoad)', 'steamLoad')
  //     .addSelect('SUM(dud.so2Mass)', 'so2Mass')
  //     .addSelect('SUM(dud.co2Mass)', 'co2Mass')
  //     .addSelect('SUM(dud.noxMass)', 'noxMass')
  //     .addSelect('SUM(dud.heatInput)', 'heatInput');

  //   query = EmissionsQueryBuilder.createEmissionsQuery(
  //     query,
  //     params,
  //     [
  //       'beginDate',
  //       'endDate',
  //       'stateCode',
  //       'facilityId',
  //       'unitType',
  //       'controlTechnologies',
  //       'unitFuelType',
  //       'programCodeInfo',
  //     ],
  //     'dud',
  //   );

  //   return query;
  // }
}
