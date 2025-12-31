import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'pass',
  database: process.env.DB_NAME || 'mydb',
  entities: [
    path.join(__dirname, 'src/infrastructure/persistence/entities/**/*.entity{.ts,.js}'),
  ],
  migrations: [
    path.join(__dirname, 'src/infrastructure/persistence/migrations/**/*{.ts,.js}'),
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});