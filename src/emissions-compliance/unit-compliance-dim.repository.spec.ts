import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { StreamEmissionsComplianceParamsDTO } from '../dto/emissions-compliance.params.dto';
import { UnitComplianceDimRepository } from './unit-compliance-dim.repository';

const mockQueryBuilder = () => ({
  andWhere: jest.fn(),
  getMany: jest.fn(),
  getRawMany: jest.fn(),
  getManyAndCount: jest.fn(),
  select: jest.fn(),
  leftJoin: jest.fn(),
  innerJoin: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  getCount: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  distinctOn: jest.fn(),
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
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.distinctOn.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue('mockEmissionsCompliance');
    queryBuilder.getRawMany.mockReturnValue('mockRawEmissionsCompliance');
    queryBuilder.getManyAndCount.mockReturnValue([
      'mockEmissionsCompliance',
      0,
    ]);
    queryBuilder.take.mockReturnValue('mockPagination');
    queryBuilder.getCount.mockReturnValue('mockCount');
    queryBuilder.stream.mockReturnValue('mockStream');
    queryBuilder.getQueryAndParameters.mockReturnValue('');
  });

  describe('streamEmissionsCompliance', () => {
    it('streams all emissions compliance data', async () => {
      const result = unitComplianceDimRepository.buildQuery(
        new StreamEmissionsComplianceParamsDTO(),
      );
      expect(result).toEqual('');
    });
  });
});
