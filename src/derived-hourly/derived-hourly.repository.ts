import { Repository, EntityRepository } from 'typeorm';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

@EntityRepository(DerivedHrlyValue)
export class DerivedHourlyRepository extends Repository<DerivedHrlyValue> {
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
      .leftJoin('dh.hrlyOpData', 'ho')
      .where(dateCondition);

    const plantConditions = `plant.orisCode IN (${params.orisCode.join(
      ', ',
    )}) AND plant.orisCode NOTNULL`;
    query = query
      .innerJoin('dh.monitorLocation', 'ml')
      .leftJoin('ml.unit', 'unit')
      .leftJoin('ml.stackPipe', 'stackPipe')
      .innerJoin('unit.plant', 'plant', plantConditions);

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
