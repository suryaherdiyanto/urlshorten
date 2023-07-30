import { Module } from '@nestjs/common';
import { RedirectsService } from './redirects.service';

@Module({
  providers: [RedirectsService]
})
export class RedirectsModule {}
