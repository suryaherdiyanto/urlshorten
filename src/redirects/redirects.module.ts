import { Module } from '@nestjs/common';
import { RedirectsService } from './redirects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redirect } from './entities/redirects.entity';

@Module({
  providers: [RedirectsService],
  imports: [
    TypeOrmModule.forFeature([Redirect])
  ],
  exports: [RedirectsService]
})
export class RedirectsModule {}
