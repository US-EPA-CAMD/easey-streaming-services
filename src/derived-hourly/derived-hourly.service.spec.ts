import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { DerivedHourlyRepository } from './derived-hourly.repository';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';

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
