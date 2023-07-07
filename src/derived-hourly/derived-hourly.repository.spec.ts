import { Test } from '@nestjs/testing';
import { DerivedHourlyRepository } from './derived-hourly.repository';
import { SelectQueryBuilder } from 'typeorm';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';
import { DerivedHourlyValueParamsDto } from '../dto/derived-hourly-value.params.dto';

const mockedQueryBuilder = {
  innerJoin: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  getQueryAndParameters: jest.fn(),
};

describe('-- Derived Hourly Value Repository --', () => {
  let repo: DerivedHourlyRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DerivedHourlyRepository],
    }).compile();

    repo = module.get(DerivedHourlyRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('buildQuery', () => {
    it('Should build a streamable query to execute based on params', async () => {
      const params = new DerivedHourlyValueParamsDto();
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
