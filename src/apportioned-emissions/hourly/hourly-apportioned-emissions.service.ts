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
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsDTO } from '../../dto/hourly-apportioned-emissions.dto';
import { StreamHourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsFacilityAggregationDTO } from '../../dto/hourly-apportioned-emissions-facility-aggregation.dto';
import { HourlyApportionedEmissionsStateAggregationDTO } from '../../dto/hourly-apportioned-emissions-state-aggregation.dto';
import { HourlyApportionedEmissionsNationalAggregationDTO } from '../../dto/hourly-apportioned-emissions-national-aggregation.dto';

@Injectable()
export class HourlyApportionedEmissionsService {
  
  constructor(
    private readonly logger: Logger,
    private readonly streamService: StreamingService,    
    @InjectRepository(HourUnitDataRepository)
    private readonly repository: HourUnitDataRepository,
  ) {}
  
  async streamEmissions(
    req: Request,
    params: StreamHourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="hourly-emissions-${uuid()}`;

    const fieldMappingsList = params.exclude
      ? fieldMappings.emissions.hourly.data.aggregation.unit.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.emissions.hourly.data.aggregation.unit;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeApportionedEmissions);
        const dto = plainToClass(HourlyApportionedEmissionsDTO, data, {
          enableImplicitConversion: true,
        });
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        callback(null, dto);
      },
    });
    const [sql, values] = this.repository.buildQuery(fieldMappingsList, params);
    
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
    params: StreamHourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="hourly-emissions-facility-aggregation-${uuid()}"`
    const [sql, values] = this.repository.getFacilityStreamQuery(params);
    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeApportionedEmissions);

        const dto = plainToClass(
          HourlyApportionedEmissionsFacilityAggregationDTO,
          data, 
          {
            enableImplicitConversion: true,
          },
        );
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    const fieldMappingsList = params.exclude
    ? fieldMappings.emissions.hourly.data.aggregation.facility.filter(
        item => !params.exclude.includes(item.value),
      )
    : fieldMappings.emissions.hourly.data.aggregation.facility;

    return this.streamService.getStream(req, sql, values, toDto, disposition, fieldMappingsList)
  }

  async streamEmissionsStateAggregation(
    req: Request,
    params: StreamHourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="hourly-emissions-state-aggregation-${uuid()}"`;

    const [sql, values] = this.repository.getStateStreamQuery(params);
    
    const fieldMappingsList = params.exclude
    ? fieldMappings.emissions.hourly.data.aggregation.state.filter(
        item => !params.exclude.includes(item.value),
      )
    : fieldMappings.emissions.hourly.data.aggregation.state;

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          HourlyApportionedEmissionsStateAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    return this.streamService.getStream(req, sql, values, toDto, disposition, fieldMappingsList);
  }

  async streamEmissionsNationalAggregation(
    req: Request,
    params: StreamHourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {

      const disposition = `attachment; filename="hourly-emissions-national-aggregation-${uuid()}"`
      const [sql, values] = this.repository.getNationalStreamQuery(params);
      
      const fieldMappingsList = params.exclude
      ? fieldMappings.emissions.hourly.data.aggregation.national.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.emissions.hourly.data.aggregation.national;
  
      const toDto = new Transform({
        objectMode: true,
        transform(data, _enc, callback) {
          const dto = plainToClass(
            HourlyApportionedEmissionsNationalAggregationDTO,
            data,
            {
              enableImplicitConversion: true,
            },
          );
          const date = new Date(dto.date);
          dto.date = date.toISOString().split('T')[0];
          callback(null, dto);
        },
      });

      return this.streamService.getStream(req, sql, values, toDto, disposition, fieldMappingsList);
  }
}
