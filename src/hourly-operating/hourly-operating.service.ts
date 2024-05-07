import { Injectable, StreamableFile } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform } from 'stream';
import { v4 as uuid } from 'uuid';

import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { HourlyOperatingDTO } from '../dto/hourly-op.dto';
import { StreamingService } from '../streaming/streaming.service';
import { HourlyOperatingRepository } from './hourly-operating.repository';

@Injectable()
export class HourlyOperatingService {
  constructor(
    private readonly repository: HourlyOperatingRepository,
    private readonly streamingService: StreamingService,
  ) {}

  async streamValues(
    req: Request,
    params: HourlyParamsDto,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="hourly-operating-${uuid()}`;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(HourlyOperatingDTO, data, {
          enableImplicitConversion: true,
        });
        callback(null, dto);
      },
    });

    const [sql, values] = await this.repository.buildQuery(params);

    return this.streamingService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      [],
    );
  }
}
