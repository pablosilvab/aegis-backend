import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Task } from '@domain/entities/task.entity';
import { TaskStatusEnum } from '@domain/value-objects/task-status.vo';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';
import { IUserRepository } from '@domain/interfaces/user.repository.interface';
import { UserId } from '@domain/value-objects/user-id.vo';
import { randomUUID } from 'crypto';

export interface CreateTaskInput {
  userId: string;
  title: string;
  description: string;
  dueDate?: Date;
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    // Validar que el usuario existe
    const userId = new UserId(input.userId);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${input.userId} not found`);
    }

    const taskId = randomUUID();
    const task = Task.create(
      taskId,
      input.userId,
      input.title,
      input.description,
      input.dueDate,
    );

    return await this.taskRepository.save(task);
  }
}