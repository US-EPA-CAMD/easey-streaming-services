import { Controller, Get, Query, Req, StreamableFile } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
  ApiQuery,
} from '@nestjs/swagger';

import { Request } from 'express';
import { HourlyOperatingService } from './hourly-operating.service';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { HourlyOperatingDTO } from '../dto/hourly-op.dto';

@ApiTags('Emissions')
@Controller('emissions')
@ApiSecurity('APIKey')
export class HourlyOperatingController {
  constructor(private readonly service: HourlyOperatingService) {}
  @Get('hourly/operating')
  @ApiOkResponse({
    description: 'Exports hourly operating values',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyOperatingDTO),
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
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'locationName',
    required: false,
    explode: false,
  })
  @ApiExtraModels(HourlyOperatingDTO)
  hourlyOperatingStream(
    @Req() req: Request,
    @Query() params: HourlyParamsDto,
  ): Promise<StreamableFile> {
    return this.service.streamValues(req, params);
  }
}
