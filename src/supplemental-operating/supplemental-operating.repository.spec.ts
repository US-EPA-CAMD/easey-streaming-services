import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';
import { SupplementalOperatingRepository } from './supplemental-operating.repository';
import { SupplementalOperating } from '../entities/supplemental-operating.entity';

const mockedQueryBuilder = {
  innerJoin: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getQueryAndParameters: jest.fn(),
};

describe('-- Supplemental Operating Repository --', () => {
  let repo: SupplementalOperatingRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EntityManager, SupplementalOperatingRepository],
    }).compile();

    repo = module.get(SupplementalOperatingRepository);
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
          (mockedQueryBuilder as unknown) as SelectQueryBuilder<
            SupplementalOperating
          >,
        ); //Mock query builder here
      repo.buildQuery(params);
      expect(mockedQueryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
