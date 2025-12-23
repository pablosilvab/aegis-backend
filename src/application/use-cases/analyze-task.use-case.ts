import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TaskAnalysis } from '@domain/entities/task-analysis.entity';
import { TaskId } from '@domain/value-objects/task-id.vo';
import { ITaskRepository } from '@domain/interfaces/task.repository.interface';
import { ITaskEventRepository } from '@domain/interfaces/task-event.repository.interface';
import { ITaskAnalysisRepository } from '@domain/interfaces/task-analysis.repository.interface';
import {
  IAnalysisService,
  AnalysisInput,
} from '@domain/interfaces/analysis-service.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class AnalyzeTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository,
    @Inject('ITaskEventRepository')
    private readonly taskEventRepository: ITaskEventRepository,
    @Inject('ITaskAnalysisRepository')
    private readonly taskAnalysisRepository: ITaskAnalysisRepository,
    @Inject('IAnalysisService')
    private readonly analysisService: IAnalysisService,
  ) {}

  async execute(taskId: string): Promise<TaskAnalysis> {
    const id = new TaskId(taskId);
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Obtener eventos de la tarea
    const events = await this.taskEventRepository.findByTaskId(id);

    // NUEVO: Obtener análisis anteriores de esta tarea (para RAG)
    const previousAnalyses = await this.taskAnalysisRepository.findByTaskId(id);
    // Ordenar por timestamp descendente y tomar los últimos 3
    const recentAnalyses = previousAnalyses
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime())
      .slice(0, 3)
      .map((analysis) => ({
        status: analysis.getStatus().getValue(),
        confidenceLevel: analysis.getConfidenceLevel().getValue(),
        reason: analysis.getReason(),
        recommendation: analysis.getRecommendation(),
        timestamp: analysis.getTimestamp(),
      }));

    // Construir input para el análisis
    const analysisInput: AnalysisInput = {
      taskTitle: task.getTitle(),
      taskDescription: task.getDescription(),
      taskStatus: task.getStatus().getValue(),
      taskDueDate: task.getDueDate(),
      events: events.map((event) => ({
        type: event.getType().getValue(),
        content: event.getContent(),
        timestamp: event.getTimestamp(),
        metadata: event.getMetadata(),
      })),
      // NUEVO: incluir análisis anteriores
      previousAnalyses: recentAnalyses.length > 0 ? recentAnalyses : undefined,
    };

    // Llamar al servicio de análisis
    const analysisResult = await this.analysisService.analyze(analysisInput);

    // Crear entidad de análisis
    const analysisId = randomUUID();
    const analysis = TaskAnalysis.create(
      analysisId,
      taskId,
      analysisResult.status,
      analysisResult.confidenceLevel,
      analysisResult.reason,
      analysisResult.recommendation,
      JSON.stringify(analysisResult), // Guardar respuesta raw para auditoría
    );

    // Persistir análisis
    return await this.taskAnalysisRepository.save(analysis);
  }
}