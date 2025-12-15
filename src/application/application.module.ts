import { Module } from '@nestjs/common';
import { PersistenceModule } from '@infrastructure/persistence/persistence.module';
import { TaskRepository } from '@infrastructure/persistence/repositories/task.repository';
import { TaskEventRepository } from '@infrastructure/persistence/repositories/task-event.repository';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { GetTaskByIdUseCase } from './use-cases/get-task-by-id.use-case';
import { ListTasksUseCase } from './use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { RegisterTaskEventUseCase } from './use-cases/register-task-event.use-case';
import { GetTaskEventsUseCase } from './use-cases/get-task-events.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [
    // Repositorios como providers con tokens usando useExisting
    {
      provide: 'ITaskRepository',
      useExisting: TaskRepository,
    },
    {
      provide: 'ITaskEventRepository',
      useExisting: TaskEventRepository,
    },
    // Casos de uso
    CreateTaskUseCase,
    GetTaskByIdUseCase,
    ListTasksUseCase,
    UpdateTaskUseCase,
    RegisterTaskEventUseCase,
    GetTaskEventsUseCase,
  ],
  exports: [
    CreateTaskUseCase,
    GetTaskByIdUseCase,
    ListTasksUseCase,
    UpdateTaskUseCase,
    RegisterTaskEventUseCase,
    GetTaskEventsUseCase,
  ],
})
export class ApplicationModule {}