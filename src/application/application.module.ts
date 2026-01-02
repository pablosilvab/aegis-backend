import { Module } from '@nestjs/common';
import { PersistenceModule } from '@infrastructure/persistence/persistence.module';
import { ExternalModule } from '@infrastructure/external/external.module';
import { TaskRepository } from '@infrastructure/persistence/repositories/task.repository';
import { TaskEventRepository } from '@infrastructure/persistence/repositories/task-event.repository';
import { TaskAnalysisRepository } from '@infrastructure/persistence/repositories/task-analysis.repository';
import { UserRepository } from '@infrastructure/persistence/repositories/user.repository';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { GetTaskByIdUseCase } from './use-cases/get-task-by-id.use-case';
import { ListTasksUseCase } from './use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { RegisterTaskEventUseCase } from './use-cases/register-task-event.use-case';
import { GetTaskEventsUseCase } from './use-cases/get-task-events.use-case';
import { AnalyzeTaskUseCase } from './use-cases/analyze-task.use-case';
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case';

@Module({
  imports: [PersistenceModule, ExternalModule],
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
    {
      provide: 'ITaskAnalysisRepository',
      useExisting: TaskAnalysisRepository,
    },
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
    // Casos de uso
    CreateTaskUseCase,
    GetTaskByIdUseCase,
    ListTasksUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    RegisterTaskEventUseCase,
    GetTaskEventsUseCase,
    AnalyzeTaskUseCase,
  ],
  exports: [
    CreateTaskUseCase,
    GetTaskByIdUseCase,
    ListTasksUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    RegisterTaskEventUseCase,
    GetTaskEventsUseCase,
    AnalyzeTaskUseCase,
    // Exportar repositorios para que estén disponibles en PresentationModule
    {
      provide: 'ITaskAnalysisRepository',
      useExisting: TaskAnalysisRepository,
    },
  ],
})
export class ApplicationModule {}