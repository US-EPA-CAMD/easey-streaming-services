import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { DailyApportionedEmissionsParamsDTO, StreamDailyApportionedEmissionsParamsDTO } from 'src/dto/daily-apportioned-emissions.params.dto';

@Injectable()
export class DayUnitDataRepository extends Repository<DayUnitDataView> {
  constructor(entityManager: EntityManager) {
    super(DayUnitDataView, entityManager);
  }

  buildQuery(
    columns: any[],
    params: StreamDailyApportionedEmissionsParamsDTO,
  ): [string, any[]] {
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

    if(params.unitId) {
      query.andWhere('dud.unitId = :unitId', { unitId: params.unitId });
    }

    if(params.unit_id) {
      query.andWhere('dud.unit_id = :unit_id', { unit_id: params.unit_id });
    }

    query
      .orderBy('dud.facilityId')
      .addOrderBy('dud.unitId')
      .addOrderBy('dud.date');

    return query.getQueryAndParameters();
  }

  buildFacilityAggregationQuery(
    params: DailyApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    const selectColumns = [
      'dud.stateCode',
      'dud.facilityName',
      'dud.facilityId',
      'dud.date',
    ];
    const orderByColumns = ['dud.facilityId', 'dud.date'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    return query.getQueryAndParameters();
  }

  buildStateAggregationQuery(
    params: DailyApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    const selectColumns = ['dud.stateCode', 'dud.date'];
    const orderByColumns = ['dud.stateCode', 'dud.date'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    return query.getQueryAndParameters();
  }

  buildNationalAggregationQuery(
    params: DailyApportionedEmissionsParamsDTO,
  ): [string, any[]] {
    const selectColumns = ['dud.date'];
    const orderByColumns = ['dud.date'];

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
  ): SelectQueryBuilder<DayUnitDataView> {
    let query = null;
    query = this.createQueryBuilder('dud').select(
      selectColumns.map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );

    query
      .addSelect('SUM(dud.grossLoad)', 'grossLoad')
      .addSelect('SUM(dud.steamLoad)', 'steamLoad')
      .addSelect('SUM(dud.so2Mass)', 'so2Mass')
      .addSelect('SUM(dud.co2Mass)', 'co2Mass')
      .addSelect('SUM(dud.noxMass)', 'noxMass')
      .addSelect('SUM(dud.heatInput)', 'heatInput');

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

    selectColumns.forEach(c => query.addGroupBy(c));
    orderByColumns.forEach(c => query.addOrderBy(c));

    return query;
  }
}
