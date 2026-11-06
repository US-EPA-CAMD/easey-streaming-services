import { Injectable } from '@nestjs/common';
import { Brackets, EntityManager, Repository } from 'typeorm';

import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { HrlyOpData } from '../entities/hrly-op-data.entity';

@Injectable()
export class HourlyOperatingRepository extends Repository<HrlyOpData> {
  constructor(entityManager: EntityManager) {
    super(HrlyOpData, entityManager);
  }

  private getColumns(): string[] {
    const columns = [];
    columns.push(
      'ho.id',
      'ho.locationId',
      'ho.reportPeriodId',
      'ho.beginDate',
      'ho.beginHour',
      'ho.operatingTime',
      'ho.hourLoad',
      'ho.loadUnitsOfMeasureCode',
      'ho.userId',
      'ho.addDate',
      'ho.updateDate',
    );
    return columns.map(col => {
      return `${col} AS "${col.split('.')[1]}"`;
    });
  }

  async buildQuery(params: HourlyParamsDto): Promise<[string, any[]]> {
    const dateCondition = 'ho.beginDate BETWEEN :beginDate AND :endDate';

    let query = this.createQueryBuilder('ho')
      .select(this.getColumns())
      .where(dateCondition, {
        beginDate: params.beginDate,
        endDate: params.endDate,
      });

    const unitPlantConditions =
      'unitPlant.orisCode IN (:...orisCodes) AND unitPlant.orisCode NOTNULL';
    const stackPipePlantConditions =
      'stackPipePlant.orisCode IN (:...orisCodes) AND stackPipePlant.orisCode NOTNULL';

    query = query
      .innerJoin('ho.monitorLocation', 'ml')
      .leftJoin('ml.unit', 'unit')
      .leftJoin('ml.stackPipe', 'stackPipe')
      .leftJoin('unit.plant', 'unitPlant')
      .leftJoin('stackPipe.plant', 'stackPipePlant')
      .andWhere(
        new Brackets(qb => {
          qb.where(unitPlantConditions, {
            orisCodes: params.orisCode,
          }).orWhere(stackPipePlantConditions, {
            orisCodes: params.orisCode,
          });
        }),
      );

    if (params.locationName) {
      query = query.andWhere(
        '(stackPipe.stack_name IN (:...locationNames) OR unit.unitid IN (:...locationNames))',
        { locationNames: params.locationName },
      );
    }

    return query.getQueryAndParameters();
  }
}
