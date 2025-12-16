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
      ];
    }
  }