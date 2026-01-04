import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './infrastructure/persistence/database.config';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { ApplicationModule } from './application/application.module';
import { PresentationModule } from './presentation/presentation.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    PersistenceModule,
    ApplicationModule,
    PresentationModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}