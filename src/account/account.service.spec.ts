import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AccountFactRepository } from './account-fact.repository';
import { AccountService } from './account.service';
import { StreamAccountAttributesParamsDTO } from '../dto/account-attributes.params.dto';
import { StreamableFile } from '@nestjs/common';
import { StreamingService } from '../streaming/streaming.service';

const mockAccountFactRepository = () => ({
  getAllAccounts: jest.fn(),
  getAllAccountAttributes: jest.fn(),
  getAllApplicableAccountAttributes: jest.fn(),
  getStreamQuery: jest.fn(),});

const mockAccountMap = () => ({
  many: jest.fn(),
});

const mockStream = {
  pipe: jest.fn().mockReturnValue({
    pipe: jest.fn().mockReturnValue(Buffer.from('stream')),
  }),
};

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
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
    headers: {
      accept: 'text/csv',
    },
    on: jest.fn(),
  };
};

let req: any;

describe('-- Account Service --', () => {
  let accountService;
  let accountFactRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AccountService,
        {
          provide: AccountFactRepository,
          useFactory: mockAccountFactRepository,
        },
        {
          provide: StreamingService,
          useFactory: () => ({
            getStream: () => {
              return mockStream;
            },
          }),
        },
      ],
    }).compile();

    accountService = module.get(AccountService);
    accountFactRepository = module.get(AccountFactRepository);
    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('streamAccountAttributes', () => {
    it('streams all account attributes', async () => {
      accountFactRepository.buildQuery.mockResolvedValue('');

      let filters = new StreamAccountAttributesParamsDTO();

      req.headers.accept = '';

      let result = await accountService.streamAllAccountAttributes(
        req,
        filters,
      );

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="account-attributes-${0}.json"`,
        }),
      );
    });
  });
});
