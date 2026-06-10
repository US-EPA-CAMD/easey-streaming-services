import { Pool } from 'pg';
import { Request } from 'express';
import JSONStream from 'JSONStream';
import QueryStream from 'pg-query-stream';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, StreamableFile } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { Json2CSV } from '../transforms/json2csv.transform';

@Injectable()
export class StreamingService {
  private batchSize = this.configService.get<number>('app.streamBatchSize');

  constructor(
      private readonly logger: Logger,
      private readonly configService: ConfigService,
      @Inject('PG-POOL') private readonly dbPool: Pool,
  ) {}

  async getStream(
      req: Request,
      sql: string,
      params: any[],
      dtoTransform: any,
      disposition: string,
      fieldMappings: any[],
  ): Promise<StreamableFile> {
    const queryStream = new QueryStream(sql, params, {
      batchSize: this.batchSize,
    });

    const dbClient = await this.dbPool.connect();

    // Release the pooled client exactly once, regardless of how the stream ends.
    let released = false;
    const releaseClient = () => {
      if (released) return;
      released = true;
      dbClient.release();
      this.logger.log('Client Released');
    };

    const isCsv = req.headers.accept === 'text/csv';
    const finalTransform = isCsv
      ? new Json2CSV(fieldMappings)
      : JSONStream.stringify();

    const startTime = Date.now();
    const dbQueryStream = dbClient.query(queryStream);
    const outStream = dbQueryStream.pipe(dtoTransform).pipe(finalTransform);

    // A DB stream error (e.g. a statement_timeout cancellation) must be handled here.
    // log the error with how long it ran and the SQL, release the client, and propagate
    // the error to the response stream so only this request fails.
    let errored = false;
    const onStreamError = (err: Error) => {
      if (errored) return;
      errored = true;
      this.logger.error(
        `Stream query failed after ${Date.now() - startTime}ms: ` + `${err?.stack ?? err}. SQL: ${sql} -- params: ${JSON.stringify(params)}`,
      );
      releaseClient();
      if (!outStream.destroyed) {
        outStream.destroy(err);
      }
    };

    dbQueryStream.on('error', onStreamError);
    dtoTransform.on('error', onStreamError);
    finalTransform.on('error', onStreamError);

    // Release the client when the request is aborted or the stream finishes.
    req.on('close', releaseClient);
    outStream.on('close', releaseClient);
    outStream.on('end', () => {
      this.logger.log(`Stream query completed in ${Date.now() - startTime}ms`);
      releaseClient();
    });

    req.res.setHeader('X-Field-Mappings', JSON.stringify(fieldMappings));

    return new StreamableFile(outStream, {
      type: req.headers.accept,
      disposition: isCsv ? `${disposition}.csv` : `${disposition}.json`,
    });
  }
}
