import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedirectsModule } from './redirects/redirects.module';

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
        }
      }
    }),
    RedirectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
