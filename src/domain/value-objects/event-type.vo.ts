export enum EventTypeEnum {
    COMMENT = 'comment',
    STATUS_CHANGE = 'status_change',
    DATE_UPDATE = 'date_update',
    ASSIGNMENT = 'assignment',
    OTHER = 'other',
  }
  
  export class EventType {
    private readonly value: EventTypeEnum;
  
    constructor(value: EventTypeEnum | string) {
      const validTypes = Object.values(EventTypeEnum);
      if (!validTypes.includes(value as EventTypeEnum)) {
        throw new Error(`Invalid event type: ${value}`);
      }
      this.value = value as EventTypeEnum;
    }
  
    getValue(): EventTypeEnum {
      return this.value;
    }
  
    equals(other: EventType): boolean {
      return this.value === other.value;
    }
  }