import { Repository, EntityRepository } from 'typeorm';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { HrlyOpData } from '../entities/hrly-op-data.entity';

@EntityRepository(HrlyOpData)
export class HourlyOperatingRepository extends Repository<HrlyOpData> {
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
    const dateCondition = `ho.beginDate BETWEEN '${params.beginDate}' AND '${params.endDate}'`;
    const plantConditions = `plant.orisCode IN (${params.orisCode.join(
      ', ',
    )}) AND plant.orisCode NOTNULL`;

    const unitQuery = this.createQueryBuilder('ho')
      .select(this.getColumns())
      .where(dateCondition)
      .innerJoin('ho.monitorLocation', 'ml')
      .leftJoin('ml.unit', 'unit')
      .innerJoin('unit.plant', 'plant', plantConditions);

    const stackPipeQuery = this.createQueryBuilder('ho')
      .select(this.getColumns())
      .where(dateCondition)
      .innerJoin('ho.monitorLocation', 'ml')
      .leftJoin('ml.stackPipe', 'stackPipe')
      .innerJoin('stackPipe.plant', 'plant', plantConditions);

    if (params.locationName) {
      const locationStrings = params.locationName
        .map(location => `'${location}'`)
        .join(', ');

      const stackPipeLocationCondition = `(stackPipe.stack_name IN (${locationStrings}))`;
      const unitLocationCondition = `(unit.unitid IN (${locationStrings}))`;
      stackPipeQuery.andWhere(stackPipeLocationCondition);
      unitQuery.andWhere(unitLocationCondition);
    }

    const finalQuery = `${unitQuery.getQuery()} UNION ALL ${stackPipeQuery.getQuery()}`;
    return [finalQuery, []];
  }
}
