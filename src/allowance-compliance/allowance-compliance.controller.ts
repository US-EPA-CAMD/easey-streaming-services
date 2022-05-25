import { Request } from 'express';

import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  getSchemaPath,
  ApiQuery,
} from '@nestjs/swagger';

import { Get, Controller, Req, StreamableFile, Query } from '@nestjs/common';

import {
  BadRequestResponse,
  NotFoundResponse,
  ExcludeQuery,
  ApiQueryComplianceMultiSelect,
} from '../utils/swagger-decorator.const';

import { AllowanceComplianceService } from './allowance-compliance.service';
import { StreamAllowanceComplianceParamsDTO } from '../dto/allowance-compliance.params.dto';
import { fieldMappings } from '../constants/account-field-mappings';
import { AllowanceComplianceDTO } from '../dto/allowance-compliance.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Allowance Compliance')
export class AllowanceComplianceController {
  constructor(private readonly service: AllowanceComplianceService) {}

  @Get()
  @ApiOkResponse({
    description: 'Streams Allowance Compliance Data per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AllowanceComplianceDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.compliance.allowanceNbpOtc.data
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryComplianceMultiSelect()
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'programCodeInfo',
    required: false,
    explode: false,
  })
  @ExcludeQuery()
  streamAllowanceCompliance(
    @Req() req: Request,
    @Query() params: StreamAllowanceComplianceParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamAllowanceCompliance(req, params);
  }
}

export default AllowanceComplianceController;
