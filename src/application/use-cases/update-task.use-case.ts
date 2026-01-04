import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Task } from '@domain/entities/task.entity';
import { TaskId } from '@domain/value-objects/task-id.vo';
import { TaskStatusEnum } from '@domain/value-objects/task-status.vo';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatusEnum | string;
  dueDate?: Date;
}

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(taskId: string, userId: string, input: UpdateTaskInput): Promise<Task> {
    const id = new TaskId(taskId);
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Validar que la tarea pertenece al usuario
    const taskUserId = task.getUserId().toString();
    if (taskUserId !== userId) {
      throw new ForbiddenException('You do not have permission to update this task');
    }

    if (input.title !== undefined) {
      task.updateTitle(input.title);
    }

    if (input.description !== undefined) {
      task.updateDescription(input.description);
    }

    if (input.status !== undefined) {
      task.changeStatus(input.status);
    }

    if (input.dueDate !== undefined) {
      task.updateDueDate(input.dueDate);
    }

    return await this.taskRepository.save(task);
  }
}