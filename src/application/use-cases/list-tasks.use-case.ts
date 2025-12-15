import { Injectable, Inject } from '@nestjs/common';
import { Task } from '@domain/entities/task.entity';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';

@Injectable()
export class ListTasksUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(): Promise<Task[]> {
    return await this.taskRepository.findAll();
  }
}