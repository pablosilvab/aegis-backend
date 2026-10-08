import { Injectable, Logger } from '@nestjs/common';
import Groq from 'groq-sdk';
import {
  IAnalysisService,
  AnalysisInput,
  AnalysisOutput,
} from '@domain/interfaces/analysis-service.interface';
import { getLLMConfig } from './llm.config';
import { PromptBuilder } from './prompt-builder';

@Injectable()
export class GroqAnalysisService implements IAnalysisService {
  private readonly logger = new Logger(GroqAnalysisService.name);
  private readonly client: Groq;
  private readonly config;

  constructor() {
    this.config = getLLMConfig();
    
    if (!this.config.apiKey) {
      this.logger.warn('LLM_API_KEY no configurada. El servicio de análisis no funcionará.');
    }

    this.client = new Groq({
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
    });
  }

  async analyze(input: AnalysisInput): Promise<AnalysisOutput> {
    if (!this.config.apiKey) {
      throw new Error('LLM_API_KEY no está configurada. Por favor configura tu API key de Groq.');
    }

    try {
      const prompt = PromptBuilder.buildAnalysisPrompt(input, this.config.enableFewShot !== false);
      
      // TEMPORAL: Log para verificar RAG
      if (input.previousAnalyses && input.previousAnalyses.length > 0) {
        this.logger.log(`🔍 RAG ACTIVO: Incluyendo ${input.previousAnalyses.length} análisis anteriores`);
        this.logger.debug('Prompt completo:', prompt.substring(0, 500) + '...'); // Primeros 500 chars
      } else {
        this.logger.log('⚠️ RAG NO ACTIVO: No hay análisis anteriores');
      }

      const response = await this.client.chat.completions.create(
        this.buildCompletionRequest(prompt),
      );

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from LLM');
      }

      const parsed = this.parseAndValidateResponse(content);
      return parsed;
    } catch (error) {
      this.logger.error('Error calling Groq API', error);
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new Error('API key de Groq inválida. Verifica LLM_API_KEY en tu .env');
      }
      
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        throw new Error('Límite de rate de Groq excedido. Intenta más tarde.');
      }

      throw new Error(`Análisis con LLM falló: ${error.message}`);
    }
  }

  /**
   * gpt-oss gasta tokens en razonar antes del JSON. Con json_object y el
   * esfuerzo por defecto, la generación visible llega vacía y Groq responde
   * json_validate_failed. El esquema estricto obliga la forma de la respuesta
   * y reasoning_effort low deja cupo para el JSON.
   */
  private buildCompletionRequest(prompt: string) {
    const supportsStrictSchema = this.modelSupportsStrictJsonSchema(this.config.model);

    return {
      model: this.config.model,
      messages: [
        {
          role: 'system' as const,
          content:
            'Eres un analista experto. Responde ÚNICAMENTE con un objeto JSON que cumpla el esquema, sin texto adicional ni markdown.',
        },
        {
          role: 'user' as const,
          content: prompt,
        },
      ],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      response_format: supportsStrictSchema
        ? {
            type: 'json_schema' as const,
            json_schema: {
              name: 'task_analysis',
              strict: true,
              schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  status: {
                    type: 'string',
                    enum: ['on_track', 'at_risk', 'blocked', 'in_progress'],
                  },
                  confidenceLevel: { type: 'integer' },
                  reason: { type: 'string' },
                  recommendation: { type: 'string' },
                },
                required: ['status', 'confidenceLevel', 'reason', 'recommendation'],
              },
            },
          }
        : { type: 'json_object' as const },
      ...(supportsStrictSchema ? { reasoning_effort: 'low' as const } : {}),
    };
  }

  private modelSupportsStrictJsonSchema(model: string): boolean {
    return [
      'openai/gpt-oss-20b',
      'openai/gpt-oss-120b',
      'qwen/qwen3.8-27b',
    ].includes(model);
  }

  private parseAndValidateResponse(content: string): AnalysisOutput {
    try {
      // Limpiar el contenido por si hay markdown o texto adicional
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;

      const parsed = JSON.parse(jsonContent);

      // Validar estructura
      if (
        !parsed.status ||
        typeof parsed.confidenceLevel !== 'number' ||
        !parsed.reason ||
        !parsed.recommendation
      ) {
        throw new Error('Invalid response structure from LLM');
      }

      // Validar status y mapear valores comunes incorrectos
      const validStatuses = ['on_track', 'at_risk', 'blocked', 'in_progress'];
      let status = parsed.status;
      
      if (!validStatuses.includes(status)) {
        // Intentar mapear valores comunes incorrectos
        const statusMap: Record<string, string> = {
          'pending': 'in_progress',
          'completed': 'on_track',
          'done': 'on_track',
          'cancelled': 'blocked',
          'failed': 'blocked',
        };
        
        if (statusMap[status.toLowerCase()]) {
          this.logger.warn(`LLM devolvió status inválido "${status}", mapeado a "${statusMap[status.toLowerCase()]}"`);
          status = statusMap[status.toLowerCase()];
        } else {
          throw new Error(`Invalid status: ${parsed.status}. Debe ser uno de: ${validStatuses.join(', ')}`);
        }
      }

      // Validar confidenceLevel
      if (
        parsed.confidenceLevel < 0 ||
        parsed.confidenceLevel > 100 ||
        !Number.isInteger(parsed.confidenceLevel)
      ) {
        // Redondear si no es entero
        parsed.confidenceLevel = Math.round(
          Math.max(0, Math.min(100, parsed.confidenceLevel)),
        );
      }

      return {
        status: status,
        confidenceLevel: parsed.confidenceLevel,
        reason: parsed.reason.trim(),
        recommendation: parsed.recommendation.trim(),
      };
    } catch (error) {
      this.logger.error('Error parsing LLM response', error);
      throw new Error(`Failed to parse LLM response: ${error.message}`);
    }
  }
}