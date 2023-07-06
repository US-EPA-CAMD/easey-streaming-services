import { Test } from '@nestjs/testing';
import { SummaryValueService } from './summary-value.service';
import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';
import { StreamingService } from '../streaming/streaming.service';
import { SummaryValueRepository } from './summary-value.repository';

describe('-- Summary Value Service --', () => {
  let service: SummaryValueService;
  let streamingService: StreamingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SummaryValueService,
        {
          provide: StreamingService,
          useFactory: () => ({
            getStream: jest.fn(),
          }),
        },
        {
          provide: SummaryValueRepository,
          useFactory: () => ({
            buildQuery: jest.fn().mockResolvedValue(['', '']),
          }),
        },
      ],
    }).compile();

    service = module.get(SummaryValueService);
    streamingService = module.get(StreamingService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('streamSummaryValues', () => {
    it('Should call the repo build query and return a StreamableFile from StreamingService', async () => {
      await service.streamSummaryValues(null, new OrisQuarterParamsDto());
      expect(streamingService.getStream).toHaveBeenCalled();
    });
  });
});
