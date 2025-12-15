Aegis — Introducción del Proyecto

Aegis es un backend orientado a procesos profesionales que utiliza modelos de lenguaje (LLMs) como herramienta de análisis para detectar tempranamente riesgos, bloqueos o desviaciones en la ejecución de tareas.

El objetivo del proyecto no es construir un chatbot ni un sistema autónomo, sino integrar IA de forma controlada y auditable dentro de un backend bien diseñado, priorizando criterios clásicos de ingeniería: claridad, trazabilidad, control de costos y robustez en producción.

Aegis analiza el historial factual de eventos asociados a una tarea y genera conclusiones estructuradas que ayudan a equipos técnicos o de gestión a tomar decisiones informadas antes de que los problemas se materialicen.

Objetivos del Proyecto

Demostrar uso profesional de LLMs

Utilizar IA como dependencia controlada, no como autoridad decisora.

Evitar alucinaciones mediante prompts conservadores y outputs estructurados.

Construir un backend sólido y mantenible

Separar claramente capas de API, dominio y servicios externos.

Mantener la lógica de negocio independiente del proveedor de IA.

Modelar procesos reales

Trabajar sobre eventos y estados, no sobre texto libre.

Reflejar flujos que existen en entornos profesionales reales.

Facilitar crecimiento profesional

Diseñar el sistema de forma que pueda escalar en complejidad (eventos, workers, evaluaciones) sin rehacer la base.

Alcance del MVP
Funcionalidades incluidas

Creación y gestión básica de tareas.

Registro de eventos asociados a una tarea (comentarios, cambios de estado, fechas).

Proceso explícito de análisis de tareas:

Manual o gatillado por reglas simples.

Generación de un análisis estructurado:

Estado de la tarea (en curso, en riesgo, bloqueada).

Nivel de confianza.

Motivo y recomendación.

Persistencia completa del resultado del análisis para auditoría.

Fuera de alcance (intencionalmente)

Interfaces gráficas o frontends.

Chat en tiempo real.

Automatización autónoma de decisiones.

Notificaciones automáticas.

Agentes con capacidad de acción propia.

Especificaciones Técnicas Definidas
Arquitectura

Backend API con separación clara de responsabilidades.

Enfoque tipo hexagonal / clean architecture.

Lógica de negocio desacoplada de frameworks y proveedores externos.

Stack

NestJS (TypeScript) como framework principal.

Base de datos relacional (SQL).

Comunicación interna orientada a eventos (asincronía donde aplique).

Uso de IA

Consumo de LLMs vía API.

Prompts estructurados y conservadores.

Outputs estrictamente en formato JSON validable.

Llamadas al modelo solo cuando reglas de negocio lo justifican.

Principios clave

Control explícito del flujo (el sistema decide cuándo usar IA).

Persistencia de decisiones y resultados.

Manejo de errores, timeouts y fallos del proveedor de IA.

Diseño preparado para escalar, pero sin complejidad innecesaria en el MVP.

Resultado Esperado

Al finalizar el MVP, Aegis debe ser un backend funcional que demuestre:

Criterio técnico sólido.

Uso responsable y profesional de IA.

Capacidad de análisis aplicada a procesos reales.

Base clara para futuras extensiones sin deuda técnica temprana.

Este proyecto no busca “innovar por innovar”, sino hacer bien lo fundamental.