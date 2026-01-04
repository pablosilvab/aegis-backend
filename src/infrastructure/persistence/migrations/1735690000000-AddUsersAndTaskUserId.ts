import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersAndTaskUserId1735690000000 implements MigrationInterface {
  name = 'AddUsersAndTaskUserId1735690000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla users (si no existe)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL,
        "email" varchar(255) NOT NULL,
        "name" varchar(200) NOT NULL,
        "passwordHash" varchar(255),
        "googleId" varchar(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Crear índice único en email (si no existe)
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email")
    `);

    // Crear índice único en googleId (solo para valores no nulos)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE indexname = 'IDX_users_googleId'
        ) THEN
          CREATE UNIQUE INDEX "IDX_users_googleId" 
          ON "users" ("googleId") 
          WHERE "googleId" IS NOT NULL;
        END IF;
      END $$;
    `);

    // Agregar columna userId a tabla tasks (si no existe)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tasks' AND column_name = 'userId'
        ) THEN
          ALTER TABLE "tasks" 
          ADD COLUMN "userId" uuid;
        END IF;
      END $$;
    `);

    // Crear foreign key constraint de tasks a users (si no existe)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'FK_tasks_userId'
        ) THEN
          ALTER TABLE "tasks" 
          ADD CONSTRAINT "FK_tasks_userId" 
          FOREIGN KEY ("userId") 
          REFERENCES "users"("id") 
          ON DELETE CASCADE 
          ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);

    // Hacer la columna userId NOT NULL después de crear la foreign key
    // Nota: Esto requiere que todas las tareas existentes tengan un userId válido
    // Por ahora la dejamos nullable para permitir datos existentes
    // Se puede hacer NOT NULL en una migración posterior después de migrar datos
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign key primero
    await queryRunner.query(`
      ALTER TABLE "tasks" 
      DROP CONSTRAINT IF EXISTS "FK_tasks_userId"
    `);

    // Eliminar columna userId de tasks
    await queryRunner.query(`
      ALTER TABLE "tasks" 
      DROP COLUMN IF EXISTS "userId"
    `);

    // Eliminar índices de users
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_users_googleId"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_users_email"
    `);

    // Eliminar tabla users
    await queryRunner.query(`
      DROP TABLE IF EXISTS "users"
    `);
  }
}

