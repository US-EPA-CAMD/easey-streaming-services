import { Test } from '@nestjs/testing';
import { SupplementalOperatingController } from './supplemental-operating.controller';
import { SupplementalOperatingService } from './supplemental-operating.service';
import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';

describe('-- Summary Value Controller --', () => {
  let controller: SupplementalOperatingController;
  let service: SupplementalOperatingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SupplementalOperatingController],
      providers: [
        {
          provide: SupplementalOperatingService,
          useFactory: () => ({ streamValues: jest.fn() }),
        },
      ],
    }).compile();

    controller = module.get(SupplementalOperatingController);
    service = module.get(SupplementalOperatingService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('supplementalOperatingStream', () => {
    it('Should call the service stream function', () => {
      controller.supplementalOperatingStream(null, new OrisQuarterParamsDto());
      expect(service.streamValues).toHaveBeenCalled();
    });
  });
});
