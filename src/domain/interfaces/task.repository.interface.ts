import { Task } from '../entities/task.entity';
import { TaskId } from '../value-objects/task-id.vo';
import { UserId } from '../value-objects/user-id.vo';

export interface ITaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: TaskId): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  findByUserId(userId: UserId): Promise<Task[]>;
  delete(id: TaskId): Promise<void>;
}