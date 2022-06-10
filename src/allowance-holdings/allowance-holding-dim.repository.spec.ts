import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { StreamAllowanceHoldingsParamsDTO } from '../dto/allowance-holdings.params.dto';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';

const mockQueryBuilder = () => ({
  andWhere: jest.fn(),
  select: jest.fn(),
  innerJoin: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  getQueryAndParameters: jest.fn(),
});

describe('-- AllowanceHoldingDimRepository --', () => {
  let allowanceHoldingDimRepository: AllowanceHoldingDimRepository;
  let queryBuilder: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AllowanceHoldingDimRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    allowanceHoldingDimRepository = module.get(AllowanceHoldingDimRepository);
    queryBuilder = module.get(SelectQueryBuilder);

    allowanceHoldingDimRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getQueryAndParameters.mockReturnValue('mockAllowanceHoldings');
  });

  describe('buildQuery', () => {
    it('builds allowance holdings query', async () => {
      const result = await allowanceHoldingDimRepository.buildQuery(
        new StreamAllowanceHoldingsParamsDTO(),
      );
      expect(result).toEqual('mockAllowanceHoldings');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
