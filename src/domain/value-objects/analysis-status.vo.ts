export enum AnalysisStatusEnum {
    IN_PROGRESS = 'in_progress',
    AT_RISK = 'at_risk',
    BLOCKED = 'blocked',
    ON_TRACK = 'on_track',
  }
  
  export class AnalysisStatus {
    private readonly value: AnalysisStatusEnum;
  
    constructor(value: AnalysisStatusEnum | string) {
      const validStatuses = Object.values(AnalysisStatusEnum);
      if (!validStatuses.includes(value as AnalysisStatusEnum)) {
        throw new Error(`Invalid analysis status: ${value}`);
      }
      this.value = value as AnalysisStatusEnum;
    }
  
    getValue(): AnalysisStatusEnum {
      return this.value;
    }
  
    equals(other: AnalysisStatus): boolean {
      return this.value === other.value;
    }
  }