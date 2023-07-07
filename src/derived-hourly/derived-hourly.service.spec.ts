import { Test } from '@nestjs/testing';
import { DerivedHourlyService } from './derived-hourly.service';
import { StreamingService } from '../streaming/streaming.service';
import { DerivedHourlyRepository } from './derived-hourly.repository';
import { DerivedHourlyValueParamsDto } from '../dto/derived-hourly-value.params.dto';

describe('-- Derived Hourly Value Service --', () => {
  let service: DerivedHourlyService;
  let streamingService: StreamingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DerivedHourlyService,
        {
          provide: StreamingService,
          useFactory: () => ({
            getStream: jest.fn(),
          }),
        },
        {
          provide: DerivedHourlyRepository,
          useFactory: () => ({
            buildQuery: jest.fn().mockResolvedValue(['', '']),
          }),
        },
      ],
    }).compile();

    service = module.get(DerivedHourlyService);
    streamingService = module.get(StreamingService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('streamValues', () => {
    it('Should call the repo build query and return a StreamableFile from StreamingService', async () => {
      await service.streamValues(null, new DerivedHourlyValueParamsDto());
      expect(streamingService.getStream).toHaveBeenCalled();
    });
  });
});
