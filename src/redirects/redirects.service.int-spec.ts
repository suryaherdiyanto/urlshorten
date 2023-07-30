import { Test, TestingModule } from '@nestjs/testing';
import { RedirectsService } from './redirects.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Redirect } from './entities/redirects.entity';
import { RedirectsModule } from './redirects.module';
import { Repository } from 'typeorm';
import { CreateRedirectDto } from './dto/create-redirect.dto';

describe('RedirectsService', () => {
  let service: RedirectsService;
  let repository: Repository<Redirect>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          synchronize: true,
          dropSchema: true,
          database: ':memory:',
          entities: [Redirect]
        }),
        RedirectsModule
      ]
    }).compile();

    service = module.get<RedirectsService>(RedirectsService);
    repository = module.get(getRepositoryToken(Redirect));

    await repository.createQueryBuilder().insert().into(Redirect).values([{ referrer: 'qweRTy', full_url: 'https://www.facebook.com/john.doe'}]).execute();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });
  it('repository should be defired', () => {
    expect(repository).toBeDefined();
  });

  describe('findByReferrer', function() {
    it('should find record from database by the referrer and return the correct full_url', async function() {
      expect((await service.findByReferrer('qweRTy')).full_url).toEqual('https://www.facebook.com/john.doe');
    });
    it('should return null if we don\' find matched record', async function() {
      expect((await service.findByReferrer('dummy'))).toEqual(null);
    });
  });

  describe('create', function() {
    const dto: CreateRedirectDto = { full_url: 'https://www.youtube.com/john-doe' };
    it('should create a new record to database of Redirect entity', async function() {
      expect((await service.create(dto.full_url))).toEqual({
        id: expect.any(Number),
        full_url: dto.full_url,
        hit_counts: 0,
        referrer: expect.any(String)
      });
    });
  })
});
