import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { StreamAllowanceHoldingsParamsDTO } from '../dto/allowance-holdings.params.dto';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';
import { AllowanceHoldingDim } from '../entities/allowance-holding-dim.entity';

const mockQueryBuilder = () => ({
  andWhere: jest.fn(),
  getMany: jest.fn(),
  getRawMany: jest.fn(),
  select: jest.fn(),
  innerJoin: jest.fn(),
  leftJoin: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  getCount: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  distinctOn: jest.fn(),
  stream: jest.fn(),
  getQueryAndParameters: jest.fn(),
});

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- AllowanceHoldingDimRepository --', () => {
  let allowanceHoldingDimRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AllowanceHoldingDimRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    allowanceHoldingDimRepository = module.get<AllowanceHoldingDimRepository>(
      AllowanceHoldingDimRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<AllowanceHoldingDim>>(
      SelectQueryBuilder,
    );

    allowanceHoldingDimRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.distinctOn.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue('mockAllowanceHoldings');
    queryBuilder.getRawMany.mockReturnValue('mockRawAllowanceHoldings');
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getCount.mockReturnValue('mockCount');
    queryBuilder.stream.mockReturnValue('mockStream');
    queryBuilder.getQueryAndParameters.mockReturnValue('');
  });

  describe('streamAllowanceHoldings', () => {
    it('streams allowance holdings', async () => {
      const result = allowanceHoldingDimRepository.buildQuery(
        new StreamAllowanceHoldingsParamsDTO(),
      );

      expect(result).toEqual('');
    });
  });
});
