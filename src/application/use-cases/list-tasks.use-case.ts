import { Injectable, Inject } from '@nestjs/common';
import { Task } from '@domain/entities/task.entity';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';
import { UserId } from '@domain/value-objects/user-id.vo';

@Injectable()
export class ListTasksUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(userId: string): Promise<Task[]> {
    const userIdVo = new UserId(userId);
    return await this.taskRepository.findByUserId(userIdVo);
  }
}