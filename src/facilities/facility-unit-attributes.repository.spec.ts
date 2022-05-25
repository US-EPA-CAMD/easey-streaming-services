import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { StreamFacilityAttributesParamsDTO } from '../dto/facility-attributes-params.dto';
import { FacilityUnitAttributesRepository } from './facility-unit-attributes.repository';
import { FacilityUnitAttributes } from '../entities/vw-facility-unit-attributes.entity';

const mockQueryBuilder = () => ({
  andWhere: jest.fn(),
  getMany: jest.fn(),
  select: jest.fn(),
  orderBy: jest.fn(),
  addOrderBy: jest.fn(),
  getCount: jest.fn(),
  skip: jest.fn(),
  take: jest.fn(),
  stream: jest.fn(),
  getQueryAndParameters: jest.fn(),
});

describe('FacilityUnitAttributesRepository', () => {
  let facilityUnitAttributesRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FacilityUnitAttributesRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    facilityUnitAttributesRepository = module.get<
      FacilityUnitAttributesRepository
    >(FacilityUnitAttributesRepository);
    queryBuilder = module.get<SelectQueryBuilder<FacilityUnitAttributes>>(
      SelectQueryBuilder,
    );

    facilityUnitAttributesRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
    queryBuilder.skip.mockReturnValue(queryBuilder);
    queryBuilder.stream.mockReturnValue('mockStream');
    queryBuilder.getQueryAndParameters.mockReturnValue('');
  });

  describe('buildQuery', () => {
    it('builds facility unit attributes query', async () => {
      const result = await facilityUnitAttributesRepository.buildQuery(
        new StreamFacilityAttributesParamsDTO(),
      );

      expect(result).toEqual('');
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