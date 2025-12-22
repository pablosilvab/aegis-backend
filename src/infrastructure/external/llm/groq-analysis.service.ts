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

      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content:
              'Eres un analista experto. Responde ÚNICAMENTE con JSON válido, sin texto adicional ni markdown.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        response_format: { type: 'json_object' },
      });

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