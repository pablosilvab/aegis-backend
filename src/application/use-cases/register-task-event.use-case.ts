import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskEvent } from '@domain/entities/task-event.entity';
import { EventTypeEnum } from '@domain/value-objects/event-type.vo';
import { TaskId } from '@domain/value-objects/task-id.vo';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';
import { ITaskEventRepository } from '@domain/interfaces/task-event.repository.interface';
import { randomUUID } from 'crypto';

export interface RegisterTaskEventInput {
  taskId: string;
  type: EventTypeEnum | string;
  content: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class RegisterTaskEventUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
    @Inject('ITaskEventRepository')
    private readonly taskEventRepository: ITaskEventRepository,
  ) {}

  async execute(input: RegisterTaskEventInput, userId: string): Promise<TaskEvent> {
    const taskId = new TaskId(input.taskId);
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${input.taskId} not found`);
    }

    // Validar que la tarea pertenece al usuario
    const taskUserId = task.getUserId().toString();
    if (taskUserId !== userId) {
      throw new ForbiddenException('You do not have permission to create events for this task');
    }

    const eventId = randomUUID();
    const event = TaskEvent.create(
      eventId,
      input.taskId,
      input.type,
      input.content,
      input.metadata,
    );

    return await this.taskEventRepository.save(event);
  }
}