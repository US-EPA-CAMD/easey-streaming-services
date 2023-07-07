import { Test } from '@nestjs/testing';
import { DerivedHourlyController } from './derived-hourly.controller';
import { DerivedHourlyService } from './derived-hourly.service';
import { DerivedHourlyValueParamsDto } from '../dto/derived-hourly-value.params.dto';

describe('-- Derived Hourly Value Controller --', () => {
  let controller: DerivedHourlyController;
  let service: DerivedHourlyService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [DerivedHourlyController],
      providers: [
        {
          provide: DerivedHourlyService,
          useFactory: () => ({ streamValues: jest.fn() }),
        },
      ],
    }).compile();

    controller = module.get(DerivedHourlyController);
    service = module.get(DerivedHourlyService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('derivedHourlyStream', () => {
    it('Should call the service stream function', () => {
      controller.derivedHourlyStream(null, new DerivedHourlyValueParamsDto());
      expect(service.streamValues).toHaveBeenCalled();
    });
  });
});
