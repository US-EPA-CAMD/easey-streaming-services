import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

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

  buildFacilityAggregationQuery(
    params: QuarterlyApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    const selectColumns = [
      'qud.stateCode',
      'qud.facilityName',
      'qud.facilityId',
      'qud.year',
      'qud.quarter',
    ];
    const orderByColumns = ['qud.facilityId', 'qud.year', 'qud.quarter'];

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
  ): SelectQueryBuilder<QuarterUnitDataView> {
    let query = this.createQueryBuilder('qud').select(
      selectColumns.map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );

    query
      .addSelect('SUM(qud.grossLoad)', 'grossLoad')
      .addSelect('SUM(qud.steamLoad)', 'steamLoad')
      .addSelect('SUM(qud.so2Mass)', 'so2Mass')
      .addSelect('SUM(qud.co2Mass)', 'co2Mass')
      .addSelect('SUM(qud.noxMass)', 'noxMass')
      .addSelect('SUM(qud.heatInput)', 'heatInput');

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

    selectColumns.forEach(c => query.addGroupBy(c));
    orderByColumns.forEach(c => query.addOrderBy(c));
    return query;
  }
}
