import { Controller, Get, Query, Req, StreamableFile } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { SummaryValueService } from './summary-value.service';
import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';

import { Request } from 'express';
import { SummaryValueBaseDTO } from '../dto/summary-value.dto';

@ApiTags('Emissions')
@Controller('emissions')
@ApiSecurity('APIKey')
export class SummaryValueController {
  constructor(private readonly service: SummaryValueService) {}

  @Get('summary-values')
  @ApiOkResponse({
    description: 'Exports summary values',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(SummaryValueBaseDTO),
        },
      },
    },
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'orisCode',
    required: true,
    explode: false,
  })
  @ApiExtraModels(SummaryValueBaseDTO)
  summaryValueStream(
    @Req() req: Request,
    @Query() params: OrisQuarterParamsDto,
  ): Promise<StreamableFile> {
    return this.service.streamSummaryValues(req, params);
  }
}
