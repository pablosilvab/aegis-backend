import { TaskId } from '../value-objects/task-id.vo';
import { AnalysisStatus, AnalysisStatusEnum } from '../value-objects/analysis-status.vo';
import { ConfidenceLevel } from '../value-objects/confidence-level.vo';

export class TaskAnalysis {
  private constructor(
    private readonly id: string,
    private readonly taskId: TaskId,
    private readonly status: AnalysisStatus,
    private readonly confidenceLevel: ConfidenceLevel,
    private readonly reason: string,
    private readonly recommendation: string,
    private readonly timestamp: Date,
    private readonly rawResponse?: string,
  ) {
    this.validate();
  }

  static create(
    id: string,
    taskId: string,
    status: AnalysisStatusEnum | string,
    confidenceLevel: number,
    reason: string,
    recommendation: string,
    rawResponse?: string,
  ): TaskAnalysis {
    return new TaskAnalysis(
      id,
      new TaskId(taskId),
      new AnalysisStatus(status),
      new ConfidenceLevel(confidenceLevel),
      reason,
      recommendation,
      new Date(),
      rawResponse,
    );
  }

  static fromPersistence(
    id: string,
    taskId: string,
    status: string,
    confidenceLevel: number,
    reason: string,
    recommendation: string,
    timestamp: Date,
    rawResponse?: string,
  ): TaskAnalysis {
    return new TaskAnalysis(
      id,
      new TaskId(taskId),
      new AnalysisStatus(status),
      new ConfidenceLevel(confidenceLevel),
      reason,
      recommendation,
      timestamp,
      rawResponse,
    );
  }

  private validate(): void {
    if (!this.reason || this.reason.trim().length === 0) {
      throw new Error('Analysis reason cannot be empty');
    }
    if (!this.recommendation || this.recommendation.trim().length === 0) {
      throw new Error('Analysis recommendation cannot be empty');
    }
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getTaskId(): TaskId {
    return this.taskId;
  }

  getStatus(): AnalysisStatus {
    return this.status;
  }

  getConfidenceLevel(): ConfidenceLevel {
    return this.confidenceLevel;
  }

  getReason(): string {
    return this.reason;
  }

  getRecommendation(): string {
    return this.recommendation;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  getRawResponse(): string | undefined {
    return this.rawResponse;
  }
}