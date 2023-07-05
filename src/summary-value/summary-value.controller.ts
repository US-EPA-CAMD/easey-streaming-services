import { Controller, Get, Query, Req, StreamableFile } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SummaryValueService } from './summary-value.service';
import { SummaryValueParamsDto } from '../dto/summary-value.params.dto';

import { Request } from 'express';

@ApiTags('Emissions')
@Controller('emissions')
@ApiSecurity('APIKey')
export class SummaryValueController {
  constructor(private readonly service: SummaryValueService) {}

  @Get('summary-values')
  @ApiOkResponse({
    description:
      'Exports summary values for specified ORIS codes and reporting period range.',
  })
  supplementaryExport(
    @Req() req: Request,
    @Query() params: SummaryValueParamsDto,
  ): Promise<StreamableFile> {
    return this.service.streamSummaryValues(req, params);
  }
}
