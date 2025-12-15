export enum TaskStatusEnum {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    BLOCKED = 'blocked',
    CANCELLED = 'cancelled',
  }
  
  export class TaskStatus {
    private readonly value: TaskStatusEnum;
  
    constructor(value: TaskStatusEnum | string) {
      const validStatuses = Object.values(TaskStatusEnum);
      if (!validStatuses.includes(value as TaskStatusEnum)) {
        throw new Error(`Invalid task status: ${value}`);
      }
      this.value = value as TaskStatusEnum;
    }
  
    getValue(): TaskStatusEnum {
      return this.value;
    }
  
    equals(other: TaskStatus): boolean {
      return this.value === other.value;
    }
  
    isBlocked(): boolean {
      return this.value === TaskStatusEnum.BLOCKED;
    }
  
    isCompleted(): boolean {
      return this.value === TaskStatusEnum.COMPLETED;
    }
  }