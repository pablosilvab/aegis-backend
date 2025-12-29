import { TaskAnalysis } from '../entities/task-analysis.entity';
import { TaskId } from '../value-objects/task-id.vo';

export interface ITaskAnalysisRepository {
  save(analysis: TaskAnalysis): Promise<TaskAnalysis>;
  findByTaskId(taskId: TaskId): Promise<TaskAnalysis[]>;
  findLatestByTaskId(taskId: TaskId): Promise<TaskAnalysis | null>;
  findById(id: string): Promise<TaskAnalysis | null>;
  deleteByTaskId(taskId: TaskId): Promise<void>;
}