import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { StreamAllowanceComplianceParamsDTO } from '../dto/allowance-compliance.params.dto';
import { AccountComplianceDimRepository } from './account-compliance-dim.repository';

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

describe('-- AccountComplianceDimRepository --', () => {
  let repository: AccountComplianceDimRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccountComplianceDimRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(AccountComplianceDimRepository);
    queryBuilder = module.get(SelectQueryBuilder);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getQueryAndParameters.mockReturnValue(
      'mockAllowanceCompliance',
    );
  });

  describe('buildQuery', () => {
    it('builds allowance compliance query', async () => {
      const result = await repository.buildQuery(
        new StreamAllowanceComplianceParamsDTO(),
      );

      expect(result).toEqual('mockAllowanceCompliance');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
