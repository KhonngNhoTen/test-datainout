import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
require('dotenv').config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      type: 'postgres',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    }),
    UserModule,
  ],
})
export class AppModule {}
