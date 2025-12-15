export class TaskId {
    private readonly value: string;
  
    constructor(value: string) {
      if (!value || value.trim().length === 0) {
        throw new Error('TaskId cannot be empty');
      }
      this.value = value;
    }
  
    toString(): string {
      return this.value;
    }
  
    equals(other: TaskId): boolean {
      return this.value === other.value;
    }
  }