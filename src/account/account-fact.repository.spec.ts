import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { AccountFactRepository } from './account-fact.repository';
import { AccountFact } from '../entities/account-fact.entity';
import { StreamAccountAttributesParamsDTO } from '../dto/account-attributes.params.dto';

const mockQueryBuilder = () => ({
  select: jest.fn(),
  andWhere: jest.fn(),
  innerJoin: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  getQueryAndParameters: jest.fn(),
});

describe('AccountFactRepository', () => {
  let accountFactRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccountFactRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    accountFactRepository = module.get<AccountFactRepository>(
      AccountFactRepository,
    );

    queryBuilder = module.get<SelectQueryBuilder<AccountFact>>(
      SelectQueryBuilder,
    );

    accountFactRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getQueryAndParameters.mockReturnValue('mockAccount');
  });

  describe('buildQuery', () => {
    it('builds account attributes query', async () => {
      const result = await accountFactRepository.buildQuery(
        new StreamAccountAttributesParamsDTO(),
      );

      expect(result).toEqual('mockAccount');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
