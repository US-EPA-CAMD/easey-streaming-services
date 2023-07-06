import { Test } from '@nestjs/testing';
import { SummaryValueController } from './summary-value.controller';
import { SummaryValueService } from './summary-value.service';
import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';

describe('-- Summary Value Controller --', () => {
  let controller: SummaryValueController;
  let service: SummaryValueService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SummaryValueController],
      providers: [
        {
          provide: SummaryValueService,
          useFactory: () => ({ streamSummaryValues: jest.fn() }),
        },
      ],
    }).compile();

    controller = module.get(SummaryValueController);
    service = module.get(SummaryValueService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('summaryValueStream', () => {
    it('Should call the service stream function', () => {
      controller.summaryValueStream(null, new OrisQuarterParamsDto());
      expect(service.streamSummaryValues).toHaveBeenCalled();
    });
  });
});
