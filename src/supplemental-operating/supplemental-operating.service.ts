import { Injectable, StreamableFile } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform } from 'stream';
import { v4 as uuid } from 'uuid';

import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';
import { SupplementalOperatingDTO } from '../dto/supplemental-operating.dto';
import { StreamingService } from '../streaming/streaming.service';
import { SupplementalOperatingRepository } from './supplemental-operating.repository';

@Injectable()
export class SupplementalOperatingService {
  constructor(
    private readonly repository: SupplementalOperatingRepository,
    private readonly streamingService: StreamingService,
  ) {}

  async streamValues(
    req: Request,
    params: OrisQuarterParamsDto,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="supplemental-operating-${uuid()}`;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(SupplementalOperatingDTO, data, {
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
