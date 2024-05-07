import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { OzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import { OzoneUnitDataView } from '../../entities/vw-ozone-unit-data.entity';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';

@Injectable()
export class OzoneUnitDataRepository extends Repository<OzoneUnitDataView> {
  constructor(entityManager: EntityManager) {
    super(OzoneUnitDataView, entityManager);
  }

  async buildQuery(
    columns: any[],
    params: OzoneApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    let query = this.createQueryBuilder('oud').select(
      columns.map(col => `oud.${col.value} AS "${col.value}"`),
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
      'oud',
    );

    query
      .orderBy('oud.facilityId')
      .addOrderBy('oud.unitId')
      .addOrderBy('oud.year');

    return query.getQueryAndParameters();
  }

  buildFacilityAggregationQuery(
    params: OzoneApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    const selectColumns = [
      'oud.stateCode',
      'oud.facilityName',
      'oud.facilityId',
      'oud.year',
    ];
    const orderByColumns = ['oud.facilityId', 'oud.year'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    return query.getQueryAndParameters();
  }

  buildStateAggregationQuery(
    params: OzoneApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    const selectColumns = ['oud.stateCode', 'oud.year'];
    const orderByColumns = ['oud.stateCode', 'oud.year'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    return query.getQueryAndParameters();
  }

  buildNationalAggregationQuery(
    params: OzoneApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    const selectColumns = ['oud.year'];
    const orderByColumns = ['oud.year'];

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
  ): SelectQueryBuilder<OzoneUnitDataView> {
    let query = this.createQueryBuilder('oud').select(
      selectColumns.map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );

    query
      .addSelect('SUM(oud.grossLoad)', 'grossLoad')
      .addSelect('SUM(oud.steamLoad)', 'steamLoad')
      .addSelect('SUM(oud.so2Mass)', 'so2Mass')
      .addSelect('SUM(oud.co2Mass)', 'co2Mass')
      .addSelect('SUM(oud.noxMass)', 'noxMass')
      .addSelect('SUM(oud.heatInput)', 'heatInput');

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
      'oud',
    );

    selectColumns.forEach(c => query.addGroupBy(c));
    orderByColumns.forEach(c => query.addOrderBy(c));
    return query;
  }
}
