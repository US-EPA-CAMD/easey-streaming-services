import { Injectable } from '@nestjs/common';
import { Brackets, EntityManager, Repository } from 'typeorm';

import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

@Injectable()
export class DerivedHourlyRepository extends Repository<DerivedHrlyValue> {
  constructor(entityManager: EntityManager) {
    super(DerivedHrlyValue, entityManager);
  }

  private getColumns(): string[] {
    const columns = [];
    columns.push(
      'dh.id',
      'dh.hourId',
      'dh.parameterCode',
      'dh.adjustedHourlyValue',
      'dh.modcCode',
      'dh.locationId',
      'dh.reportPeriodId',
      'dh.userId',
      'dh.addDate',
      'dh.updateDate',
    );
    return columns.map(col => {
      return `${col} AS "${col.split('.')[1]}"`;
    });
  }

  async buildQuery(params: HourlyParamsDto): Promise<[string, any[]]> {
    const dateCondition = `ho.beginDate BETWEEN '${params.beginDate}' AND '${params.endDate}'`;

    let query = this.createQueryBuilder('dh')
      .select(this.getColumns())
      .innerJoin('dh.hrlyOpData', 'ho')
      .where(dateCondition);

    const unitPlantConditions = `unitPlant.orisCode IN (${params.orisCode.join(
      ', ',
    )}) AND unitPlant.orisCode NOTNULL`;
    const stackPipePlantConditions = `stackPipePlant.orisCode IN (${params.orisCode.join(
      ', ',
    )}) AND stackPipePlant.orisCode NOTNULL`;

    query = query
      .innerJoin('dh.monitorLocation', 'ml')
      .leftJoin('ml.unit', 'unit')
      .leftJoin('ml.stackPipe', 'stackPipe')
      .leftJoin('unit.plant', 'unitPlant')
      .leftJoin('stackPipe.plant', 'stackPipePlant')
      .andWhere(
        new Brackets(qb => {
          qb.where(unitPlantConditions).orWhere(stackPipePlantConditions);
        }),
      );

    if (params.locationName) {
      const locationStrings = params.locationName
        ?.map(location => `'${location}'`)
        .join(', ');

      const locationCondition = `(stackPipe.stack_name IN (${locationStrings}) OR unit.unitid IN (${locationStrings}))`;

      query = query.andWhere(locationCondition);
    }

    return query.getQueryAndParameters();
  }
}
