import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { TaskEventEntity } from './entities/task-event.entity';
import { TaskAnalysisEntity } from './entities/task-analysis.entity';
import { UserEntity } from './entities/user.entity';
import { TaskRepository } from './repositories/task.repository';
import { TaskEventRepository } from './repositories/task-event.repository';
import { TaskAnalysisRepository } from './repositories/task-analysis.repository';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      TaskEventEntity,
      TaskAnalysisEntity,
      UserEntity,
    ]),
  ],
  providers: [
    TaskRepository,
    TaskEventRepository,
    TaskAnalysisRepository,
    UserRepository,
  ],
  exports: [
    TaskRepository,
    TaskEventRepository,
    TaskAnalysisRepository,
    UserRepository,
  ],
})
export class PersistenceModule {}