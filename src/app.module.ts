import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedirectsModule } from './redirects/redirects.module';
import { VerifyCsrf } from './middleware/verify-csrf.middleware';
import { typeOrmDatabase } from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true
    }),
    typeOrmDatabase(),
    RedirectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyCsrf).forRoutes({ path: '*', method: RequestMethod.POST });
  }
}
