import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PassThrough, Readable } from 'stream';
import { StreamableFile } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { StreamingService } from './streaming.service';

describe('-- Streaming Service --', () => {
  let service: StreamingService;
  let logger: { log: jest.Mock; error: jest.Mock };
  let dbClient: { query: jest.Mock; release: jest.Mock };
  let dbStream: Readable;

  const mockRequest = () => ({
    headers: { accept: 'application/json' },
    res: { setHeader: jest.fn() },
    on: jest.fn(),
  });

  // `dtoTransform` is supplied by the calling service; an
  // object-mode passthrough is enough to stand in for it here.
  const callGetStream = (req: any) =>
    service.getStream(
      req,
      'SELECT 1',
      [],
      new PassThrough({ objectMode: true }),
      'file',
      [],
    );

  beforeEach(async () => {
    dbStream = new Readable({ objectMode: true, read() {} });
    dbClient = {
      query: jest.fn().mockReturnValue(dbStream),
      release: jest.fn(),
    };
    logger = { log: jest.fn(), error: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        StreamingService,
        { provide: Logger, useValue: logger },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(20000) },
        },
        {
          provide: 'PG-POOL',
          useValue: { connect: jest.fn().mockResolvedValue(dbClient) },
        },
      ],
    }).compile();

    service = module.get(StreamingService);
  });

  afterEach(() => jest.resetAllMocks());

  it('returns a StreamableFile and sets the field-mappings header (happy path)', async () => {
    const req = mockRequest();

    const result = await callGetStream(req);

    expect(result).toBeInstanceOf(StreamableFile);
    expect(req.res.setHeader).toHaveBeenCalledWith(
      'X-Field-Mappings',
      expect.any(String),
    );
  });

  it('handles a DB stream error without crashing — logs it and releases the client', async () => {
    const req = mockRequest();
    await callGetStream(req);

    // Simulate a statement_timeout cancellation
    dbStream.emit(
      'error',
      new Error('canceling statement due to statement timeout'),
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Stream query failed'),
    );
    // Released exactly once even though the error also destroys the downstream pipe.
    expect(dbClient.release).toHaveBeenCalledTimes(1);
  });

  it('releases the client and logs completion when the stream ends', async () => {
    const req = mockRequest();
    const result = await callGetStream(req);

    const underlying: any = (result as StreamableFile).getStream();
    const ended = new Promise<void>((resolve) => {
      underlying.on('data', () => {});
      underlying.on('end', () => resolve());
    });

    dbStream.push(null); // end the source
    await ended;

    expect(logger.log).toHaveBeenCalledWith(
      expect.stringContaining('completed'),
    );
    expect(dbClient.release).toHaveBeenCalledTimes(1);
  });
});
