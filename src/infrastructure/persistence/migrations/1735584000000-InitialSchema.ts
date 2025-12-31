import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1735584000000 implements MigrationInterface {
  name = 'InitialSchema1735584000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla tasks
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL,
        "title" varchar(200) NOT NULL,
        "description" text NOT NULL,
        "status" varchar(50) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "dueDate" TIMESTAMP,
        CONSTRAINT "PK_tasks" PRIMARY KEY ("id")
      )
    `);

    // Crear tabla task_events
    await queryRunner.query(`
      CREATE TABLE "task_events" (
        "id" uuid NOT NULL,
        "taskId" uuid NOT NULL,
        "type" varchar(50) NOT NULL,
        "content" text NOT NULL,
        "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
        "metadata" jsonb,
        CONSTRAINT "PK_task_events" PRIMARY KEY ("id")
      )
    `);

    // Crear foreign key para task_events
    await queryRunner.query(`
      ALTER TABLE "task_events" 
      ADD CONSTRAINT "FK_task_events_taskId" 
      FOREIGN KEY ("taskId") 
      REFERENCES "tasks"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);

    // Crear tabla task_analyses
    await queryRunner.query(`
      CREATE TABLE "task_analyses" (
        "id" uuid NOT NULL,
        "taskId" uuid NOT NULL,
        "status" varchar(50) NOT NULL,
        "confidenceLevel" integer NOT NULL,
        "reason" text NOT NULL,
        "recommendation" text NOT NULL,
        "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
        "rawResponse" text,
        CONSTRAINT "PK_task_analyses" PRIMARY KEY ("id")
      )
    `);

    // Crear foreign key para task_analyses
    await queryRunner.query(`
      ALTER TABLE "task_analyses" 
      ADD CONSTRAINT "FK_task_analyses_taskId" 
      FOREIGN KEY ("taskId") 
      REFERENCES "tasks"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign keys primero
    await queryRunner.query(`
      ALTER TABLE "task_analyses" 
      DROP CONSTRAINT IF EXISTS "FK_task_analyses_taskId"
    `);

    await queryRunner.query(`
      ALTER TABLE "task_events" 
      DROP CONSTRAINT IF EXISTS "FK_task_events_taskId"
    `);

    // Eliminar tablas
    await queryRunner.query(`DROP TABLE IF EXISTS "task_analyses"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_events"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
  }
}