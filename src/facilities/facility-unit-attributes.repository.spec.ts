import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { StreamFacilityAttributesParamsDTO } from '../dto/facility-attributes-params.dto';
import { FacilityUnitAttributesRepository } from './facility-unit-attributes.repository';
import { FacilityUnitAttributes } from '../entities/vw-facility-unit-attributes.entity';

const mockQueryBuilder = () => ({
  andWhere: jest.fn(),
  select: jest.fn(),
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

describe('FacilityUnitAttributesRepository', () => {
  let facilityUnitAttributesRepository: FacilityUnitAttributesRepository;
  let queryBuilder: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FacilityUnitAttributesRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    facilityUnitAttributesRepository = module.get(
      FacilityUnitAttributesRepository,
    );
    queryBuilder = module.get(SelectQueryBuilder);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();

    facilityUnitAttributesRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.getQueryAndParameters.mockReturnValue(
      'mockFacilityAttributes',
    );
  });

  describe('buildQuery', () => {
    it('builds facility unit attributes query', async () => {
      const result = await facilityUnitAttributesRepository.buildQuery(
        new StreamFacilityAttributesParamsDTO(),
      );
      expect(result).toEqual('mockFacilityAttributes');
      expect(queryBuilder.getQueryAndParameters).toHaveBeenCalled();
    });
  });

  describe('lastArchivedYear', () => {
    it('returns the last archived year', async () => {
      const archivedYear = [{ year: 2016 }];
      facilityUnitAttributesRepository.query = jest
        .fn()
        .mockReturnValue(archivedYear);
      const year = await facilityUnitAttributesRepository.lastArchivedYear();
      expect(facilityUnitAttributesRepository.query).toHaveBeenCalled();
      expect(year).toEqual(2016);
    });
  });
});
