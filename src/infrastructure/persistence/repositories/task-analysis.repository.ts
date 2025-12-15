import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskAnalysis } from '@domain/entities/task-analysis.entity';
import { TaskId } from '@domain/value-objects/task-id.vo';
import { ITaskAnalysisRepository } from '@domain/interfaces/task-analysis.repository.interface';
import { TaskAnalysisEntity } from '../entities/task-analysis.entity';

@Injectable()
export class TaskAnalysisRepository implements ITaskAnalysisRepository {
  constructor(
    @InjectRepository(TaskAnalysisEntity)
    private readonly typeOrmRepository: Repository<TaskAnalysisEntity>,
  ) {}

  async save(analysis: TaskAnalysis): Promise<TaskAnalysis> {
    const entity = this.toEntity(analysis);
    const saved = await this.typeOrmRepository.save(entity);
    return this.toDomain(saved);
  }

  async findByTaskId(taskId: TaskId): Promise<TaskAnalysis[]> {
    const entities = await this.typeOrmRepository.find({
      where: { taskId: taskId.toString() },
      order: { timestamp: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findLatestByTaskId(taskId: TaskId): Promise<TaskAnalysis | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { taskId: taskId.toString() },
      order: { timestamp: 'DESC' },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findById(id: string): Promise<TaskAnalysis | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { id },
    });
    return entity ? this.toDomain(entity) : null;
  }

  private toEntity(analysis: TaskAnalysis): TaskAnalysisEntity {
    const entity = new TaskAnalysisEntity();
    entity.id = analysis.getId();
    entity.taskId = analysis.getTaskId().toString();
    entity.status = analysis.getStatus().getValue();
    entity.confidenceLevel = analysis.getConfidenceLevel().getValue();
    entity.reason = analysis.getReason();
    entity.recommendation = analysis.getRecommendation();
    entity.timestamp = analysis.getTimestamp();
    entity.rawResponse = analysis.getRawResponse();
    return entity;
  }

  private toDomain(entity: TaskAnalysisEntity): TaskAnalysis {
    return TaskAnalysis.fromPersistence(
      entity.id,
      entity.taskId,
      entity.status,
      entity.confidenceLevel,
      entity.reason,
      entity.recommendation,
      entity.timestamp,
      entity.rawResponse,
    );
  }
}