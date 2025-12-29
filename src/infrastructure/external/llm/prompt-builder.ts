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

    // NUEVO: Construir sección de historial de análisis anteriores (RAG)
    let historySection = '';
    if (input.previousAnalyses && input.previousAnalyses.length > 0) {
      historySection = this.buildHistorySection(input.previousAnalyses);
    }

    return `Eres un analista experto en gestión de proyectos de Tecnologías de la Información (TI). 
Tienes conocimiento profundo de:
- Ciclos de desarrollo de software (desarrollo, testing, deployment)
- Infraestructura y DevOps (CI/CD, contenedores, cloud)
- Integraciones y dependencias técnicas
- Riesgos comunes en proyectos TI (bloqueos técnicos, dependencias externas, complejidad subestimada)
- Patrones de trabajo en equipos de desarrollo

Analiza tareas de proyectos TI y su historial de eventos para determinar su estado actual y proporcionar recomendaciones técnicas específicas.

${examplesSection ? `EJEMPLOS DE ANÁLISIS (aprende de estos patrones):

${examplesSection}

---` : ''}

${historySection ? `HISTORIAL DE ANÁLISIS ANTERIORES DE ESTA TAREA (considera la evolución):

${historySection}

---` : ''}

TAREA A ANALIZAR:
- Título: ${input.taskTitle}
- Descripción: ${input.taskDescription}
- Estado de la tarea (información de contexto): ${input.taskStatus}
- ${dueDateText}

TIPO DE TAREA (inferido del título y descripción):
Identifica el tipo de tarea basándote en el título y descripción. Los tipos comunes en proyectos TI son:
- Desarrollo: Implementación de features, corrección de bugs, refactoring
- Testing: Pruebas unitarias, integración, e2e, QA
- Deployment/DevOps: CI/CD, infraestructura, configuración, despliegues
- Integración: APIs externas, servicios de terceros, microservicios
- Documentación: Actualización de docs, wikis, especificaciones técnicas
- Investigación/POC: Proof of concept, investigación técnica, evaluación de tecnologías
- Otro: Tareas administrativas, reuniones, planificación

Considera el tipo de tarea al evaluar riesgos y recomendaciones. Por ejemplo:
- Tareas de integración tienen mayor riesgo de dependencias externas
- Tareas de deployment pueden tener bloqueos por infraestructura
- Tareas de investigación pueden tener complejidad subestimada

HISTORIAL DE EVENTOS:
${eventsText || 'No hay eventos registrados aún.'}

INSTRUCCIONES:
Analiza la tarea considerando:

1. El estado actual y su progreso
2. Los eventos registrados (comentarios, cambios de estado, fechas)
3. La fecha de vencimiento (si existe)
4. Patrones que indiquen riesgos, bloqueos o desviaciones
${historySection ? `5. La evolución mostrada en los análisis anteriores (¿mejora, empeora, se mantiene?):
   - Compara el estado actual con los análisis anteriores
   - Si los análisis anteriores muestran una tendencia (mejora/empeora), considera esa tendencia
   - Si hay inconsistencia en los análisis anteriores, ajusta tu confianza en consecuencia
   - Menciona explícitamente si la situación ha mejorado, empeorado o se mantiene igual` : ''}

RIESGOS ESPECÍFICOS DE PROYECTOS TI A CONSIDERAR:

1. Dependencias técnicas:
   - Librerías o frameworks con problemas conocidos
   - Servicios externos no disponibles o con rate limits
   - APIs de terceros con cambios breaking
   - Infraestructura (servidores, bases de datos, servicios cloud)

2. Bloqueos por complejidad:
   - Problemas técnicos no anticipados
   - Complejidad subestimada en la estimación inicial
   - Falta de conocimiento técnico en el equipo
   - Requisitos técnicos ambiguos o cambiantes

3. Integraciones:
   - Dependencias entre servicios/microservicios
   - Problemas de comunicación entre equipos
   - Cambios en APIs o contratos
   - Problemas de sincronización o versionado

4. Ambiente e infraestructura:
   - Problemas en ambientes de desarrollo/staging/producción
   - Configuración de CI/CD
   - Problemas de permisos o acceso
   - Recursos insuficientes (CPU, memoria, storage)

5. Testing y calidad:
   - Bugs críticos descubiertos en testing
   - Cobertura de tests insuficiente
   - Problemas de integración entre componentes
   - Regresiones introducidas

Al analizar, presta especial atención a estos riesgos y menciona específicamente cuáles aplican a esta tarea.

SEÑALES DE PROGRESO/ESTANCAMIENTO EN TAREAS TI:

Evalúa estas señales al determinar el status y nivel de confianza:

- Progreso positivo: Eventos que muestran avance técnico (commits, tests pasando, features funcionando, optimizaciones completadas)
- Estancamiento: Múltiples eventos sin progreso real, cambios de enfoque frecuentes, problemas recurrentes sin solución
- Complejidad creciente: Tiempo sin eventos positivos, problemas técnicos que se acumulan, múltiples intentos de solución
- Bloqueos técnicos: Dependencias no resueltas, problemas de infraestructura, falta de conocimiento, esperas por aprobaciones técnicas

Si detectas estancamiento o complejidad creciente, considera aumentar el nivel de riesgo (at_risk o blocked) y proporciona recomendaciones específicas para desbloquear.

${examplesSection ? 'Usa los ejemplos anteriores como referencia para el formato y nivel de detalle esperado. ' : ''}${historySection ? 'IMPORTANTE: El historial de análisis anteriores muestra cómo ha evolucionado esta tarea. Úsalo para detectar tendencias y hacer un análisis más preciso. Si los análisis anteriores son consistentes, aumenta tu confianza. Si hay cambios significativos, explica por qué. ' : ''}

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

  // NUEVO: Método para construir sección de historial
  private static buildHistorySection(previousAnalyses: Array<{
    status: string;
    confidenceLevel: number;
    reason: string;
    recommendation: string;
    timestamp: Date;
  }>): string {
    return previousAnalyses
      .map((analysis, index) => {
        const date = new Date(analysis.timestamp).toISOString().split('T')[0];
        return `Análisis ${index + 1} (${date}):
- Status del análisis: ${analysis.status}
- Confianza: ${analysis.confidenceLevel}%
- Motivo: ${analysis.reason}
- Recomendación: ${analysis.recommendation}`;
      })
      .join('\n\n');
  }
}