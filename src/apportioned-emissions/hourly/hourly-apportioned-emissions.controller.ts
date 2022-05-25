import { Request } from 'express';

import {
  Get,
  Req,
  Query,
  Controller,
  StreamableFile,
} from '@nestjs/common';

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
  ApiQueryEmissionsMultiSelect,
  ApiProgramQuery,
  ExcludeQuery,
} from '../../utils/swagger-decorator.const';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { HourlyApportionedEmissionsDTO } from '../../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { StreamHourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Hourly Emissions')
@ApiExtraModels(HourlyApportionedEmissionsDTO)
export class HourlyApportionedEmissionsController {

  constructor(private readonly service: HourlyApportionedEmissionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Streams Hourly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.hourly.map(i => i.label).join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiProgramQuery()
  @ExcludeQuery()
  async streamEmissions(
    @Req() req: Request,
    @Query() params: StreamHourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }
}
