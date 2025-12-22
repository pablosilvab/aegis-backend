import { AnalysisInput } from '../../../domain/interfaces/analysis-service.interface';
import { FewShotExamples } from './few-shot-examples';

export class PromptBuilder {
  static buildAnalysisPrompt(input: AnalysisInput, includeExamples: boolean = true): string {
    const eventsText = input.events
      .map(
        (event) =>
          `- [${event.timestamp.toISOString()}] ${event.type}: ${event.content}`,
      )
      .join('\n');

    const dueDateText = input.taskDueDate
      ? `Fecha de vencimiento: ${input.taskDueDate.toISOString()}`
      : 'Sin fecha de vencimiento definida';

    // Construir ejemplos few-shot si está habilitado
    let examplesSection = '';
    if (includeExamples) {
      const examples = FewShotExamples.getExamples();
      examplesSection = this.buildExamplesSection(examples);
    }


    return `Eres un analista experto en gestión de proyectos. Analiza tareas y su historial de eventos para determinar su estado actual y proporcionar recomendaciones.

${examplesSection ? `EJEMPLOS DE ANÁLISIS (aprende de estos patrones):

${examplesSection}

---` : ''}

TAREA A ANALIZAR:
- Título: ${input.taskTitle}
- Descripción: ${input.taskDescription}
- Estado de la tarea (información de contexto): ${input.taskStatus}
- ${dueDateText}

HISTORIAL DE EVENTOS:
${eventsText || 'No hay eventos registrados aún.'}

INSTRUCCIONES:
Analiza la tarea considerando:
1. El estado actual y su progreso
2. Los eventos registrados (comentarios, cambios de estado, fechas)
3. La fecha de vencimiento (si existe)
4. Patrones que indiquen riesgos, bloqueos o desviaciones

${examplesSection ? 'Usa los ejemplos anteriores como referencia para el formato y nivel de detalle esperado. ' : ''}

⚠️ ATENCIÓN CRÍTICA: El campo "status" en tu respuesta NO es el estado de la tarea (${input.taskStatus}), sino el RESULTADO DE TU ANÁLISIS sobre cómo está progresando la tarea. 

Debes evaluar y devolver uno de estos 4 valores:
- "on_track": La tarea avanza correctamente, sin problemas significativos
- "at_risk": La tarea tiene riesgos o retrasos potenciales, pero aún puede completarse
- "blocked": La tarea está bloqueada y no puede avanzar sin intervención
- "in_progress": La tarea está en progreso activo, sin problemas evidentes aún

Responde ÚNICAMENTE con un JSON válido en este formato exacto:
{
  "status": "on_track" | "at_risk" | "blocked" | "in_progress",
  "confidenceLevel": <número entre 0 y 100>,
  "reason": "<explicación breve del análisis>",
  "recommendation": "<recomendación específica y accionable>"
}

IMPORTANTE:
- status DEBE ser uno de estos 4 valores EXACTOS: "on_track", "at_risk", "blocked", "in_progress"
- NO uses el estado de la tarea (${input.taskStatus}) como valor de status
- confidenceLevel debe ser un número entero entre 0 y 100
- reason debe ser conciso (máximo 200 palabras)
- recommendation debe ser específica y accionable (máximo 150 palabras)
- Responde SOLO con el JSON, sin texto adicional, sin markdown, sin explicaciones`;
  }

  private static buildExamplesSection(examples: any[]): string {
    return examples
      .map((example, index) => {
        const eventsText = example.input.events
          .map((e: any) => `- [${e.timestamp}] ${e.type}: ${e.content}`)
          .join('\n');

        return `Ejemplo ${index + 1}:
TAREA:
- Título: ${example.input.taskTitle}
- Descripción: ${example.input.taskDescription}
- Estado: ${example.input.taskStatus}
${example.input.dueDate ? `- Fecha de vencimiento: ${example.input.dueDate}` : ''}
EVENTOS:
${eventsText || 'Sin eventos'}

ANÁLISIS RESULTANTE:
${JSON.stringify(example.output, null, 2)}`;
      })
      .join('\n\n');
  }
}