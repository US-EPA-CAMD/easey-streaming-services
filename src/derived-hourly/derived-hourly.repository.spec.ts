import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { DerivedHourlyRepository } from './derived-hourly.repository';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';
import { HourlyParamsDto } from '../dto/derived-hourly-value.params.dto';

const mockedQueryBuilder = {
  innerJoin: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getQueryAndParameters: jest.fn(),
};

describe('-- Derived Hourly Value Repository --', () => {
  let repo: DerivedHourlyRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DerivedHourlyRepository, EntityManager],
    }).compile();

    repo = module.get(DerivedHourlyRepository);
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
          (mockedQueryBuilder as unknown) as SelectQueryBuilder<
            DerivedHrlyValue
          >,
        ); //Mock query builder here
      repo.buildQuery(params);
      expect(mockedQueryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
