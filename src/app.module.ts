import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiModule } from './api.module';
import { AppController } from './app.controller';

const dbPort: any = process.env.DB_PORT || 5432;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: 'localhost',
      port: dbPort,
      username: 'postgres',
      password: 'postgres',
      database: 'nest_blog',
      synchronize: true,
      dropSchema: false,
      logging: true,
      entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
      migrations: ['src/migration/*.js'],
    }),
    ApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
