import {
    Controller,
    Get,
    Post,
    Param,
    HttpCode,
    HttpStatus,
    Inject,
  } from '@nestjs/common';
  import { AnalyzeTaskUseCase } from '@application/use-cases/analyze-task.use-case';
  import { ITaskAnalysisRepository } from '@domain/interfaces/task-analysis.repository.interface';
  import { TaskId } from '@domain/value-objects/task-id.vo';
  
  @Controller('tasks/:taskId/analysis')
  export class TaskAnalysisController {
    constructor(
      private readonly analyzeTaskUseCase: AnalyzeTaskUseCase,
      @Inject('ITaskAnalysisRepository')
      private readonly taskAnalysisRepository: ITaskAnalysisRepository,
    ) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Param('taskId') taskId: string) {
      const analysis = await this.analyzeTaskUseCase.execute(taskId);
  
      return {
        id: analysis.getId(),
        taskId: analysis.getTaskId().toString(),
        status: analysis.getStatus().getValue(),
        confidenceLevel: analysis.getConfidenceLevel().getValue(),
        reason: analysis.getReason(),
        recommendation: analysis.getRecommendation(),
        timestamp: analysis.getTimestamp(),
      };
    }
  
    @Get('latest')
    async getLatest(@Param('taskId') taskId: string) {
      const taskIdVO = new TaskId(taskId);
      const analysis = await this.taskAnalysisRepository.findLatestByTaskId(
        taskIdVO,
      );
  
      if (!analysis) {
        return {
          message: 'No hay análisis disponible para esta tarea',
          taskId,
        };
      }
  
      return {
        id: analysis.getId(),
        taskId: analysis.getTaskId().toString(),
        status: analysis.getStatus().getValue(),
        confidenceLevel: analysis.getConfidenceLevel().getValue(),
        reason: analysis.getReason(),
        recommendation: analysis.getRecommendation(),
        timestamp: analysis.getTimestamp(),
      };
    }
  
    @Get('history')
    async getHistory(@Param('taskId') taskId: string) {
      const taskIdVO = new TaskId(taskId);
      const analyses = await this.taskAnalysisRepository.findByTaskId(taskIdVO);
  
      return analyses.map((analysis) => ({
        id: analysis.getId(),
        taskId: analysis.getTaskId().toString(),
        status: analysis.getStatus().getValue(),
        confidenceLevel: analysis.getConfidenceLevel().getValue(),
        reason: analysis.getReason(),
        recommendation: analysis.getRecommendation(),
        timestamp: analysis.getTimestamp(),
      }));
    }
  }