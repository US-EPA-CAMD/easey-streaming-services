import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { StreamAllowanceTransactionsParamsDTO } from '../dto/allowance-transactions.params.dto';
import { TransactionBlockDimRepository } from './transaction-block-dim.repository';

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  getMany: jest.fn(),
  getRawMany: jest.fn(),
  getManyAndCount: jest.fn(),
  select: jest.fn(),
  innerJoin: jest.fn(),
  leftJoin: jest.fn(),
  distinctOn: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  getCount: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  stream: jest.fn(),
  getQueryAndParameters: jest.fn(),
});

const mockRequest = (url?: string, page?: number, perPage?: number) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
    query: {
      page,
      perPage,
    },
  };
};

describe('-- TransactionBlockDimRepository --', () => {
  let transactionBlockDimRepository: TransactionBlockDimRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionBlockDimRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    transactionBlockDimRepository = module.get(TransactionBlockDimRepository);
    queryBuilder = module.get(SelectQueryBuilder);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();

    transactionBlockDimRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.distinctOn.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue('mockAllowanceTransactions');
    queryBuilder.getRawMany.mockReturnValue('mockRawAllowanceTransactions');
    queryBuilder.getManyAndCount.mockReturnValue([
      'mockAllowanceTransactions',
      0,
    ]);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getCount.mockReturnValue('mockCount');
    queryBuilder.stream.mockReturnValue('mockStream');
    queryBuilder.getQueryAndParameters.mockReturnValue('');
  });

  describe('streamAllowanceTransactions', () => {
    it('streams all allowance transactions', async () => {
      const result = await transactionBlockDimRepository.buildQuery(
        new StreamAllowanceTransactionsParamsDTO(),
      );

      expect(result).toEqual('');
    });
  });
});
