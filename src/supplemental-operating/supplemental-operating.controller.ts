import { Controller, Get, Query, Req, StreamableFile } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { SupplementalOperatingService } from './supplemental-operating.service';
import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';

import { Request } from 'express';
import { SupplementalOperatingDTO } from '../dto/supplemental-operating.dto';

@ApiTags('Emissions')
@Controller('emissions')
@ApiSecurity('APIKey')
export class SupplementalOperatingController {
  constructor(private readonly service: SupplementalOperatingService) {}

  @Get('supplemental-operating')
  @ApiOkResponse({
    description: 'Exports supplemental operating values',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(SupplementalOperatingDTO),
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
  @ApiExtraModels(SupplementalOperatingDTO)
  supplementalOperatingStream(
    @Req() req: Request,
    @Query() params: OrisQuarterParamsDto,
  ): Promise<StreamableFile> {
    return this.service.streamValues(req, params);
  }
}
