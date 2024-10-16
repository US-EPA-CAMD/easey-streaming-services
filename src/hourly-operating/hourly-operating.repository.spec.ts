import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';
import { HrlyOpData } from '../entities/hrly-op-data.entity';
import { HourlyOperatingRepository } from './hourly-operating.repository';

const mockedQueryBuilder = {
  innerJoin: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getQueryAndParameters: jest.fn(),
};

describe('-- Hourly Operating Repository --', () => {
  let repo: HourlyOperatingRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EntityManager, HourlyOperatingRepository],
    }).compile();

    repo = module.get(HourlyOperatingRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('buildQuery', () => {
    it('Should build a streamable query to execute based on params', async () => {
      const params = new HourlyParamsDto();
      params.orisCode = [3];
      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockReturnValue(
          (mockedQueryBuilder as unknown) as SelectQueryBuilder<HrlyOpData>,
        ); //Mock query builder here
      repo.buildQuery(params);
      expect(mockedQueryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
