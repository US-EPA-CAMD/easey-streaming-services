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
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsDTO } from '../../dto/monthly-apportioned-emissions.dto';
import { MonthlyApportionedEmissionsParamsDTO, StreamMonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsFacilityAggregationDTO } from 'src/dto/monthly-apportioned-emissions-facility-aggregation.dto';
import { MonthlyApportionedEmissionsStateAggregationDTO } from 'src/dto/monthly-apportioned-emissions-state-aggregation.dto';
import { MonthlyApportionedEmissionsNationalAggregationDTO } from 'src/dto/monthly-apportioned-emissions-national-aggregation.dto';

@Injectable()
export class MonthlyApportionedEmissionsService {
  
  constructor(
    private readonly logger: Logger,
    private readonly streamService: StreamingService,
    @InjectRepository(MonthUnitDataRepository)
    private readonly repository: MonthUnitDataRepository,
  ) {}

  async streamEmissions(
    req: Request,
    params: StreamMonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="monthly-emissions-${uuid()}`;

    const fieldMappingsList = params.exclude
      ? fieldMappings.emissions.monthly.data.aggregation.unit.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.emissions.monthly.data.aggregation.unit;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeApportionedEmissions);
        const dto = plainToClass(MonthlyApportionedEmissionsDTO, data, {
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
    params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {

    const disposition = `attachment; filename="monthly-emissions-facility-aggregation-${uuid()}"`
    const [sql, values] = this.repository.buildFacilityAggregationQuery(params);
    
    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          MonthlyApportionedEmissionsFacilityAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
        callback(null, dto);
      },
    });

    const fieldMappingsList = fieldMappings.emissions.monthly.data.aggregation.facility;

    return this.streamService.getStream(req, sql, values, toDto, disposition, fieldMappingsList)

  }

  async streamEmissionsStateAggregation(
    req: Request,
    params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {

    const disposition = `attachment; filename="monthly-emissions-state-aggregation-${uuid()}"`;

    const [sql, values] = this.repository.buildStateAggregationQuery(params);

    const fieldMappingsList = fieldMappings.emissions.hourly.data.aggregation.state;

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          MonthlyApportionedEmissionsStateAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
        callback(null, dto);
      },
    });

    return this.streamService.getStream(req, sql, values, toDto, disposition, fieldMappingsList);

  }

  async streamEmissionsNationalAggregation(
    req: Request,
    params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {

    const disposition = `attachment; filename="monthly-emissions-national-aggregation-${uuid()}"`
    const [sql, values] = this.repository.buildNationalAggregationQuery(params);

    const fieldMappingsList = fieldMappings.emissions.hourly.data.aggregation.national;

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          MonthlyApportionedEmissionsNationalAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
        callback(null, dto);
      },
    });

    return this.streamService.getStream(req, sql, values, toDto, disposition, fieldMappingsList);
  }
}
