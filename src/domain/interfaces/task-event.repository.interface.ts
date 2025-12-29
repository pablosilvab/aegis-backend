import { TaskEvent } from '../entities/task-event.entity';
import { TaskId } from '../value-objects/task-id.vo';

export interface ITaskEventRepository {
  save(event: TaskEvent): Promise<TaskEvent>;
  findByTaskId(taskId: TaskId): Promise<TaskEvent[]>;
  findById(id: string): Promise<TaskEvent | null>;
  deleteByTaskId(taskId: TaskId): Promise<void>;
}