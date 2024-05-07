import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';
import { SummaryValue } from '../entities/summary-value.entity';
import { SummaryValueRepository } from './summary-value.repository';

const mockedQueryBuilder = {
  innerJoin: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  getQueryAndParameters: jest.fn(),
};

describe('-- Summary Value Repository --', () => {
  let repo: SummaryValueRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EntityManager, SummaryValueRepository],
    }).compile();

    repo = module.get(SummaryValueRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('buildQuery', () => {
    it('Should build a streamable query to execute based on params', async () => {
      const params = new OrisQuarterParamsDto();
      params.orisCode = [3];
      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockReturnValue(
          (mockedQueryBuilder as unknown) as SelectQueryBuilder<SummaryValue>,
        ); //Mock query builder here
      repo.buildQuery(params);
      expect(mockedQueryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
