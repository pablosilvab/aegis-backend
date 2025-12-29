export interface FewShotExample {
    input: {
      taskTitle: string;
      taskDescription: string;
      taskStatus: string;
      events: Array<{ type: string; content: string; timestamp: string }>;
      dueDate?: string;
    };
    output: {
      status: string;
      confidenceLevel: number;
      reason: string;
      recommendation: string;
    };
  }
  
  export class FewShotExamples {
    static getExamples(): FewShotExample[] {
      return [
        {
          input: {
            taskTitle: 'Implementar autenticación de usuarios',
            taskDescription: 'Sistema de login y registro con JWT',
            taskStatus: 'in_progress',
            events: [
              {
                type: 'comment',
                content: 'Iniciando implementación',
                timestamp: '2024-12-01T10:00:00Z',
              },
              {
                type: 'status_change',
                content: 'Tarea movida a in_progress',
                timestamp: '2024-12-01T10:05:00Z',
              },
              {
                type: 'comment',
                content: 'Problema con la librería de JWT, investigando',
                timestamp: '2024-12-02T14:30:00Z',
              },
            ],
            dueDate: '2024-12-15T00:00:00Z',
          },
          output: {
            status: 'at_risk',
            confidenceLevel: 75,
            reason: 'La tarea está en progreso pero hay un problema técnico reportado (JWT). La fecha de vencimiento está próxima (13 días) y hay un bloqueo potencial que podría retrasar la entrega.',
            recommendation: 'Resolver el problema con la librería JWT de inmediato. Si no se resuelve en 2 días, considerar alternativas o solicitar extensión de plazo. Asignar recursos adicionales si es necesario.',
          },
        },
        {
          input: {
            taskTitle: 'Revisar documentación del API',
            taskDescription: 'Actualizar Swagger y documentación técnica',
            taskStatus: 'blocked',
            events: [
              {
                type: 'comment',
                content: 'Esperando aprobación del equipo de arquitectura',
                timestamp: '2024-12-10T09:00:00Z',
              },
              {
                type: 'status_change',
                content: 'Tarea bloqueada por dependencia externa',
                timestamp: '2024-12-10T09:15:00Z',
              },
            ],
          },
          output: {
            status: 'blocked',
            confidenceLevel: 90,
            reason: 'La tarea está explícitamente bloqueada por una dependencia externa (aprobación de arquitectura). No hay progreso posible hasta que se resuelva esta dependencia.',
            recommendation: 'Contactar al equipo de arquitectura para acelerar la aprobación. Si la dependencia se extiende más de 3 días, escalar al management. Considerar trabajar en otras tareas mientras se espera.',
          },
        },
        {
          input: {
            taskTitle: 'Optimizar queries de base de datos',
            taskDescription: 'Mejorar rendimiento de consultas lentas',
            taskStatus: 'in_progress',
            events: [
              {
                type: 'comment',
                content: 'Identificadas 5 queries problemáticas',
                timestamp: '2024-12-05T11:00:00Z',
              },
              {
                type: 'comment',
                content: 'Optimizadas 3 queries, mejoras del 60%',
                timestamp: '2024-12-06T15:30:00Z',
              },
              {
                type: 'comment',
                content: 'Completadas todas las optimizaciones, en testing',
                timestamp: '2024-12-08T10:00:00Z',
              },
            ],
            dueDate: '2024-12-20T00:00:00Z',
          },
          output: {
            status: 'on_track',
            confidenceLevel: 85,
            reason: 'La tarea muestra progreso constante y positivo. Se han completado las optimizaciones y está en fase de testing. La fecha de vencimiento está lejana (12 días) y el progreso es adecuado.',
            recommendation: 'Completar el testing y documentar las optimizaciones realizadas. Considerar aplicar las mismas técnicas a otras áreas del sistema si es aplicable.',
          },
        },
        {
          input: {
            taskTitle: 'Configurar pipeline CI/CD para microservicio',
            taskDescription: 'Setup de GitHub Actions para build, test y deploy automático',
            taskStatus: 'in_progress',
            events: [
              {
                type: 'comment',
                content: 'Configurado build y test, fallando en etapa de deploy',
                timestamp: '2024-12-10T14:00:00Z',
              },
              {
                type: 'comment',
                content: 'Problema con permisos de AWS, esperando acceso',
                timestamp: '2024-12-11T09:30:00Z',
              },
            ],
            dueDate: '2024-12-18T00:00:00Z',
          },
          output: {
            status: 'blocked',
            confidenceLevel: 85,
            reason: 'La tarea está bloqueada por falta de permisos de AWS. El pipeline está configurado pero no puede completarse sin acceso a la infraestructura. La fecha de vencimiento está próxima (7 días).',
            recommendation: 'Escalar inmediatamente la solicitud de permisos AWS. Si no se resuelve en 24 horas, considerar alternativas temporales o solicitar extensión. Documentar el bloqueo para evitar retrasos futuros.',
          },
        },
        {
          input: {
            taskTitle: 'Integrar API de pagos de terceros',
            taskDescription: 'Integración con servicio de pagos externo para procesar transacciones',
            taskStatus: 'in_progress',
            events: [
              {
                type: 'comment',
                content: 'API documentación recibida, iniciando integración',
                timestamp: '2024-12-05T10:00:00Z',
              },
              {
                type: 'comment',
                content: 'Problema: la API tiene rate limits más restrictivos de lo esperado',
                timestamp: '2024-12-07T15:20:00Z',
              },
              {
                type: 'comment',
                content: 'Implementando sistema de cache y retry logic',
                timestamp: '2024-12-09T11:00:00Z',
              },
            ],
            dueDate: '2024-12-20T00:00:00Z',
          },
          output: {
            status: 'at_risk',
            confidenceLevel: 70,
            reason: 'La integración está en progreso pero se descubrió un problema con rate limits que requiere trabajo adicional (cache y retry). Aunque hay progreso, la complejidad aumentó y podría retrasar la entrega.',
            recommendation: 'Validar que la solución de cache y retry sea suficiente antes de continuar. Considerar contactar al proveedor para discutir rate limits o alternativas. Monitorear de cerca el progreso en los próximos días.',
          },
        },
        {
          input: {
            taskTitle: 'Investigar migración a GraphQL',
            taskDescription: 'POC para evaluar migración de REST a GraphQL',
            taskStatus: 'in_progress',
            events: [
              {
                type: 'comment',
                content: 'Revisando documentación y casos de uso',
                timestamp: '2024-12-01T09:00:00Z',
              },
              {
                type: 'comment',
                content: 'Implementando POC básico',
                timestamp: '2024-12-03T14:00:00Z',
              },
              {
                type: 'comment',
                content: 'POC completado, evaluando resultados y documentando',
                timestamp: '2024-12-08T16:30:00Z',
              },
            ],
            dueDate: '2024-12-15T00:00:00Z',
          },
          output: {
            status: 'on_track',
            confidenceLevel: 80,
            reason: 'La tarea de investigación muestra progreso constante. El POC está completado y en fase de evaluación. La fecha de vencimiento está próxima (7 días) pero el trabajo principal está hecho.',
            recommendation: 'Completar la documentación de resultados y recomendaciones. Presentar hallazgos al equipo para decisión sobre migración. Si se requiere más tiempo, es aceptable dado que es investigación.',
          },
        },
        {
          input: {
            taskTitle: 'Corregir bug crítico en procesamiento de pagos',
            taskDescription: 'Bug que causa pérdida de transacciones en casos edge',
            taskStatus: 'in_progress',
            events: [
              {
                type: 'comment',
                content: 'Bug reportado en producción, investigando',
                timestamp: '2024-12-10T08:00:00Z',
              },
              {
                type: 'comment',
                content: 'Root cause identificado: race condition en procesamiento concurrente',
                timestamp: '2024-12-10T12:00:00Z',
              },
              {
                type: 'comment',
                content: 'Fix implementado, en testing',
                timestamp: '2024-12-10T18:00:00Z',
              },
            ],
            dueDate: '2024-12-11T00:00:00Z',
          },
          output: {
            status: 'at_risk',
            confidenceLevel: 75,
            reason: 'Bug crítico en producción con fix implementado pero aún en testing. La fecha de vencimiento es inminente (1 día) y requiere validación exhaustiva antes de deploy a producción.',
            recommendation: 'Priorizar testing exhaustivo del fix, especialmente casos edge y concurrencia. Considerar hotfix si es necesario. Validar que no haya regresiones antes de deploy a producción.',
          },
        },
      ];
    }
  }