import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TaskEvent } from '@domain/entities/task-event.entity';
import { TaskId } from '@domain/value-objects/task-id.vo';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';
import { ITaskEventRepository } from '@domain/interfaces/task-event.repository.interface';

@Injectable()
export class GetTaskEventsUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
    @Inject('ITaskEventRepository')
    private readonly taskEventRepository: ITaskEventRepository,
  ) {}

  async execute(taskId: string): Promise<TaskEvent[]> {
    const id = new TaskId(taskId);
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return await this.taskEventRepository.findByTaskId(id);
  }
}