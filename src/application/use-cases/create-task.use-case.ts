import { Injectable, Inject } from '@nestjs/common';
import { Task } from '@domain/entities/task.entity';
import { TaskStatusEnum } from '@domain/value-objects/task-status.vo';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';
import { randomUUID } from 'crypto';

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate?: Date;
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const taskId = randomUUID();
    const task = Task.create(
      taskId,
      input.title,
      input.description,
      input.dueDate,
    );

    return await this.taskRepository.save(task);
  }
}