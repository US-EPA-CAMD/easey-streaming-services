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

  // private buildFacilityAggregationQuery(
  //   params: MonthlyApportionedEmissionsParamsDTO,
  // ): SelectQueryBuilder<MonthUnitDataView> {
  //   let query = this.createQueryBuilder('mud').select(
  //     [
  //       'mud.stateCode',
  //       'mud.facilityName',
  //       'mud.facilityId',
  //       'mud.year',
  //       'mud.month',
  //     ].map(col => {
  //       return `${col} AS "${col.split('.')[1]}"`;
  //     }),
  //   );
  //   query = this.buildAggregationQuery(query, params);
  //   query
  //     .addGroupBy('mud.stateCode')
  //     .addGroupBy('mud.facilityName')
  //     .addGroupBy('mud.facilityId')
  //     .addGroupBy('mud.year')
  //     .addGroupBy('mud.month');

  //   query
  //     .orderBy('mud.facilityId')
  //     .addOrderBy('mud.year')
  //     .addOrderBy('mud.month');

  //   return query;
  // }

  // private buildStateAggregationQuery(
  //   params: MonthlyApportionedEmissionsParamsDTO,
  // ): SelectQueryBuilder<MonthUnitDataView> {
  //   let query = this.createQueryBuilder('mud').select(
  //     ['mud.stateCode', 'mud.year', 'mud.month'].map(col => {
  //       return `${col} AS "${col.split('.')[1]}"`;
  //     }),
  //   );
  //   query = this.buildAggregationQuery(query, params);
  //   query
  //     .addGroupBy('mud.stateCode')
  //     .addGroupBy('mud.year')
  //     .addGroupBy('mud.month');

  //   query
  //     .orderBy('mud.stateCode')
  //     .addOrderBy('mud.year')
  //     .addOrderBy('mud.month');

  //   return query;
  // }

  // private buildNationalAggregationQuery(
  //   params: MonthlyApportionedEmissionsParamsDTO,
  // ): SelectQueryBuilder<MonthUnitDataView> {
  //   let query = this.createQueryBuilder('mud').select(
  //     ['mud.year', 'mud.month'].map(col => {
  //       return `${col} AS "${col.split('.')[1]}"`;
  //     }),
  //   );
  //   query = this.buildAggregationQuery(query, params);
  //   query.addGroupBy('mud.year').addGroupBy('mud.month');
  //   query.addOrderBy('mud.year').addOrderBy('mud.month');

  //   return query;
  // }

  // private buildAggregationQuery(query, params): SelectQueryBuilder<MonthUnitDataView> {
  //   query
  //     .addSelect('SUM(mud.grossLoad)', 'grossLoad')
  //     .addSelect('SUM(mud.steamLoad)', 'steamLoad')
  //     .addSelect('SUM(mud.so2Mass)', 'so2Mass')
  //     .addSelect('SUM(mud.co2Mass)', 'co2Mass')
  //     .addSelect('SUM(mud.noxMass)', 'noxMass')
  //     .addSelect('SUM(mud.heatInput)', 'heatInput');

  //   query = EmissionsQueryBuilder.createEmissionsQuery(
  //     query,
  //     params,
  //     [
  //       'year',
  //       'month',
  //       'stateCode',
  //       'facilityId',
  //       'unitType',
  //       'controlTechnologies',
  //       'unitFuelType',
  //       'programCodeInfo',
  //     ],
  //     'mud',
  //   );

  //   return query;
  // }
}
