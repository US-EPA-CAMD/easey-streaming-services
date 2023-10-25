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
    const plantConditions = `plant.orisCode IN (${params.orisCode.join(
      ', ',
    )}) AND plant.orisCode NOTNULL`;

    const unitQuery = this.createQueryBuilder('dh')
      .select(this.getColumns())
      .leftJoin('dh.hrlyOpData', 'ho')
      .where(dateCondition)
      .innerJoin('dh.monitorLocation', 'ml')
      .leftJoin('ml.unit', 'unit')
      .innerJoin('unit.plant', 'plant', plantConditions);

    const stackPipeQuery = this.createQueryBuilder('dh')
      .select(this.getColumns())
      .leftJoin('dh.hrlyOpData', 'ho')
      .where(dateCondition)
      .innerJoin('dh.monitorLocation', 'ml')
      .leftJoin('ml.stackPipe', 'stackPipe')
      .innerJoin('stackPipe.plant', 'plant', plantConditions);

    if (params.locationName) {
      const locationStrings = params.locationName
        ?.map(location => `'${location}'`)
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
