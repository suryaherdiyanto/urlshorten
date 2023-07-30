import { Test, TestingModule } from '@nestjs/testing';
import { RedirectsService } from './redirects.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Redirect } from './entities/redirects.entity';
import { RedirectsModule } from './redirects.module';
import { Repository } from 'typeorm';

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
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });
  it('repository should be defired', () => {
    expect(repository).toBeDefined();
  });

  describe('findByReferrer', function() {

  });
});
