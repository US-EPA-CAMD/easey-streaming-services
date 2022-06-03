import { Request } from 'express';

import { Get, Req, Query, Controller, StreamableFile } from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  getSchemaPath,
  ApiSecurity,
  ApiExtraModels,
} from '@nestjs/swagger';

import {
  BadRequestResponse,
  NotFoundResponse,
  ExcludeQuery,
  ApiQueryEmissionsMultiSelect,
} from '../../../utils/swagger-decorator.const';
import { HourlyMatsApportionedEmissionsDTO } from '../../../dto/hourly-mats-apportioned-emissions.dto';
import { HourlyMatsApportionedEmissionsService } from './hourly-mats-apportioned-emissions.service';
import { StreamHourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { fieldMappings } from '../../../constants/emissions-field-mappings';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Hourly MATS Emissions')
@ApiExtraModels(HourlyMatsApportionedEmissionsDTO)
export class HourlyMatsApportionedEmissionsController {
  constructor(
    private readonly service: HourlyMatsApportionedEmissionsService,
  ) {}

  @Get()
  @ApiOkResponse({
    description:
      'Streams Hourly MATS Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyMatsApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.mats.hourly.data.aggregation.unit
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ExcludeQuery()
  async streamEmissions(
    @Req() req: Request,
    @Query() params: StreamHourlyMatsApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }
}
