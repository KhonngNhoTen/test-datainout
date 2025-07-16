import { DataSource } from 'typeorm';
require('dotenv').config();

export const AppDataSource = new DataSource({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  entities: ['dist/src/entities/**.entity{.ts,.js}'],
  migrations: ['src/migrations/**{.ts,.js}'],
  type: 'postgres',
});
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
