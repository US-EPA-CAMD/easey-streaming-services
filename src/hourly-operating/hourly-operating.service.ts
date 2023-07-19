import { Injectable, StreamableFile } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { StreamingService } from '../streaming/streaming.service';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { HourlyOperatingDTO } from '../dto/hourly-op.dto';

@Injectable()
export class HourlyOperatingService {
  constructor(
    @InjectRepository(HourlyOperatingRepository)
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
        delete data.id;
        const dto = plainToClass(HourlyOperatingDTO, data, {
          enableImplicitConversion: false,
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
