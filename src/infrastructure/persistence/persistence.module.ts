import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { TaskEventEntity } from './entities/task-event.entity';
import { TaskAnalysisEntity } from './entities/task-analysis.entity';
import { TaskRepository } from './repositories/task.repository';
import { TaskEventRepository } from './repositories/task-event.repository';
import { TaskAnalysisRepository } from './repositories/task-analysis.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      TaskEventEntity,
      TaskAnalysisEntity,
    ]),
  ],
  providers: [
    TaskRepository,
    TaskEventRepository,
    TaskAnalysisRepository,
  ],
  exports: [
    TaskRepository,
    TaskEventRepository,
    TaskAnalysisRepository,
  ],
})
export class PersistenceModule {}