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
import { HourlyApportionedEmissionsParamsDTO, StreamHourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsFacilityAggregationDTO } from 'src/dto/hourly-apportioned-emissions-facility-aggregation.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Apportioned Hourly Emissions')
@ApiExtraModels(HourlyApportionedEmissionsDTO)
export class HourlyApportionedEmissionsController {

  constructor(
    private readonly service: HourlyApportionedEmissionsService
  ) {}

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
          example: fieldMappings.emissions.hourly.data.aggregation.unit.map(i => i.label).join(','),
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

  @Get('by-facility')
  @ApiOkResponse({
    description:
      'Streams Hourly Apportioned Emissions data per filter criteria aggregated by facility',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HourlyApportionedEmissionsFacilityAggregationDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.emissions.hourly.data.aggregation.facility
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryEmissionsMultiSelect()
  @ApiProgramQuery()
  streamEmissionsFacilityAggregation(
    @Req() req: Request,
    @Query() params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamEmissionsFacilityAggregation(req, params);
  }

  // @Get('by-state')
  // @ApiOkResponse({
  //   description:
  //     'Streams Hourly Apportioned Emissions data per filter criteria aggregated by state',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         $ref: getSchemaPath(HourlyApportionedEmissionsStateAggregationDTO),
  //       },
  //     },
  //     'text/csv': {
  //       schema: {
  //         type: 'string',
  //         example: fieldMappings.emissions.hourly.data.aggregation.state
  //           .map(i => i.label)
  //           .join(','),
  //       },
  //     },
  //   },
  // })
  // @BadRequestResponse()
  // @NotFoundResponse()
  // @ApiQueryMultiSelect()
  // @ApiProgramQuery()
  // streamEmissionsStateAggregation(
  //   @Req() req: Request,
  //   @Query() params: HourlyApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   return this.service.streamEmissionsStateAggregation(req, params);
  // }

  // @Get('nationally/stream')
  // @ApiOkResponse({
  //   description:
  //     'Streams Hourly Apportioned Emissions data per filter criteria aggregated nationally',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         $ref: getSchemaPath(HourlyApportionedEmissionsNationalAggregationDTO),
  //       },
  //     },
  //     'text/csv': {
  //       schema: {
  //         type: 'string',
  //         example: fieldMappings.emissions.hourly.data.aggregation.national
  //           .map(i => i.label)
  //           .join(','),
  //       },
  //     },
  //   },
  // })
  // @BadRequestResponse()
  // @NotFoundResponse()
  // @ApiQueryMultiSelect()
  // @ApiProgramQuery()
  // streamEmissionsNationalAggregation(
  //   @Req() req: Request,
  //   @Query() params: HourlyApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   return this.service.streamEmissionsNationalAggregation(req, params);
  // }
}
