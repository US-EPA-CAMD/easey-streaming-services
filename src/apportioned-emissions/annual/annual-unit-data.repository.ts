import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { AnnualApportionedEmissionsParamsDTO, StreamAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';
import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';

@Injectable()
export class AnnualUnitDataRepository extends Repository<AnnualUnitDataView> {
  constructor(entityManager: EntityManager) {
    super(AnnualUnitDataView, entityManager);
  }

  async buildQuery(
    columns: any[],
    params: StreamAnnualApportionedEmissionsParamsDTO,
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

    if(params.userid) {
      query.andWhere('aud.userid = :userid', { userid: params.userid });
    }

    if(params.addDate) {
      query.andWhere('DATE(aud.addDate) = DATE(:addDate)', { addDate: params.addDate });
    }

    query
      .orderBy('aud.facilityId')
      .addOrderBy('aud.unitId')
      .addOrderBy('aud.year');

    return query.getQueryAndParameters();
  }

  buildFacilityAggregationQuery(
    params: AnnualApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    const selectColumns = [
      'aud.stateCode',
      'aud.facilityName',
      'aud.facilityId',
      'aud.year',
    ];
    const orderByColumns = ['aud.facilityId', 'aud.year'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

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
}
