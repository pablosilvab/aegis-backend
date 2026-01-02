import { TaskId } from '../value-objects/task-id.vo';
import { TaskStatus, TaskStatusEnum } from '../value-objects/task-status.vo';
import { UserId } from '../value-objects/user-id.vo';

export class Task {
  private constructor(
    private readonly id: TaskId,
    private readonly userId: UserId,
    private title: string,
    private description: string,
    private status: TaskStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private dueDate?: Date,
  ) {
    this.validate();
  }

  static create(
    id: string,
    userId: string,
    title: string,
    description: string,
    dueDate?: Date,
  ): Task {
    return new Task(
      new TaskId(id),
      new UserId(userId),
      title,
      description,
      new TaskStatus(TaskStatusEnum.PENDING),
      new Date(),
      new Date(),
      dueDate,
    );
  }

  static fromPersistence(
    id: string,
    userId: string,
    title: string,
    description: string,
    status: string,
    createdAt: Date,
    updatedAt: Date,
    dueDate?: Date,
  ): Task {
    return new Task(
      new TaskId(id),
      new UserId(userId),
      title,
      description,
      new TaskStatus(status),
      createdAt,
      updatedAt,
      dueDate,
    );
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Task title cannot be empty');
    }
    if (this.title.length > 200) {
      throw new Error('Task title cannot exceed 200 characters');
    }
  }

  // Getters
  getId(): TaskId {
    return this.id;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDueDate(): Date | undefined {
    return this.dueDate;
  }

  // Business logic
  updateTitle(title: string): void {
    this.title = title;
    this.validate();
    this.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  changeStatus(status: TaskStatusEnum | string): void {
    this.status = new TaskStatus(status);
    this.updatedAt = new Date();
  }

  updateDueDate(dueDate: Date): void {
    this.dueDate = dueDate;
    this.updatedAt = new Date();
  }

  isOverdue(): boolean {
    if (!this.dueDate) return false;
    return new Date() > this.dueDate && !this.status.isCompleted();
  }
}