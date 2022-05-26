import { Request } from 'express';

import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';

import { Get, Controller, Req, StreamableFile, Query } from '@nestjs/common';

import {
  BadRequestResponse,
  NotFoundResponse,
  ExcludeQuery,
  ApiQueryComplianceMultiSelect,
} from '../utils/swagger-decorator.const';

import { fieldMappings } from '../constants/account-field-mappings';
import { EmissionsComplianceService } from './emissions-compliance.service';
import { EmissionsComplianceDTO } from '../dto/emissions-compliance.dto';
import { StreamEmissionsComplianceParamsDTO } from '../dto/emissions-compliance.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Emissions Compliance')
export class EmissionsComplianceController {
  constructor(private readonly service: EmissionsComplianceService) {}

  @Get()
  @ApiOkResponse({
    description: 'Streams Emission-Compliance Data per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(EmissionsComplianceDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.compliance.emissions.data
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @ApiExtraModels(EmissionsComplianceDTO)
  @NotFoundResponse()
  @ApiQueryComplianceMultiSelect()
  @ExcludeQuery()
  async streamEmissionsCompliance(
    @Req() req: Request,
    @Query() params: StreamEmissionsComplianceParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissionsCompliance(req, params);
  }
}

export default EmissionsComplianceController;
