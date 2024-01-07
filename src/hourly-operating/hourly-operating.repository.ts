import { Repository, EntityRepository, Brackets } from 'typeorm';
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

    let query = this.createQueryBuilder('ho')
      .select(this.getColumns())
      .where(dateCondition);

    const unitPlantConditions = `unitPlant.orisCode IN (${params.orisCode.join(', ', )}) AND unitPlant.orisCode NOTNULL`;
    const stackPipePlantConditions = `stackPipePlant.orisCode IN (${params.orisCode.join(', ', )}) AND stackPipePlant.orisCode NOTNULL`;

    query = query
      .innerJoin('ho.monitorLocation', 'ml')
      .leftJoin('ml.unit', 'unit')
      .leftJoin('ml.stackPipe', 'stackPipe')
      .leftJoin('unit.plant', 'unitPlant')
      .leftJoin('stackPipe.plant', 'stackPipePlant')
      .andWhere(
        new Brackets((qb) => {
            qb.where(unitPlantConditions)
              .orWhere(stackPipePlantConditions)
        }));

    if (params.locationName) {
      const locationStrings = params.locationName
        .map(location => `'${location}'`)
        .join(', ');

      const locationCondition = `(stackPipe.stack_name IN (${locationStrings}) OR unit.unitid IN (${locationStrings}))`;

      query = query.andWhere(locationCondition);
    }

    return query.getQueryAndParameters();
  }
}
