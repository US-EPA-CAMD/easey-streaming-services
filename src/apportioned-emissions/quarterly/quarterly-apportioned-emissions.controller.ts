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
  ApiQueryQuarterly,
} from '../../utils/swagger-decorator.const';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { QuarterlyApportionedEmissionsDTO } from '../../dto/quarterly-apportioned-emissions.dto';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';
import { StreamQuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Quarterly Emissions')
@ApiExtraModels(QuarterlyApportionedEmissionsDTO)
export class QuarterlyApportionedEmissionsController {
  
  constructor(private readonly service: QuarterlyApportionedEmissionsService) { }

  @Get()
  @ApiOkResponse({
    description: 'Streams Quarterly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(QuarterlyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.quarterly
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiQueryQuarterly()
  @ApiProgramQuery()
  @ExcludeQuery()
  async streamEmissions(
    @Req() req: Request,
    @Query() params: StreamQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }
}
