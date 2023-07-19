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
import { DerivedHourlyValueBaseDTO } from '../dto/derived-hourly-value.dto';
import { DerivedHourlyService } from './derived-hourly.service';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';

@ApiTags('Emissions')
@Controller('emissions')
@ApiSecurity('APIKey')
export class DerivedHourlyController {
  constructor(private readonly service: DerivedHourlyService) {}
  @Get('hourly/derived-values')
  @ApiOkResponse({
    description: 'Exports supplemental operating values',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(DerivedHourlyValueBaseDTO),
        },
      },
    },
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'orisCode',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'locationName',
    required: false,
    explode: false,
  })
  @ApiExtraModels(DerivedHourlyValueBaseDTO)
  derivedHourlyStream(
    @Req() req: Request,
    @Query() params: HourlyParamsDto,
  ): Promise<StreamableFile> {
    return this.service.streamValues(req, params);
  }
}
