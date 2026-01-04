import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Task } from '@domain/entities/task.entity';
import { TaskId } from '@domain/value-objects/task-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';

@Injectable()
export class GetTaskByIdUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(taskId: string, userId: string): Promise<Task> {
    const id = new TaskId(taskId);
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Validar que la tarea pertenece al usuario
    const taskUserId = task.getUserId().toString();
    if (taskUserId !== userId) {
      throw new ForbiddenException('You do not have permission to access this task');
    }

    return task;
  }
}