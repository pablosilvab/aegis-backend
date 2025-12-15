export class ConfidenceLevel {
    private readonly value: number; // 0-100
  
    constructor(value: number) {
      if (value < 0 || value > 100) {
        throw new Error('Confidence level must be between 0 and 100');
      }
      this.value = Math.round(value);
    }
  
    getValue(): number {
      return this.value;
    }
  
    isHigh(): boolean {
      return this.value >= 70;
    }
  
    isMedium(): boolean {
      return this.value >= 40 && this.value < 70;
    }
  
    isLow(): boolean {
      return this.value < 40;
    }
  }