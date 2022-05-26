import { Request } from 'express';
import { Get, Controller, Query, Req, StreamableFile } from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
  ApiSecurity,
} from '@nestjs/swagger';

import {
  BadRequestResponse,
  NotFoundResponse,
  ExcludeQuery,
  ApiQueryAccountMultiSelect,
} from '../utils/swagger-decorator.const';
import { AllowanceHoldingsService } from './allowance-holdings.service';
import { StreamAllowanceHoldingsParamsDTO } from '../dto/allowance-holdings.params.dto';
import { AllowanceHoldingsDTO } from '../dto/allowance-holdings.dto';
import { fieldMappings } from '../constants/account-field-mappings';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Allowance Holdings')
@ApiExtraModels(AllowanceHoldingsDTO)
export class AllowanceHoldingsController {
  constructor(private readonly allowanceService: AllowanceHoldingsService) {}
  @Get()
  @ApiOkResponse({
    description: 'Streams Allowance Holdings per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AllowanceHoldingsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.allowances.holdings.data
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryAccountMultiSelect()
  @ExcludeQuery()
  async streamAllowanceHoldings(
    @Req() req: Request,
    @Query() params: StreamAllowanceHoldingsParamsDTO,
  ): Promise<StreamableFile> {
    return this.allowanceService.streamAllowanceHoldings(req, params);
  }
}
