import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

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

  buildFacilityAggregationQuery(
    params: MonthlyApportionedEmissionsParamsDTO,
  ): [string, any[]] {

    const selectColumns = ['mud.stateCode', 'mud.facilityName', 'mud.facilityId', 'mud.year', 'mud.month',];
    const orderByColumns = ['mud.facilityId', 'mud.year', 'mud.month',];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    return query.getQueryAndParameters();

  }

  buildStateAggregationQuery(
    params: MonthlyApportionedEmissionsParamsDTO,
  ): [string, any[]] {

    const selectColumns = ['mud.stateCode', 'mud.year', 'mud.month'];
    const orderByColumns = ['mud.stateCode', 'mud.year', 'mud.month'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    return query.getQueryAndParameters();
  }

  buildNationalAggregationQuery(
    params: MonthlyApportionedEmissionsParamsDTO,
  ): [string, any[]] {

    const selectColumns = ['mud.year', 'mud.month'];
    const orderByColumns = ['mud.year', 'mud.month'];

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
  ): SelectQueryBuilder<MonthUnitDataView> {

    let query = this.createQueryBuilder('mud').select(
      selectColumns.map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );

    query
      .addSelect('SUM(mud.grossLoad)', 'grossLoad')
      .addSelect('SUM(mud.steamLoad)', 'steamLoad')
      .addSelect('SUM(mud.so2Mass)', 'so2Mass')
      .addSelect('SUM(mud.co2Mass)', 'co2Mass')
      .addSelect('SUM(mud.noxMass)', 'noxMass')
      .addSelect('SUM(mud.heatInput)', 'heatInput');

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

    selectColumns.forEach(c => query.addGroupBy(c));
    orderByColumns.forEach(c => query.addOrderBy(c));
    
    return query;
  }

}
