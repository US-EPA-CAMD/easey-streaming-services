import { Request } from 'express';

import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';

import { Get, Controller, Req, Query, StreamableFile } from '@nestjs/common';

import {
  ApiQueryFacilityMultiSelect,
  BadRequestResponse,
  NotFoundResponse,
  ExcludeQuery,
} from '../utils/swagger-decorator.const';

import { fieldMappings } from '../constants/facility-attributes-field-mappings';
import { FacilitiesService } from './facilities.service';
import { FacilityAttributesDTO } from './../dto/facility-attributes.dto';
import { StreamFacilityAttributesParamsDTO } from '../dto/facility-attributes-params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Facilities')
export class FacilitiesController {
  constructor(private readonly service: FacilitiesService) {}

  @Get('/attributes')
  @ApiOkResponse({
    description: 'Streams a list of Facilities',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(FacilityAttributesDTO),
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          example: fieldMappings.facilities.attributes
            .map(i => i.label)
            .join(','),
        },
      },
    },
  })
  @BadRequestResponse()
  @NotFoundResponse()
  @ApiQueryFacilityMultiSelect()
  @ApiExtraModels(FacilityAttributesDTO)
  @ExcludeQuery()
  streamAttributes(
    @Req() req: Request,
    @Query() params: StreamFacilityAttributesParamsDTO,
  ): Promise<StreamableFile> {
    return this.service.streamAttributes(req, params);
  }
}

export default FacilitiesController;
