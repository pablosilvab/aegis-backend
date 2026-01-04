import {
    Controller,
    Get,
    Post,
    Param,
    HttpCode,
    HttpStatus,
    Inject,
    NotFoundException,
    ForbiddenException,
  } from '@nestjs/common';
  import { AnalyzeTaskUseCase } from '@application/use-cases/analyze-task.use-case';
  import { ITaskAnalysisRepository } from '@domain/interfaces/task-analysis.repository.interface';
  import { ITaskRepository } from '@domain/interfaces/task.repository.interface';
  import { TaskId } from '@domain/value-objects/task-id.vo';
  import { CurrentUser } from '../../auth/decorators/current-user.decorator';
  
  @Controller('tasks/:taskId/analysis')
  export class TaskAnalysisController {
    constructor(
      private readonly analyzeTaskUseCase: AnalyzeTaskUseCase,
      @Inject('ITaskAnalysisRepository')
      private readonly taskAnalysisRepository: ITaskAnalysisRepository,
      @Inject('ITaskRepository')
      private readonly taskRepository: ITaskRepository,
    ) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Param('taskId') taskId: string,
      @CurrentUser() user: { userId: string; email: string },
    ) {
      const analysis = await this.analyzeTaskUseCase.execute(taskId, user.userId);
  
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
    async getLatest(
      @Param('taskId') taskId: string,
      @CurrentUser() user: { userId: string; email: string },
    ) {
      // Validar ownership antes de obtener el análisis
      const taskIdVO = new TaskId(taskId);
      const task = await this.taskRepository.findById(taskIdVO);
      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }
      const taskUserId = task.getUserId().toString();
      if (taskUserId !== user.userId) {
        throw new ForbiddenException('You do not have permission to view this analysis');
      }

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
    async getHistory(
      @Param('taskId') taskId: string,
      @CurrentUser() user: { userId: string; email: string },
    ) {
      // Validar ownership antes de obtener el historial
      const taskIdVO = new TaskId(taskId);
      const task = await this.taskRepository.findById(taskIdVO);
      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }
      const taskUserId = task.getUserId().toString();
      if (taskUserId !== user.userId) {
        throw new ForbiddenException('You do not have permission to view this analysis history');
      }

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