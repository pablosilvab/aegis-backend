import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';
import { ITaskEventRepository } from '@domain/interfaces/task-event.repository.interface';
import { ITaskAnalysisRepository } from '@domain/interfaces/task-analysis.repository.interface';
import { TaskId } from '@domain/value-objects/task-id.vo';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
    @Inject('ITaskEventRepository')
    private readonly taskEventRepository: ITaskEventRepository,
    @Inject('ITaskAnalysisRepository')
    private readonly taskAnalysisRepository: ITaskAnalysisRepository,
  ) {}

  async execute(taskId: string): Promise<void> {
    const id = new TaskId(taskId);
    
    // Verificar que la tarea existe
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Eliminar eventos relacionados
    await this.taskEventRepository.deleteByTaskId(id);

    // Eliminar análisis relacionados
    await this.taskAnalysisRepository.deleteByTaskId(id);

    // Eliminar la tarea
    await this.taskRepository.delete(id);
  }
}

