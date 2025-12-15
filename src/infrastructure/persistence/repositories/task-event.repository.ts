import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEvent } from '@domain/entities/task-event.entity';
import { TaskId } from '@domain/value-objects/task-id.vo';
import { ITaskEventRepository } from '@domain/interfaces/task-event.repository.interface';
import { TaskEventEntity } from '../entities/task-event.entity';

@Injectable()
export class TaskEventRepository implements ITaskEventRepository {
  constructor(
    @InjectRepository(TaskEventEntity)
    private readonly typeOrmRepository: Repository<TaskEventEntity>,
  ) {}

  async save(event: TaskEvent): Promise<TaskEvent> {
    const entity = this.toEntity(event);
    const saved = await this.typeOrmRepository.save(entity);
    return this.toDomain(saved);
  }

  async findByTaskId(taskId: TaskId): Promise<TaskEvent[]> {
    const entities = await this.typeOrmRepository.find({
      where: { taskId: taskId.toString() },
      order: { timestamp: 'ASC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<TaskEvent | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { id },
    });
    return entity ? this.toDomain(entity) : null;
  }

  private toEntity(event: TaskEvent): TaskEventEntity {
    const entity = new TaskEventEntity();
    entity.id = event.getId();
    entity.taskId = event.getTaskId().toString();
    entity.type = event.getType().getValue();
    entity.content = event.getContent();
    entity.timestamp = event.getTimestamp();
    entity.metadata = event.getMetadata();
    return entity;
  }

  private toDomain(entity: TaskEventEntity): TaskEvent {
    return TaskEvent.fromPersistence(
      entity.id,
      entity.taskId,
      entity.type,
      entity.content,
      entity.timestamp,
      entity.metadata,
    );
  }
}