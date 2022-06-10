import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { StreamEmissionsComplianceParamsDTO } from '../dto/emissions-compliance.params.dto';
import { UnitComplianceDimRepository } from './unit-compliance-dim.repository';

const mockQueryBuilder = () => ({
  andWhere: jest.fn(),
  select: jest.fn(),
  leftJoin: jest.fn(),
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

describe('-- UnitComplianceDimRepository --', () => {
  let unitComplianceDimRepository: UnitComplianceDimRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UnitComplianceDimRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    unitComplianceDimRepository = module.get(UnitComplianceDimRepository);
    queryBuilder = module.get(SelectQueryBuilder);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();

    unitComplianceDimRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getQueryAndParameters.mockReturnValue(
      'mockEmissionsCompliance',
    );
  });

  describe('buildQuery', () => {
    it('builds emissions compliance query', async () => {
      const result = await unitComplianceDimRepository.buildQuery(
        new StreamEmissionsComplianceParamsDTO(),
      );

      expect(result).toEqual('mockEmissionsCompliance');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });
});
