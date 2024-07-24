import { Test } from '@nestjs/testing';
//import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { DerivedHourlyService } from './derived-hourly.service';
import { StreamingService } from '../streaming/streaming.service';
import { DerivedHourlyRepository } from './derived-hourly.repository';
//import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';

describe('-- Derived Hourly Value Service --', () => {
  let service: DerivedHourlyService;
  let streamingService: StreamingService;
  let repository: DerivedHourlyRepository;

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
    repository = module.get(DerivedHourlyRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('streamValues', () => {
    it('Should call the repo build query and return a StreamableFile from StreamingService', async () => {
      const params = new HourlyParamsDto();
      await service.streamValues(null, params);
      expect(repository.buildQuery).toHaveBeenCalledWith(params);
      expect(streamingService.getStream).toHaveBeenCalled();
    });
  });
});


/* The previous code in this file before adding above code.
describe('-- Derived Hourly Value Repository --', () => {
  let repo: DerivedHourlyRepository;
  let mockedQueryBuilder: jest.Mocked<SelectQueryBuilder<DerivedHrlyValue>>;

  beforeEach(async () => {
    mockedQueryBuilder = {
      innerJoin: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getQueryAndParameters: jest.fn().mockReturnValue(['query', []]),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        DerivedHourlyRepository,
        {
          provide: EntityManager,
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockedQueryBuilder),
          },
        },
      ],
    }).compile();

    repo = module.get<DerivedHourlyRepository>(DerivedHourlyRepository);
  });

  describe('buildQuery', () => {
    it('Should build a streamable query to execute based on params', async () => {
      const params = new HourlyParamsDto();
      params.orisCode = [3];

      await repo.buildQuery(params);

      expect(mockedQueryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
*/
