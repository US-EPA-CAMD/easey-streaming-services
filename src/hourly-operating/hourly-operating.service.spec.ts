import { Test } from '@nestjs/testing';
import { HourlyOperatingService } from './hourly-operating.service';
import { StreamingService } from '../streaming/streaming.service';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';

describe('-- Hourly Operating Service --', () => {
  let service: HourlyOperatingService;
  let streamingService: StreamingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourlyOperatingService,
        {
          provide: StreamingService,
          useFactory: () => ({
            getStream: jest.fn(),
          }),
        },
        {
          provide: HourlyOperatingRepository,
          useFactory: () => ({
            buildQuery: jest.fn().mockResolvedValue(['', '']),
          }),
        },
      ],
    }).compile();

    service = module.get(HourlyOperatingService);
    streamingService = module.get(StreamingService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('streamValues', () => {
    it('Should call the repo build query and return a StreamableFile from StreamingService', async () => {
      await service.streamValues(null, new HourlyParamsDto());
      expect(streamingService.getStream).toHaveBeenCalled();
    });
  });
});
