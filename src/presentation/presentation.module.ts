import { Module } from '@nestjs/common';
import { ApplicationModule } from '@application/application.module';
import { TasksController } from './controllers/tasks-controller';
import { TaskEventsController } from './controllers/task-events.controller';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [TasksController, TaskEventsController, HealthController],
})
export class PresentationModule {}