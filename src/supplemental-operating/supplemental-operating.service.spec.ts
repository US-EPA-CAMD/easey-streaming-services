import { Test } from '@nestjs/testing';
import { SupplementalOperatingService } from './supplemental-operating.service';
import { StreamingService } from '../streaming/streaming.service';
import { SupplementalOperatingRepository } from './supplemental-operating.repository';
import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';

describe('-- Supplemental Operating Service --', () => {
  let service: SupplementalOperatingService;
  let streamingService: StreamingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SupplementalOperatingService,
        {
          provide: StreamingService,
          useFactory: () => ({
            getStream: jest.fn(),
          }),
        },
        {
          provide: SupplementalOperatingRepository,
          useFactory: () => ({
            buildQuery: jest.fn().mockResolvedValue(['', '']),
          }),
        },
      ],
    }).compile();

    service = module.get(SupplementalOperatingService);
    streamingService = module.get(StreamingService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('streamSummaryValues', () => {
    it('Should call the repo build query and return a StreamableFile from StreamingService', async () => {
      await service.streamValues(null, new OrisQuarterParamsDto());
      expect(streamingService.getStream).toHaveBeenCalled();
    });
  });
});
