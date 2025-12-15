import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Task } from '@domain/entities/task.entity';
import { TaskId } from '@domain/value-objects/task-id.vo';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';

@Injectable()
export class GetTaskByIdUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(taskId: string): Promise<Task> {
    const id = new TaskId(taskId);
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return task;
  }
}