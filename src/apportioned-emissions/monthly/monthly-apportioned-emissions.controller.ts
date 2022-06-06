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
  ApiQueryMonthly,
} from '../../utils/swagger-decorator.const';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { MonthlyApportionedEmissionsDTO } from '../../dto/monthly-apportioned-emissions.dto';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';
import { MonthlyApportionedEmissionsParamsDTO, StreamMonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsFacilityAggregationDTO } from '../../dto/monthly-apportioned-emissions-facility-aggregation.dto';
import { MonthlyApportionedEmissionsStateAggregationDTO } from '../../dto/monthly-apportioned-emissions-state-aggregation.dto';
import { MonthlyApportionedEmissionsNationalAggregationDTO } from '../../dto/monthly-apportioned-emissions-national-aggregation.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Monthly Emissions')
@ApiExtraModels(MonthlyApportionedEmissionsDTO)
@ApiExtraModels(MonthlyApportionedEmissionsFacilityAggregationDTO)
@ApiExtraModels(MonthlyApportionedEmissionsStateAggregationDTO)
@ApiExtraModels(MonthlyApportionedEmissionsNationalAggregationDTO)
export class MonthlyApportionedEmissionsController {
  
  constructor(
    private readonly service: MonthlyApportionedEmissionsService
  ) { }

  @Get()
  @ApiOkResponse({
    description: 'Streams Monthly Apportioned Emissions per filter criteria',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(MonthlyApportionedEmissionsDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.monthly.data.aggregation.unit.map(i => i.label).join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiQueryMonthly()
  @ApiProgramQuery()
  @ExcludeQuery()
  async streamEmissions(
    @Req() req: Request,
    @Query() params: StreamMonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissions(req, params);
  }

  @Get('by-facility')
  @ApiOkResponse({
    description:
      'Streams Monthly Apportioned Emissions data per filter criteria aggregated by facility',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            MonthlyApportionedEmissionsFacilityAggregationDTO,
          ),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.monthly.data.aggregation.facility
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiQueryMonthly()
  @ApiProgramQuery()
  streamEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissionsFacilityAggregation(req, params);
  }

  @Get('by-state')
  @ApiOkResponse({
    description:
      'Streams Monthly Apportioned Emissions data per filter criteria aggregated by state',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(MonthlyApportionedEmissionsStateAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.monthly.data.aggregation.state
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiQueryMonthly()
  @ApiProgramQuery()
  streamEmissionsStateAggregation(
    @Req() req: Request,
    @Query() params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissionsStateAggregation(req, params);
  }

  @Get('nationally')
  @ApiOkResponse({
    description:
      'Streams Monthly Apportioned Emissions data per filter criteria aggregated nationally',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            MonthlyApportionedEmissionsNationalAggregationDTO,
          ),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.monthly.data.aggregation.national
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiQueryMonthly()
  @ApiProgramQuery()
  streamEmissionsNationalAggregation(
    @Req() req: Request,
    @Query() params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissionsNationalAggregation(req, params);
  }
}
