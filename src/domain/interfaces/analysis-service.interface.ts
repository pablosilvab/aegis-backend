export interface AnalysisInput {
    taskTitle: string;
    taskDescription: string;
    taskStatus: string;
    taskDueDate?: Date;
    events: Array<{
      type: string;
      content: string;
      timestamp: Date;
      metadata?: Record<string, unknown>;
    }>;
    
    previousAnalyses?: Array<{
      status: string;
      confidenceLevel: number;
      reason: string;
      recommendation: string;
      timestamp: Date;
    }>;
  }
  
  export interface AnalysisOutput {
    status: string;
    confidenceLevel: number;
    reason: string;
    recommendation: string;
  }
  
  export interface IAnalysisService {
    analyze(input: AnalysisInput): Promise<AnalysisOutput>;
  }