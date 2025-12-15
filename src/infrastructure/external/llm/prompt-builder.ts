import { AnalysisInput } from '../../../domain/interfaces/analysis-service.interface';

export class PromptBuilder {
  static buildAnalysisPrompt(input: AnalysisInput): string {
    const eventsText = input.events
      .map(
        (event) =>
          `- [${event.timestamp.toISOString()}] ${event.type}: ${event.content}`,
      )
      .join('\n');

    const dueDateText = input.taskDueDate
      ? `Fecha de vencimiento: ${input.taskDueDate.toISOString()}`
      : 'Sin fecha de vencimiento definida';

    return `Eres un analista experto en gestión de proyectos. Analiza la siguiente tarea y su historial de eventos para determinar su estado actual y proporcionar recomendaciones.

TAREA:
- Título: ${input.taskTitle}
- Descripción: ${input.taskDescription}
- Estado actual: ${input.taskStatus}
- ${dueDateText}

HISTORIAL DE EVENTOS:
${eventsText || 'No hay eventos registrados aún.'}

INSTRUCCIONES:
Analiza la tarea considerando:
1. El estado actual y su progreso
2. Los eventos registrados (comentarios, cambios de estado, fechas)
3. La fecha de vencimiento (si existe)
4. Patrones que indiquen riesgos, bloqueos o desviaciones

Responde ÚNICAMENTE con un JSON válido en este formato exacto:
{
  "status": "on_track" | "at_risk" | "blocked" | "in_progress",
  "confidenceLevel": <número entre 0 y 100>,
  "reason": "<explicación breve del análisis>",
  "recommendation": "<recomendación específica y accionable>"
}

IMPORTANTE:
- status debe ser uno de: "on_track", "at_risk", "blocked", "in_progress"
- confidenceLevel debe ser un número entero entre 0 y 100
- reason debe ser conciso (máximo 200 palabras)
- recommendation debe ser específica y accionable (máximo 150 palabras)
- Responde SOLO con el JSON, sin texto adicional`;
  }
}