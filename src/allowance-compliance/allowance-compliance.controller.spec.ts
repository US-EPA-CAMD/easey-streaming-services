import { StreamableFile } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { StreamAllowanceComplianceParamsDTO } from '../dto/allowance-compliance.params.dto';
import { StreamingModule } from '../streaming/streaming.module';
import { AccountComplianceDimRepository } from './account-compliance-dim.repository';
import { AllowanceComplianceController } from './allowance-compliance.controller';
import { AllowanceComplianceService } from './allowance-compliance.service';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Allowance Compliance Controller --', () => {
  let allowanceComplianceController: AllowanceComplianceController;
  let allowanceComplianceService: AllowanceComplianceService;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [AllowanceComplianceController],
      providers: [
        AllowanceComplianceService,
        AccountComplianceDimRepository,
        EntityManager,
      ],
    }).compile();

    allowanceComplianceController = module.get(AllowanceComplianceController);
    allowanceComplianceService = module.get(AllowanceComplianceService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamAllowanceCompliance', () => {
    it('should call the service and return all allowance compliance data', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDTO = new StreamAllowanceComplianceParamsDTO();
      jest
        .spyOn(allowanceComplianceService, 'streamAllowanceCompliance')
        .mockResolvedValue(expectedResult);
      expect(
        await allowanceComplianceService.streamAllowanceCompliance(
          req,
          paramsDTO,
        ),
      ).toBe(expectedResult);
    });
  });
});
