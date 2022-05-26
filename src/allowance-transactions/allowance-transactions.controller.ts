import { Request } from 'express';

import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  getSchemaPath,
  ApiQuery,
  ApiExtraModels,
} from '@nestjs/swagger';

import { Get, Controller, Req, StreamableFile, Query } from '@nestjs/common';

import {
  BadRequestResponse,
  NotFoundResponse,
  ExcludeQuery,
  ApiQueryAccountMultiSelect,
} from '../utils/swagger-decorator.const';

import { fieldMappings } from '../constants/account-field-mappings';
import { AllowanceTransactionsDTO } from '../dto/allowance-transactions.dto';
import { AllowanceTransactionsService } from './allowance-transactions.service';
import { StreamAllowanceTransactionsParamsDTO } from '../dto/allowance-transactions.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Allowance Transactions')
export class AllowanceTransactionsController {
  constructor(private readonly service: AllowanceTransactionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Streams Allowance Transactions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(AllowanceTransactionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.allowances.transactions.data
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryAccountMultiSelect()
  @ApiExtraModels(AllowanceTransactionsDTO)
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'transactionType',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'vintageYear',
    required: false,
    explode: false,
  })
  @ExcludeQuery()
  async streamAllowanceTransactions(
    @Req() req: Request,
    @Query() params: StreamAllowanceTransactionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamAllowanceTransactions(req, params);
  }
}

export default AllowanceTransactionsController;
