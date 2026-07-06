import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { ControlTechnology } from '@us-epa-camd/easey-common/enums';

import { StreamFacilityAttributesParamsDTO } from '../dto/facility-attributes-params.dto';
import { FacilityUnitAttributesRepository } from './facility-unit-attributes.repository';

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
        EntityManager,
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

  describe('buildQuery — control-technology SQL composition', () => {
    const findControlTechClause = (): string | undefined =>
      queryBuilder.andWhere.mock.calls
        .map((call: any[]) => call[0])
        .find(
          (arg: any) =>
            typeof arg === 'string' && arg.includes('so2ControlInfo'),
        );

    it('emits pipe-delimited regex for a single control-tech filter and never comma-delimited', async () => {
      const filters = new StreamFacilityAttributesParamsDTO();
      filters.controlTechnologies = [
        ControlTechnology.SELECTIVE_NON_CATALYTIC,
      ];

      await facilityUnitAttributesRepository.buildQuery(filters);

      const clause = findControlTechClause();
      expect(clause).toBeDefined();
      expect(clause).toContain('[|]');
      expect(clause).not.toContain('[,]');
    });

    it('emits pipe-delimited alternation for every value in a multi-select union', async () => {
      const filters = new StreamFacilityAttributesParamsDTO();
      filters.controlTechnologies = [
        ControlTechnology.SELECTIVE_NON_CATALYTIC,
        ControlTechnology.SELECTIVE_CATALYTIC,
      ];

      await facilityUnitAttributesRepository.buildQuery(filters);

      const clause = findControlTechClause();
      expect(clause).toBeDefined();
      expect(clause).toContain('SELECTIVE NON-CATALYTIC REDUCTION');
      expect(clause).toContain('SELECTIVE CATALYTIC REDUCTION');
      expect(clause).toContain('[|]');
      expect(clause).not.toContain('[,]');
      const trimmed = clause!.trim();
      expect(trimmed.startsWith('(')).toBe(true);
      expect(trimmed.endsWith(')')).toBe(true);
      expect(clause).toContain(' OR ');
    });

    it('does not emit a control-tech clause when the filter is absent', async () => {
      await facilityUnitAttributesRepository.buildQuery(
        new StreamFacilityAttributesParamsDTO(),
      );

      expect(findControlTechClause()).toBeUndefined();
    });

    it('references all four control info columns in the emitted clause', async () => {
      const filters = new StreamFacilityAttributesParamsDTO();
      filters.controlTechnologies = [
        ControlTechnology.SELECTIVE_NON_CATALYTIC,
      ];

      await facilityUnitAttributesRepository.buildQuery(filters);

      const clause = findControlTechClause();
      expect(clause).toBeDefined();
      expect(clause).toContain('fua.so2ControlInfo');
      expect(clause).toContain('fua.noxControlInfo');
      expect(clause).toContain('fua.pmControlInfo');
      expect(clause).toContain('fua.hgControlInfo');
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
