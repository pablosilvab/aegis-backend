import { TaskId } from '../value-objects/task-id.vo';
import { EventType, EventTypeEnum } from '../value-objects/event-type.vo';

export class TaskEvent {
  private constructor(
    private readonly id: string,
    private readonly taskId: TaskId,
    private readonly type: EventType,
    private readonly content: string,
    private readonly timestamp: Date,
    private readonly metadata?: Record<string, unknown>,
  ) {
    this.validate();
  }

  static create(
    id: string,
    taskId: string,
    type: EventTypeEnum | string,
    content: string,
    metadata?: Record<string, unknown>,
  ): TaskEvent {
    return new TaskEvent(
      id,
      new TaskId(taskId),
      new EventType(type),
      content,
      new Date(),
      metadata,
    );
  }

  static fromPersistence(
    id: string,
    taskId: string,
    type: string,
    content: string,
    timestamp: Date,
    metadata?: Record<string, unknown>,
  ): TaskEvent {
    return new TaskEvent(
      id,
      new TaskId(taskId),
      new EventType(type),
      content,
      timestamp,
      metadata,
    );
  }

  private validate(): void {
    if (!this.content || this.content.trim().length === 0) {
      throw new Error('Event content cannot be empty');
    }
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getTaskId(): TaskId {
    return this.taskId;
  }

  getType(): EventType {
    return this.type;
  }

  getContent(): string {
    return this.content;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  getMetadata(): Record<string, unknown> | undefined {
    return this.metadata;
  }
}