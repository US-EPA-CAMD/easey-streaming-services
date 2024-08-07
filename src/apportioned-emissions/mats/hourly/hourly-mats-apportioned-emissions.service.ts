import { Injectable, StreamableFile } from '@nestjs/common';
import { ExcludeHourlyMatsApportionedEmissions } from '@us-epa-camd/easey-common/enums';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform } from 'stream';
import { v4 as uuid } from 'uuid';

import { fieldMappings } from '../../../constants/emissions-field-mappings';
import { StreamHourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { HourlyMatsApportionedEmissionsDTO } from '../../../dto/hourly-mats-apportioned-emissions.dto';
import { StreamingService } from '../../../streaming/streaming.service';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';

@Injectable()
export class HourlyMatsApportionedEmissionsService {
  constructor(
    private readonly repository: HourUnitMatsDataRepository,
    private readonly logger: Logger,
    private readonly streamService: StreamingService,
  ) {}

  async streamEmissions(
    req: Request,
    params: StreamHourlyMatsApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="hourly-mats-emissions-${uuid()}`;

    const fieldMappingsList = params.exclude
      ? fieldMappings.emissions.mats.hourly.data.aggregation.unit.filter(
          item => !params.exclude.includes(item.value),
        )
      : fieldMappings.emissions.mats.hourly.data.aggregation.unit;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeHourlyMatsApportionedEmissions);
        const dto = plainToClass(HourlyMatsApportionedEmissionsDTO, data, {
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
}
