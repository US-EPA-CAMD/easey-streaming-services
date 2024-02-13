import { Request } from 'express';
import { v4 as uuid } from 'uuid';

import { Injectable, StreamableFile } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { StreamingService } from '../streaming/streaming.service';
import { fieldMappings } from '../constants/account-field-mappings';
import { Transform } from 'stream';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { ExcludeEmissionsCompliance } from '@us-epa-camd/easey-common/enums';
import { plainToClass } from 'class-transformer';
import { UnitComplianceDimRepository } from './unit-compliance-dim.repository';
import { StreamEmissionsComplianceParamsDTO } from '../dto/emissions-compliance.params.dto';
import { EmissionsComplianceDTO } from '../dto/emissions-compliance.dto';

@Injectable()
export class EmissionsComplianceService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: UnitComplianceDimRepository,
    private readonly streamingService: StreamingService,
  ) {}

  async streamEmissionsCompliance(
    req: Request,
    params: StreamEmissionsComplianceParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="emissions-compliance-${uuid()}`;

    let fieldMappingValues = [];
    fieldMappingValues = fieldMappings.compliance.emissions.data;
    const fieldMappingsList = params.exclude
      ? fieldMappingValues.filter(item => !params.exclude.includes(item.value))
      : fieldMappings.compliance.emissions.data;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeEmissionsCompliance);
        delete data.id;
        delete data.programCodeInfo;

        const ownOprArray = [data.ownerOperator, data.operator];
        delete data.operator;
        if (
          !params.exclude?.includes(ExcludeEmissionsCompliance.OWNER_OPERATOR)
        ) {
          const ownOprList = ownOprArray
            .filter(e => e)
            .join(',')
            .slice(0, -1)
            .split('),');
          const ownOprUniqueList = [...new Set(ownOprList)];
          const ownerOperator = ownOprUniqueList.join(')|');
          data.ownerOperator =
            ownerOperator.length > 0 ? `${ownerOperator})` : null;
        }
        const dto = plainToClass(EmissionsComplianceDTO, data, {
          enableImplicitConversion: true,
        });
        callback(null, dto);
      },
    });

    const [sql, values] = await this.repository.buildQuery(params);

    return this.streamingService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      fieldMappingsList,
    );
  }
}

export default EmissionsComplianceService;
