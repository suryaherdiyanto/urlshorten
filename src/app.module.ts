import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedirectsModule } from './redirects/redirects.module';
import { VerifyCsrf } from './middleware/verify-csrf.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DATABASE_NAME'),
          synchronize: true,
          dropSchema: (process.env.NODE_ENV === 'test') ? true:false,
          autoLoadEntities: true
        }
      }
    }),
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
