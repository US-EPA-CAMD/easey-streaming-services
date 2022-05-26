import { Request } from 'express';
import { v4 as uuid } from 'uuid';

import { Injectable, StreamableFile } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { StreamingService } from '../streaming/streaming.service';
import { fieldMappings } from '../constants/account-field-mappings';
import { AccountComplianceDimRepository } from './account-compliance-dim.repository';
import { StreamAllowanceComplianceParamsDTO } from '../dto/allowance-compliance.params.dto';
import { Transform } from 'stream';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { ExcludeAllowanceCompliance } from '@us-epa-camd/easey-common/enums';
import { plainToClass } from 'class-transformer';
import { AllowanceComplianceDTO } from '../dto/allowance-compliance.dto';
import { includesOtcNbp } from '../utils/includes-otc-nbp.const';

@Injectable()
export class AllowanceComplianceService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: AccountComplianceDimRepository,
    private readonly streamingService: StreamingService,
  ) {}

  async streamAllowanceCompliance(
    req: Request,
    params: StreamAllowanceComplianceParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="allowance-compliance-${uuid()}`;
    const isOTCNBP = includesOtcNbp(params);

    let fieldMapping;
    if (isOTCNBP) {
      fieldMapping = fieldMappings.compliance.allowanceNbpOtc.data;
    } else {
      fieldMapping = fieldMappings.compliance.allowance.data;
    }

    const fieldMappingsList = params.exclude
      ? fieldMapping.filter(item => !params.exclude.includes(item.value))
      : fieldMapping;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeAllowanceCompliance);
        if (!isOTCNBP) {
          delete data.bankedHeld;
          delete data.currentHeld;
          delete data.totalRequiredDeductions;
          delete data.currentDeductions;
          delete data.deductOneToOne;
          delete data.deductTwoToOne;
        }
        const dto = plainToClass(AllowanceComplianceDTO, data, {
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

export default AllowanceComplianceService;
