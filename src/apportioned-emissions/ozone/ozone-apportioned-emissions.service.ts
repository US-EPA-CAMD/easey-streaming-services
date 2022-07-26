import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  StreamableFile,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { fieldMappings } from '../../constants/emissions-field-mappings';
import { StreamingService } from '../../streaming/streaming.service';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsDTO } from '../../dto/ozone-apportioned-emissions.dto';
import { OzoneApportionedEmissionsParamsDTO, StreamOzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import { OzoneApportionedEmissionsFacilityAggregationDTO } from './../../dto/ozone-apportioned-emissions-facility-aggregation.dto';

@Injectable()
export class OzoneApportionedEmissionsService {
  
  constructor(
    private readonly logger: Logger,
    private readonly streamService: StreamingService,
    @InjectRepository(OzoneUnitDataRepository)
    private readonly repository: OzoneUnitDataRepository,
  ) {}

  async streamEmissions(
    req: Request,
    params: StreamOzoneApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="ozone-emissions-${uuid()}`;

    const fieldMappingsList = params.exclude
      ? fieldMappings.emissions.ozone.data.aggregation.unit.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.emissions.ozone.data.aggregation.unit;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeApportionedEmissions);
        const dto = plainToClass(OzoneApportionedEmissionsDTO, data, {
          enableImplicitConversion: true,
        });
        callback(null, dto);
      },
    });

    const [sql, values] = await this.repository.buildQuery(fieldMappingsList, params);

    return this.streamService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      fieldMappingsList,
    );
  }

  async streamEmissionsFacilityAggregation(
    req: Request,
    params: OzoneApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="ozone-emissions-facility-aggregation-${uuid()}"`;
    const [sql, values] = this.repository.buildFacilityAggregationQuery(params);
    
    const fieldMappingsList =
    fieldMappings.emissions.ozone.data.aggregation.facility;
    
    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          OzoneApportionedEmissionsFacilityAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
        callback(null, dto);
      },
    });

    return this.streamService.getStream(
      req,
      sql,
      values,
      toDto,
      disposition,
      fieldMappingsList,
    );
  }
}
