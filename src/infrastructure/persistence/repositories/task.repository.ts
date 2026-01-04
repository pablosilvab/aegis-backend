import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@domain/entities/task.entity';
import { TaskId } from '@domain/value-objects/task-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';
import { TaskEntity } from '../entities/task.entity';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly typeOrmRepository: Repository<TaskEntity>,
  ) {}

  async save(task: Task): Promise<Task> {
    const entity = this.toEntity(task);
    const saved = await this.typeOrmRepository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: TaskId): Promise<Task | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { id: id.toString() },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Task[]> {
    const entities = await this.typeOrmRepository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByUserId(userId: UserId): Promise<Task[]> {
    const entities = await this.typeOrmRepository.find({
      where: { userId: userId.toString() },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: TaskId): Promise<void> {
    await this.typeOrmRepository.delete(id.toString());
  }

  private toEntity(task: Task): TaskEntity {
    const entity = new TaskEntity();
    entity.id = task.getId().toString();
    entity.userId = task.getUserId().toString();
    entity.title = task.getTitle();
    entity.description = task.getDescription();
    entity.status = task.getStatus().getValue();
    entity.createdAt = task.getCreatedAt();
    entity.updatedAt = task.getUpdatedAt();
    entity.dueDate = task.getDueDate();
    return entity;
  }

  private toDomain(entity: TaskEntity): Task {
    return Task.fromPersistence(
      entity.id,
      entity.userId,
      entity.title,
      entity.description,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
      entity.dueDate,
    );
  }
}