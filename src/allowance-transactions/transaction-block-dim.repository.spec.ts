import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { StreamAllowanceTransactionsParamsDTO } from '../dto/allowance-transactions.params.dto';
import { TransactionBlockDimRepository } from './transaction-block-dim.repository';

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

describe('-- TransactionBlockDimRepository --', () => {
  let transactionBlockDimRepository: TransactionBlockDimRepository;
  let queryBuilder: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionBlockDimRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    transactionBlockDimRepository = module.get(TransactionBlockDimRepository);
    queryBuilder = module.get(SelectQueryBuilder);

    transactionBlockDimRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getQueryAndParameters.mockReturnValue(
      'mockAllowanceTransactions',
    );
  });

  describe('buildQuery', () => {
    it('builds allowance transactions query', async () => {
      const result = await transactionBlockDimRepository.buildQuery(
        new StreamAllowanceTransactionsParamsDTO(),
      );

      expect(result).toEqual('mockAllowanceTransactions');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
