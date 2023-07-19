import { Test } from '@nestjs/testing';
import { HourlyOperatingController } from './hourly-operating.controller';
import { HourlyOperatingService } from './hourly-operating.service';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';

describe('-- Hourly Operating Controller --', () => {
  let controller: HourlyOperatingController;
  let service: HourlyOperatingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HourlyOperatingController],
      providers: [
        {
          provide: HourlyOperatingService,
          useFactory: () => ({ streamValues: jest.fn() }),
        },
      ],
    }).compile();

    controller = module.get(HourlyOperatingController);
    service = module.get(HourlyOperatingService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('hourlyOperatingStream', () => {
    it('Should call the service stream function', () => {
      controller.hourlyOperatingStream(null, new HourlyParamsDto());
      expect(service.streamValues).toHaveBeenCalled();
    });
  });
});
