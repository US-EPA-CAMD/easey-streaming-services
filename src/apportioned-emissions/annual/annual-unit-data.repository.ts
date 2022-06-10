import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { AnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';

@EntityRepository(AnnualUnitDataView)
export class AnnualUnitDataRepository extends Repository<AnnualUnitDataView> {

  async buildQuery(
    columns: any[],
    params: AnnualApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('aud').select(
      columns.map(col => `aud.${col.value} AS "${col.value}"`),
    );

    query = EmissionsQueryBuilder.createEmissionsQuery(
      query,
      params,
      [
        'year',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'aud',
    );

    query
      .orderBy('aud.facilityId')
      .addOrderBy('aud.unitId')
      .addOrderBy('aud.year');

    return query.getQueryAndParameters();
  }

  buildStateAggregationQuery(
    params: AnnualApportionedEmissionsParamsDTO,
  ): [string, any[]] {

    const selectColumns = ['aud.stateCode', 'aud.year'];
    const orderByColumns = ['aud.stateCode', 'aud.year'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    return query.getQueryAndParameters();
  }

  buildNationalAggregationQuery(
    params: AnnualApportionedEmissionsParamsDTO,
  ): [string, any[]] {

    const selectColumns = ['aud.year'];
    const orderByColumns = ['aud.year'];

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
  ): SelectQueryBuilder<AnnualUnitDataView> {

    let query = this.createQueryBuilder('aud').select(
      selectColumns.map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );

    query
      .addSelect('SUM(aud.grossLoad)', 'grossLoad')
      .addSelect('SUM(aud.steamLoad)', 'steamLoad')
      .addSelect('SUM(aud.so2Mass)', 'so2Mass')
      .addSelect('SUM(aud.co2Mass)', 'co2Mass')
      .addSelect('SUM(aud.noxMass)', 'noxMass')
      .addSelect('SUM(aud.heatInput)', 'heatInput');

    query = EmissionsQueryBuilder.createEmissionsQuery(
      query,
      params,
      [
        'year',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'aud',
    );

    selectColumns.forEach(c => query.addGroupBy(c));
    orderByColumns.forEach(c => query.addOrderBy(c));
    return query;
  }

  // getFacilityStreamQuery(params: AnnualApportionedEmissionsParamsDTO) {
  //   const columns = [
  //     'aud.stateCode',
  //     'aud.facilityName',
  //     'aud.facilityId',
  //     'aud.year',
  //   ];
  //   const orderByColumns = ['aud.facilityId', 'aud.year'];

  //   return this.buildAggregationQuery(
  //     params,
  //     columns,
  //     orderByColumns,
  //   ).getQueryAndParameters();
  // }

}
