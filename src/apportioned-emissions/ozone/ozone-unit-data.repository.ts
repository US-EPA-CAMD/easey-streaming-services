import { Repository, EntityRepository } from 'typeorm';

import { OzoneUnitDataView } from '../../entities/vw-ozone-unit-data.entity';
import { EmissionsQueryBuilder } from '../../utils/emissions-query-builder';
import { OzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';

@EntityRepository(OzoneUnitDataView)
export class OzoneUnitDataRepository extends Repository<OzoneUnitDataView> {

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
}
