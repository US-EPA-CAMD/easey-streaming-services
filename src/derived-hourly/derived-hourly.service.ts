import { Injectable, StreamableFile } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { StreamingService } from '../streaming/streaming.service';
import { DerivedHourlyRepository } from './derived-hourly.repository';
import { DerivedHourlyValueParamsDto } from '../dto/derived-hourly-value.params.dto';
import { DerivedHourlyValueBaseDTO } from '../dto/derived-hourly-value.dto';

@Injectable()
export class DerivedHourlyService {
  constructor(
    @InjectRepository(DerivedHourlyRepository)
    private readonly repository: DerivedHourlyRepository,
    private readonly streamingService: StreamingService,
  ) {}

  async streamValues(
    req: Request,
    params: DerivedHourlyValueParamsDto,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="derived-hourly-${uuid()}`;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        delete data.id;
        const dto = plainToClass(DerivedHourlyValueBaseDTO, data, {
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
