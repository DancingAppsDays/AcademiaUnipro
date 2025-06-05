// src/app/core/services/curriculum.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CurriculumModule {
  id: string;
  title: string;
  duration?: string;
  topics: string[];
  description?: string;
}

export interface CourseCurriculum {
  courseId: string;
  courseTitle: string;
  objective: string;
  methodology: string;
  evaluation: string[];
  includes: string[];
  practicalProgram?: string[];
  technicalRequirements?: string[];
  modules: CurriculumModule[];
}

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {

  // Database of curriculum content mapped by course ID
  private curriculumDatabase: { [courseId: string]: CourseCurriculum } = {

    // Selección y Uso del Equipo de Protección Personal (EPP) - NOM-017-STPS-2018
    '68016bdadacd51ff05430033': {
      courseId: '68016bdadacd51ff05430033',
      courseTitle: 'Selección y Uso del Equipo de Protección Personal (EPP)',
      objective: 'El participante conocerá los principios normativos y técnicos para la selección, uso correcto, mantenimiento y disposición del equipo de protección personal (EPP), con el objetivo de prevenir accidentes y enfermedades laborales.',
      methodology: 'Metodología online activa y demostrativa, con recursos visuales, dinámicas participativas, reflexión sobre errores comunes, y enfoque en cumplimiento normativo.',
      evaluation: [
        'Examen teórico digital',
        'Participación activa en ejercicios',
        'Registro de asistencia'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Manual digital del curso',
        'Examen en línea',
        'Diploma oficial digital',
        'Constancia DC-3 (STPS)',
        'Reporte individual de desempeño'
      ],
      practicalProgram: [
        'Análisis participativo de casos reales',
        'Revisión de ejemplos de EPP por tipo de riesgo',
        'Evaluación de registros y bitácoras digitales'
      ],
      technicalRequirements: [
        'Conexión a internet estable',
        'Cámara y micrófono activos',
        'Participación continua durante toda la sesión'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Introducción y conceptos clave',
          topics: [
            '¿Qué es el EPP y qué función cumple?',
            'Peligros físicos, químicos y biológicos',
            'Etapas para definir el EPP',
            'Marco legal básico'
          ]
        },
        {
          id: 'module2',
          title: 'Controles operacionales y jerarquía de seguridad',
          topics: [
            '¿Cuál es el mejor control?',
            'Controles de ingeniería, administrativos y uso de EPP',
            'El EPP como última barrera de protección'
          ]
        },
        {
          id: 'module3',
          title: 'Ventajas y limitaciones del EPP',
          topics: [
            'Costos, variedad, tiempo de implementación',
            'Limitaciones físicas y percepción de seguridad'
          ]
        },
        {
          id: 'module4',
          title: 'Legislación mexicana aplicable al EPP',
          topics: [
            'Reglamento Federal',
            'Análisis de riesgos como base para selección',
            'Normas complementarias'
          ]
        },
        {
          id: 'module5',
          title: 'Requisitos de la NOM-017-STPS-2018',
          topics: [
            'Identificación de peligros',
            'Registros obligatorios y documentación técnica',
            'Tipos de EPP: cabeza, ojos, manos, pies, respiración, auditiva, corporal',
            'Diferencia entre lentes comunes y de seguridad'
          ]
        },
        {
          id: 'module6',
          title: 'Capacitación, supervisión y señalización',
          topics: [
            'Comunicación efectiva para el uso del EPP',
            'Capacitación al personal y contratistas',
            'Supervisión continua',
            'Señalización conforme a NOM-026-STPS',
            'Disposición final del equipo'
          ]
        },
        {
          id: 'module7',
          title: 'Conclusiones',
          topics: [
            'Usos incorrectos comunes',
            'Actos inseguros y condiciones de riesgo'
          ]
        }
      ]
    },

    // Manejo de Residuos Peligrosos - RP-UNIPROTEC
    '68016bb4dacd51ff0543002d': {
      courseId: '68016bb4dacd51ff0543002d',
      courseTitle: 'Manejo de Residuos Peligrosos',
      objective: 'Reconocer cuáles son los residuos peligrosos de acuerdo con sus características de peligrosidad CRETIB, y adquirir los conocimientos para su adecuado manejo, almacenamiento, transporte y disposición final conforme a la normativa vigente.',
      methodology: 'Modalidad online expositiva, práctica y participativa. Se utilizan herramientas digitales, casos reales y material descargable para asegurar la comprensión de los requisitos legales y técnicos en el manejo de residuos peligrosos.',
      evaluation: [
        'Examen teórico digital',
        'Participación activa en ejercicios',
        'Registro de asistencia'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Manual digital descargable',
        'Diploma oficial digital',
        'Constancia DC-3 (STPS)',
        'Reporte de evaluación y desempeño individual'
      ],
      practicalProgram: [
        'Evaluación de residuos según criterios CRETIB',
        'Simulación del llenado de manifiestos',
        'Análisis de etiquetas reales y simbología',
        'Ejercicio práctico de trazabilidad y disposición'
      ],
      technicalRequirements: [
        'Conexión a internet estable',
        'Dispositivo con cámara y micrófono',
        'Espacio sin distracciones',
        'Participación activa durante toda la sesión'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Marco conceptual de los residuos peligrosos',
          topics: [
            'Definiciones: contaminante, generador, manifiesto, tratamiento',
            'Tipos de residuos incompatibles',
            'Disposición final',
            'Introducción al sistema CRETIB'
          ]
        },
        {
          id: 'module2',
          title: 'Marco regulatorio en México',
          topics: [
            'Ley General del Equilibrio Ecológico y Protección al Ambiente (LGEEPA)',
            'Reglamento en materia de Residuos Peligrosos',
            'LGPGIR – Ley General para la Prevención y Gestión Integral de los Residuos',
            'NOM-054-SEMARNAT-1993',
            'NOM-052-SEMARNAT-2005',
            'NOM-087-ECOL-SSA1-2002'
          ]
        },
        {
          id: 'module3',
          title: 'Manejo adecuado de residuos peligrosos',
          topics: [
            'Estrategias de gestión',
            'Alta como generador',
            'Condiciones del almacén temporal',
            'Bitácoras de control y trazabilidad',
            'Permisos de recolección y disposición final',
            'Control de manifiestos oficiales'
          ]
        },
        {
          id: 'module4',
          title: 'NOM-003-SCT/2008',
          topics: [
            'Objetivo y alcance',
            'Etiquetado de residuos para transporte',
            'Símbolos básicos y pictogramas'
          ]
        }
      ]
    },

    // Manejo de Sustancias Químicas - NOM-005-STPS-1998
    '68016ba6dacd51ff0543002b': {
      courseId: '68016ba6dacd51ff0543002b',
      courseTitle: 'Manejo de Sustancias Químicas',
      objective: 'Establecer las condiciones de seguridad e higiene necesarias para el manejo, identificación y comunicación de peligros derivados del uso de sustancias químicas peligrosas, en cumplimiento con la NOM-005-STPS-1998 y normativas relacionadas.',
      methodology: 'Modalidad activa, participativa y expositiva a través de videoconferencia. Se utilizan ejemplos prácticos, ejercicios digitales y dinámicas de reflexión para consolidar el aprendizaje técnico y preventivo.',
      evaluation: [
        'Examen teórico online',
        'Participación activa en simulaciones',
        'Registro de asistencia'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Manual digital descargable',
        'Examen en línea',
        'Diploma oficial digital',
        'Constancia DC-3 (STPS)',
        'Reporte individual de desempeño'
      ],
      practicalProgram: [
        'Análisis de HDS y fichas reales',
        'Evaluación de condiciones del área de trabajo',
        'Ejercicio de respuesta ante derrames',
        'Simulación de identificación de riesgos y pictogramas'
      ],
      technicalRequirements: [
        'Conexión estable a internet',
        'Cámara y micrófono funcionales',
        'Participación activa durante toda la sesión',
        'Material complementario digital previamente descargado'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Generalidades y Marco Normativo',
          topics: [
            'Definiciones clave',
            'Clasificación de riesgos químicos (estado físico, vías de ingreso, características)',
            'Legislación aplicable'
          ]
        },
        {
          id: 'module2',
          title: 'Perfil del Trabajador',
          topics: [
            'Conocimientos, habilidades y actitudes necesarias',
            'Obligaciones del trabajador según legislación mexicana'
          ]
        },
        {
          id: 'module3',
          title: 'Reglas de Seguridad y Manejo Responsable',
          topics: [
            'Manipulación segura de sustancias químicas',
            'Equipo de protección personal (EPP)',
            'Protección respiratoria: tipos de filtros',
            'Hojas de datos de seguridad (HDS)',
            'Efectos a la salud y primeros auxilios',
            'Reglas para transporte y almacenamiento',
            'Condiciones del área de trabajo',
            'Incompatibilidad entre sustancias',
            'Etiquetado y señalización (NOM-018 y NOM-026)',
            'Kit antiderrames y manejo de emergencias',
            'Aplicación del sistema 5S'
          ]
        },
        {
          id: 'module4',
          title: 'Cierre y Concientización',
          topics: [
            'Actos inseguros y condiciones inseguras',
            'Diferencia entre incidente y accidente'
          ]
        }
      ]
    },

    // Sistema Globalmente Armonizado (SGA) - NOM-018-STPS-2015
    '67fabd7ded988286dbb4d271': {
      courseId: '67fabd7ded988286dbb4d271',
      courseTitle: 'Sistema Globalmente Armonizado (SGA)',
      objective: 'Que el participante conozca los criterios armonizados para la clasificación y comunicación de peligros de sustancias químicas peligrosas y sus mezclas, incluyendo los requisitos para el etiquetado y las hojas de datos de seguridad, con el fin de prevenir riesgos laborales y cumplir con la NOM-018-STPS-2015.',
      methodology: 'Modalidad expositiva y participativa en línea, con uso de materiales interactivos, ejemplos reales, y herramientas visuales. Se enfoca en fortalecer el conocimiento técnico, la actitud preventiva y la capacidad de aplicar normas en campo.',
      evaluation: [
        'Examen teórico online',
        'Participación en dinámicas',
        'Registro de asistencia'
      ],
      includes: [
        'Acceso a sesión en vivo',
        'Manual digital del curso',
        'Examen teórico online',
        'Constancia DC-3 digital (STPS)',
        'Diploma oficial digital',
        'Reporte individual de desempeño'
      ],
      practicalProgram: [
        'Análisis de etiquetas y HDS reales',
        'Clasificación y codificación de ejemplos químicos',
        'Ejercicio de identificación de pictogramas',
        'Evaluación interactiva con retroalimentación'
      ],
      technicalRequirements: [
        'Conexión estable a internet',
        'Cámara y micrófono funcionales',
        'Participación activa en tiempo real'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Generalidades de la NOM-018-STPS',
          topics: [
            'Objetivo',
            'Campo de aplicación',
            'Obligaciones del patrón y trabajadores',
            'Referencias normativas'
          ]
        },
        {
          id: 'module2',
          title: 'Conceptos básicos',
          topics: [
            'Definiciones clave: riesgo, peligro, órgano blanco, pictograma, palabra de advertencia, etc.',
            'Autoridades y clasificación internacional'
          ]
        },
        {
          id: 'module3',
          title: 'Sistema Armonizado de Identificación de Peligros',
          topics: [
            'Introducción y cambios clave',
            'Diferencias entre rombo NFPA y pictogramas',
            'Listado de sustancias químicas',
            'Actualización del sistema'
          ]
        },
        {
          id: 'module4',
          title: 'Hojas de Datos de Seguridad (HDS)',
          topics: [
            'Las 16 secciones obligatorias',
            'Cuándo se deben actualizar'
          ]
        },
        {
          id: 'module5',
          title: 'Señalización y Etiquetado',
          topics: [
            'Elementos requeridos',
            'Tipos de riesgos y pictogramas',
            'Etiqueta de identificación oficial en México'
          ]
        },
        {
          id: 'module6',
          title: 'Clasificación de los peligros',
          topics: [
            'Peligros físicos y a la salud',
            'Categorías y divisiones',
            'Pictogramas: descripción, dimensiones y símbolos',
            'Frases H y códigos de identificación',
            'Consejos de prudencia (P): tipos y códigos'
          ]
        },
        {
          id: 'module7',
          title: 'Equipos de Protección Personal (EPP)',
          topics: [
            'Símbolos y letras',
            'Ejemplos de EPP por tipo de riesgo'
          ]
        },
        {
          id: 'module8',
          title: 'Prevención de accidentes y concientización',
          topics: [
            'Actos y condiciones inseguras',
            'Incidentes vs accidentes',
            'Vías de exposición y consecuencias'
          ]
        }
      ]
    },

    // Condiciones de Iluminación en los Centros de Trabajo - NOM-025-STPS-2008
    '68016becdacd51ff05430037': {
      courseId: '68016becdacd51ff05430037',
      courseTitle: 'Condiciones de Iluminación en los Centros de Trabajo',
      objective: 'Evaluar las condiciones de iluminación en los centros de trabajo para prevenir riesgos por iluminación inadecuada. El curso permite conocer la normatividad vigente, los riesgos asociados a la salud y los elementos necesarios para su evaluación, control y mejora continua.',
      methodology: 'Metodología activa, expositiva y demostrativa adaptada a entornos digitales. Se enfoca en desarrollar habilidades técnicas, actitud crítica ante el riesgo, y capacidad de aplicación de normas a través de ejercicios participativos.',
      evaluation: [
        'Examen teórico interactivo',
        'Participación en dinámicas prácticas',
        'Control de asistencia digital'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Tríptico informativo y manual digital',
        'Diploma oficial digital',
        'Constancia de habilidades DC-3 (STPS)',
        'Reporte de evaluación y desempeño por participante'
      ],
      practicalProgram: [
        'Análisis virtual de áreas con deficiencia de iluminación',
        'Simulación de evaluación con formatos estándar',
        'Identificación de mejoras aplicables según resultados',
        'Revisión del reporte técnico y formato de evidencia'
      ],
      technicalRequirements: [
        'Conexión a internet estable',
        'Dispositivo con cámara y micrófono',
        'Participación activa durante toda la sesión',
        'Revisión previa de áreas a evaluar en su centro de trabajo (si aplica)'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Introducción a la NOM-025-STPS',
          topics: [
            'Objetivo y campo de aplicación',
            'Referencias',
            'Obligaciones del patrón y trabajadores'
          ]
        },
        {
          id: 'module2',
          title: 'Condiciones de seguridad en iluminación',
          topics: [
            'Niveles de iluminación por área y tarea visual',
            'Reconocimiento de condiciones de iluminación',
            'Evaluación técnica de niveles de iluminación'
          ]
        },
        {
          id: 'module3',
          title: 'Riesgos de iluminación inadecuada',
          topics: [
            'Efectos sobre la salud',
            'Daños visuales y fatiga',
            'Medidas de control preventivas'
          ]
        },
        {
          id: 'module4',
          title: 'Control y mantenimiento',
          topics: [
            'Procedimientos para evaluación de conformidad',
            'Reporte del estudio de iluminación',
            'Apéndice A: Evaluación de niveles',
            'Apéndice B: Evaluación del factor de mantenimiento'
          ]
        }
      ]
    },

    // Seguridad en el Manejo de Maquinaria, Equipo y Herramientas - NOM-004-STPS-1999
    '67fabd7aed988286dbb4d26f': {
      courseId: '67fabd7aed988286dbb4d26f',
      courseTitle: 'Seguridad en el Manejo de Maquinaria, Equipo y Herramientas',
      objective: 'Que los participantes identifiquen los riesgos asociados al uso de maquinaria, herramientas y equipos, comprendan el uso correcto de dispositivos y protectores de seguridad, y apliquen medidas preventivas con base en la NOM-004-STPS-1999, priorizando la seguridad en su entorno laboral.',
      methodology: 'Metodología activa, expositiva y demostrativa. El curso se imparte en línea con enfoque en el aprendizaje práctico, el trabajo colaborativo, la solución de problemas y el cumplimiento normativo.',
      evaluation: [
        'Examen teórico digital',
        'Participación en ejercicios guiados',
        'Control de asistencia en plataforma'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Manual digital descargable',
        'Diploma oficial digital',
        'Constancia de habilidades DC-3 (STPS)',
        'Reporte de evaluación teórica y práctica'
      ],
      practicalProgram: [
        'Análisis de incidentes reales',
        'Simulación de selección y evaluación de equipo',
        'Revisión de prácticas seguras y normativas aplicables',
        'Estudio de casos de aplicación de dispositivos de seguridad'
      ],
      technicalRequirements: [
        'Conexión a internet estable',
        'Computadora con cámara y micrófono',
        'Espacio sin distracciones',
        'Participación activa en las dinámicas'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Introducción a la Seguridad con Maquinaria',
          topics: [
            'Diferencias entre acto y condición insegura',
            'Defectos personales y medio social',
            'Causas básicas e inmediatas',
            'Incidente vs accidente'
          ]
        },
        {
          id: 'module2',
          title: 'Marco normativo: NOM-004-STPS',
          topics: [
            'Campo de aplicación',
            'Referencias',
            'Definiciones'
          ]
        },
        {
          id: 'module3',
          title: 'Obligaciones',
          topics: [
            'Obligaciones del patrón',
            'Obligaciones de los trabajadores'
          ]
        },
        {
          id: 'module4',
          title: 'Protectores y dispositivos de seguridad',
          topics: [
            'Tipos de protectores',
            'Dispositivos de seguridad',
            'Características y correcta aplicación'
          ]
        },
        {
          id: 'module5',
          title: 'Programa específico de seguridad e higiene',
          topics: [
            'Peligros y causas comunes',
            'Medidas preventivas y prácticas seguras',
            'Ergonomía y funcionamiento',
            'Selección, adquisición, mantenimiento y almacenamiento de herramientas',
            'Transporte seguro y observación planeada'
          ]
        },
        {
          id: 'module6',
          title: 'Verificación normativa',
          topics: [
            'Unidades de verificación',
            'Apéndice A: Tarjeta de aviso',
            'Apéndice B: Contenido mínimo de dictámenes'
          ]
        }
      ]
    },

    // Condiciones de Ruido en los Centros de Trabajo - NOM-011-STPS
    '68016bccdacd51ff05430031': {
      courseId: '68016bccdacd51ff05430031',
      courseTitle: 'Condiciones de Ruido en los Centros de Trabajo',
      objective: 'Conocer la normativa vigente relacionada con las condiciones de ruido en los centros de trabajo. Identificar los riesgos auditivos, los métodos de evaluación y control, así como los elementos necesarios para diseñar programas de conservación auditiva efectivos.',
      methodology: 'Metodología activa, expositiva y demostrativa, adaptada al entorno virtual. Promueve la participación, el análisis de casos y el aprendizaje aplicado, con enfoque en competencias cognoscitivas, actitudinales y prácticas.',
      evaluation: [
        'Examen teórico digital',
        'Evaluación práctica participativa',
        'Control de asistencia en vivo'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Manual digital descargable',
        'Constancia DC-3 digital (STPS)',
        'Diploma oficial digital',
        'Reporte individual de resultados evaluativos'
      ],
      practicalProgram: [
        'Revisión participativa de procedimientos',
        'Análisis de estudio de ruido (si lo aporta el cliente)',
        'Simulación de escenarios y toma de decisiones',
        'Evaluación de equipos de protección auditiva'
      ],
      technicalRequirements: [
        'Conexión a internet estable',
        'Dispositivo con cámara y micrófono',
        'Ambiente libre de ruido',
        'Participación activa durante toda la sesión'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Fundamentos de la NOM-011-STPS',
          topics: [
            'Objetivo y campo de aplicación',
            'Referencias y definiciones clave'
          ]
        },
        {
          id: 'module2',
          title: 'Responsabilidades legales',
          topics: [
            'Obligaciones del patrón',
            'Obligaciones de los trabajadores'
          ]
        },
        {
          id: 'module3',
          title: 'Evaluación del ruido',
          topics: [
            'Límites máximos permisibles de exposición',
            'Metodologías de medición (Apéndices A, B, C)'
          ]
        },
        {
          id: 'module4',
          title: 'Conservación auditiva y salud',
          topics: [
            'Programa de conservación de la audición',
            'Vigilancia médica y guía de referencia I',
            'Selección del EPP auditivo (Apéndice D)'
          ]
        },
        {
          id: 'module5',
          title: 'Contextos específicos',
          topics: [
            'Centros de trabajo de nueva creación',
            'Modificación de procesos existentes'
          ]
        }
      ]
    },

    // Comisión de Seguridad e Higiene - NOM-019-STPS
    '68016be4dacd51ff05430035': {
      courseId: '68016be4dacd51ff05430035',
      courseTitle: 'Comisión de Seguridad e Higiene',
      objective: 'Nivel 1: Que el participante sea capaz de integrar y hacer funcionar la Comisión de Seguridad e Higiene en su centro de trabajo, interpretando los documentos oficiales conforme a la NOM-019-STPS y los reglamentos internos. Además, se fortalecerán habilidades de comunicación efectiva y trabajo en equipo. Nivel 2: Reforzar conocimientos en seguridad e higiene industrial mediante la correcta identificación de las NOM-STPS aplicables, y el uso oportuno de herramientas para detectar peligros y riesgos laborales.',
      methodology: 'Metodología activa, expositiva y demostrativa, enfocada en el desarrollo cognitivo (conocimiento técnico), actitudinal (servicio y compromiso) y psicomotor (ejecución de actividades de campo adaptadas a sesiones online).',
      evaluation: [
        'Examen teórico online',
        'Evaluación participativa en línea',
        'Registro de asistencia digital'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Manuales digitales descargables',
        'Constancia DC-3 digital (STPS)',
        'Diploma oficial digital',
        'Reporte de resultados y desempeño individual'
      ],
      practicalProgram: [
        'Simulación de integración de comisión',
        'Llenado guiado de formatos internos',
        'Ejercicio de diagnóstico de riesgos',
        'Resolución de casos prácticos colaborativos'
      ],
      technicalRequirements: [
        'Conexión a internet estable',
        'Computadora con cámara y micrófono',
        'Espacio libre de distracciones',
        'Disposición para participar activamente en todo el curso'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Fundamentos de la Comisión - Nivel 1',
          topics: [
            'Conceptos básicos',
            'Requisitos legales aplicables de la STPS',
            'Reglamento interno (en caso de empresa con normativas internas como CROWN)'
          ]
        },
        {
          id: 'module2',
          title: 'Organización e Integración - Nivel 1',
          topics: [
            'Estructura de la comisión',
            'Funciones de cada integrante'
          ]
        },
        {
          id: 'module3',
          title: 'Actos y condiciones inseguras - Nivel 1',
          topics: [
            'Cómo identificar actos inseguros',
            'Procedimientos ante la detección'
          ]
        },
        {
          id: 'module4',
          title: 'Documentación de la Comisión - Nivel 1',
          topics: [
            'NOM-019-STPS',
            'Plan de trabajo anual',
            'Evidencias de recorridos y reuniones'
          ]
        },
        {
          id: 'module5',
          title: 'Requerimientos de la NOM-030-STPS - Nivel 1',
          topics: [
            'Relación con el diagnóstico de seguridad y salud',
            'Aplicación en la práctica'
          ]
        },
        {
          id: 'module6',
          title: 'Habilidades complementarias - Nivel 1',
          topics: [
            'Comunicación efectiva (escucha, empatía, retroalimentación)',
            'Trabajo en equipo (confianza, coordinación, cohesión)'
          ]
        },
        {
          id: 'module7',
          title: 'Seguridad e Higiene Industrial - Nivel 2',
          topics: [
            'Definiciones clave',
            'Reglamentos de SHyMAT'
          ]
        },
        {
          id: 'module8',
          title: 'Clasificación de NOM-STPS - Nivel 2',
          topics: [
            'Seguridad, salud, organización',
            'Marco legal de aplicación'
          ]
        },
        {
          id: 'module9',
          title: 'Identificación de riesgos y peligros - Nivel 2',
          topics: [
            '¿Qué es riesgo? ¿Qué es peligro?',
            'Relaciones causa-efecto',
            'Evaluación: probabilidad, severidad y exposición',
            'Escalas de riesgo e identificación de peligros mayores'
          ]
        }
      ]
    },


    '68016bf5dacd51ff05430039': {
      courseId: '68016bf5dacd51ff05430039',
      courseTitle: 'Colores y Señales de Seguridad e Higiene',
      objective: 'Establecer los requerimientos en cuanto a los colores y señales de seguridad e higiene, así como la identificación de riesgos por fluidos conducidos en tuberías, conforme a lo indicado en la NOM-026-STPS.',
      methodology: 'Metodología activa, expositiva y demostrativa con enfoque en el aprendizaje significativo a través de dinámicas visuales, trabajo colaborativo y ejercicios de análisis práctico adaptados a la modalidad online.',
      evaluation: [
        'Examen teórico en línea',
        'Evaluación práctica interactiva',
        'Control de asistencia en vivo'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Manual digital descargable',
        'Constancia de habilidades DC-3 (STPS)',
        'Diploma oficial digital',
        'Reporte de evaluación individual y fotográfico (cuando se requiera evidencia)'
      ],
      practicalProgram: [
        'Análisis de señalización en entornos reales',
        'Revisión de casos de aplicación correcta e incorrecta',
        'Simulaciones de recorrido en planta (con material visual)',
        'Evaluación participativa sobre colores, formas y riesgos'
      ],
      technicalRequirements: [
        'Conexión a internet estable',
        'Cámara y micrófono funcionales',
        'Espacio libre de distracciones',
        'Disponibilidad para participar activamente en toda la sesión'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Fundamentos de la NOM-026-STPS',
          topics: [
            'Objetivo de la norma',
            'Campo de aplicación',
            'Definiciones y simbología'
          ]
        },
        {
          id: 'module2',
          title: 'Responsabilidades',
          topics: [
            'Obligaciones del patrón',
            'Obligaciones de los trabajadores'
          ]
        },
        {
          id: 'module3',
          title: 'Colores de Seguridad e Higiene',
          topics: [
            'Colores de seguridad y colores contrastantes',
            'Tabla de colores y sus significados'
          ]
        },
        {
          id: 'module4',
          title: 'Señales de Seguridad e Higiene',
          topics: [
            'Formas geométricas y su interpretación',
            'Señales de prohibición',
            'Señales de obligación',
            'Señales de precaución',
            'Señales de información'
          ]
        },
        {
          id: 'module5',
          title: 'Identificación de riesgos por tuberías',
          topics: [
            'Colores para tuberías y su significado',
            'Interpretación correcta de marcaje y flujos'
          ]
        }
      ]
    },

    '68016b3bdacd51ff05430027': {
      courseId: '68016b3bdacd51ff05430027',
      courseTitle: 'Seguridad en Instalaciones Eléctricas',
      objective: 'Al finalizar el curso, el participante será capaz de establecer condiciones de seguridad para realizar actividades de mantenimiento en instalaciones eléctricas dentro del centro de trabajo, evitando accidentes tanto en el personal responsable como en personas externas potencialmente expuestas.',
      methodology: 'Metodología activa y demostrativa en línea, enfocada al aprendizaje significativo a través de interacción, análisis de casos reales y dinámicas participativas que desarrollan competencias cognitivas, actitudinales y prácticas.',
      evaluation: [
        'Examen teórico online',
        'Evaluación práctica mediante ejercicios guiados',
        'Control de asistencia digital'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Manual digital descargable',
        'Diploma oficial digital',
        'Constancia de habilidades DC-3 (STPS)',
        'Reporte individual de resultados teóricos y prácticos'
      ],
      practicalProgram: [
        'Análisis de planos, diagramas y simbología eléctrica',
        'Simulación de llenado de permisos y procedimientos internos',
        'Ejercicios de inspección virtual y análisis de riesgo',
        'Revisión participativa de equipos de protección'
      ],
      technicalRequirements: [
        'Conexión estable a internet',
        'Espacio libre de distracciones',
        'Acceso a cámara y micrófono',
        'Disposición para participar en dinámicas interactivas'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Introducción y Concientización',
          topics: [
            'Objetivo de la norma NOM-029-STPS',
            'Definiciones clave'
          ]
        },
        {
          id: 'module2',
          title: 'Importancia del mantenimiento eléctrico',
          topics: [
            'Antecedentes y contexto de seguridad'
          ]
        },
        {
          id: 'module3',
          title: 'Perfil del personal responsable',
          topics: [
            'Perfil básico, competencias y responsabilidades'
          ]
        },
        {
          id: 'module4',
          title: 'Análisis de riesgos',
          topics: [
            'Plan de trabajo y detección de riesgos potenciales'
          ]
        },
        {
          id: 'module5',
          title: 'Medidas y condiciones de seguridad',
          topics: [
            'Procedimientos generales y específicos',
            'Condiciones de seguridad para trabajos eléctricos'
          ]
        },
        {
          id: 'module6',
          title: 'Uso de EPP (NOM-017-STPS)',
          topics: [
            'Tipos de EPP y características',
            'Uso correcto durante el mantenimiento'
          ]
        },
        {
          id: 'module7',
          title: 'Actividades de mantenimiento eléctrico',
          topics: [
            'Componentes del sistema',
            'Simbología',
            'Corrientes débiles y sistemas de emergencia',
            'Programa de mantenimiento'
          ]
        },
        {
          id: 'module8',
          title: 'Seguridad en Puesta a Tierra y Líneas',
          topics: [
            'Puesta a tierra',
            'Seguridad en líneas aéreas y subterráneas'
          ]
        },
        {
          id: 'module9',
          title: 'Rescate por accidente eléctrico',
          topics: [
            'Sistema de emergencia (proteger, avisar, socorrer)',
            'Liberación y evaluación del accidentado'
          ]
        },
        {
          id: 'module10',
          title: 'Verificación y evaluación de conformidad',
          topics: [
            'Unidades de verificación y cumplimiento normativo'
          ]
        }
      ]
    },

    // NOM-027 Corte y Soldadura - REAL DATA
    '67fabd76ed988286dbb4d26d': {
      courseId: '67fabd76ed988286dbb4d26d',
      courseTitle: 'Seguridad en Soldadura y Corte',
      objective: 'Establecer las condiciones de seguridad e higiene necesarias en los centros de trabajo para prevenir riesgos durante las actividades de soldadura y corte, con base en la NOM-027-STPS.',
      methodology: 'Curso online activo, participativo y con enfoque demostrativo. Se utiliza material visual, ejemplos reales y evaluación práctica para asegurar comprensión técnica, actitud preventiva y cumplimiento normativo.',
      evaluation: [
        'Examen teórico online',
        'Participación activa en simulaciones',
        'Control de asistencia digital'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Manual digital descargable',
        'Diploma oficial digital',
        'Constancia DC-3 (STPS)',
        'Reporte de resultados y retroalimentación individual'
      ],
      practicalProgram: [
        'Simulación de análisis de riesgo',
        'Identificación visual de condiciones inseguras',
        'Evaluación de equipo de protección según actividad',
        'Llenado de formatos de permiso de trabajo'
      ],
      technicalRequirements: [
        'Conexión a internet estable',
        'Cámara y micrófono activos',
        'Espacio libre de interrupciones',
        'Participación continua durante toda la sesión'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Introducción a la NOM-027-STPS',
          topics: [
            'Definiciones clave',
            'Obligaciones del patrón y de los trabajadores',
            'Análisis de riesgo potencial',
            'Recomendaciones generales en soldadura y corte'
          ]
        },
        {
          id: 'module2',
          title: 'Fundamentos de soldadura y corte',
          topics: [
            '¿Qué es la soldadura?',
            'Condiciones de seguridad e higiene',
            'Causas comunes de incendios por trabajos en caliente',
            'Medidas de prevención'
          ]
        },
        {
          id: 'module3',
          title: 'Procedimientos de seguridad',
          topics: [
            'Seguridad en talleres de soldadura y corte',
            'Peligros por arco eléctrico, radiación, humos y gases',
            'Peligros eléctricos y mecánicos',
            'Buenas prácticas y tipos de soldadura'
          ]
        },
        {
          id: 'module4',
          title: 'Recomendaciones adicionales',
          topics: [
            'Evitar sobreexposición',
            'Seguridad con esmeril, ruido y temperatura',
            'Revisión de la puesta a tierra'
          ]
        },
        {
          id: 'module5',
          title: 'Equipo de Protección Personal (EPP)',
          topics: [
            'Accidentes comunes por omisión del EPP',
            'Reglas generales para el uso de protección',
            'Procedimientos de rescate en caso de accidente'
          ]
        },
        {
          id: 'module6',
          title: 'Procedimientos y permisos',
          topics: [
            'Elaboración de análisis de riesgo potencial',
            'Instructivo de autorización de trabajo seguro'
          ]
        }
      ]
    },

    // LOTO - Bloqueo y Etiquetado - REAL DATA
    '68016b9bdacd51ff05430029': {
      courseId: '68016b9bdacd51ff05430029',
      courseTitle: 'LOTO – Bloqueo y Etiquetado de Energías Peligrosas',
      objective: 'Capacitar a los participantes en los reglamentos, normatividad vigente (NOM-004-STPS y OSHA 29 CFR 1910.147) y procedimientos específicos para el bloqueo y etiquetado de energías peligrosas, garantizando su correcta aplicación para prevenir accidentes por liberación o activación inesperada de máquinas o equipos.',
      methodology: 'Metodología activa, expositiva y demostrativa, centrada en el aprendizaje aplicado mediante casos, dinámicas virtuales y ejercicios de simulación. Se promueven las competencias cognoscitivas (saber), actitudinales (querer) y psicomotoras (saber hacer), incluso en entornos online.',
      evaluation: [
        'Examen teórico digital',
        'Evaluación participativa con simulación',
        'Registro de asistencia en plataforma'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Manual digital descargable',
        'Diploma oficial digital',
        'Constancia de habilidades DC-3 (STPS)',
        'Reporte de evaluación individual y desempeño'
      ],
      practicalProgram: [
        'Análisis virtual de equipos reales con energías peligrosas',
        'Identificación de puntos críticos: neumática, eléctrica, cinemática',
        'Asignación correcta de dispositivos de aislamiento según tipo y condición',
        'Simulación del proceso completo: desenergizado, bloqueo, etiquetado, verificación de energía cero y restablecimiento operativo'
      ],
      technicalRequirements: [
        'Conexión a internet estable',
        'Dispositivo con cámara y micrófono',
        'Ambiente libre de interrupciones',
        'Participación activa durante las dinámicas y simulaciones'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Introducción al LOTO',
          topics: [
            'Fundamento normativo: NOM-004-STPS y OSHA',
            'Definiciones clave',
            'Clasificación de energías',
            '¿Cuándo se requiere aplicar LOTO?'
          ]
        },
        {
          id: 'module2',
          title: 'Pasos para el control de energías',
          topics: [
            'Preparación para apagar',
            'Apagado y aislamiento de equipos',
            'Colocación de candados y tarjetas'
          ]
        },
        {
          id: 'module3',
          title: 'Métodos y herramientas de control',
          topics: [
            'Tipos de candadeo y etiquetado',
            'Herramientas del sistema LOTO',
            'Control de energías almacenadas',
            'Verificación del aislamiento'
          ]
        },
        {
          id: 'module4',
          title: 'Candadeo y etiquetado',
          topics: [
            'Roles y responsabilidades del personal',
            'Procedimiento completo de bloqueo y desbloqueo',
            'Métodos de aislamiento positivo'
          ]
        }
      ]
    },

    // NOM-033 Espacios Confinados
    '68016bc2dacd51ff0543002f': {
      courseId: '68016bc2dacd51ff0543002f',
      courseTitle: 'Seguridad en Trabajos en Espacios Confinados',
      objective: 'Los participantes conocerán las medidas de seguridad necesarias para trabajar en espacios confinados, así como los procedimientos establecidos en la NOM-033-STPS-2015, con el fin de reducir el riesgo de accidentes.',
      methodology: 'Metodología activa, expositiva y demostrativa, enfocada al desarrollo cognoscitivo, actitudinal y práctico de los participantes mediante dinámicas en tiempo real.',
      evaluation: [
        'Examen teórico interactivo',
        'Evaluación participativa de casos prácticos',
        'Control de asistencia online'
      ],
      includes: [
        'Acceso a sesión en vivo vía Zoom',
        'Manual digital descargable',
        'Constancia DC-3 (STPS) digital',
        'Diploma oficial digital',
        'Reporte de resultados y evaluación por participante'
      ],
      practicalProgram: [
        'Identificación de espacios confinados en planta (aplicación guiada)',
        'Revisión de formatos y permisos internos',
        'Simulación de procedimiento seguro paso a paso',
        'Análisis participativo de atmósferas y peligros'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Introducción a la NOM-033-STPS-2015',
          duration: '2 horas',
          topics: [
            'Generalidades',
            'Obligaciones del patrón',
            'Capacitación obligatoria',
            'Cumplimiento normativo'
          ]
        },
        {
          id: 'module2',
          title: '¿Qué es un Espacio Confinado?',
          duration: '2 horas',
          topics: [
            'Definición y características',
            'Peligros atmosféricos, físicos, químicos y biológicos',
            'Clasificación de espacios confinados',
            'Dinámicas de análisis de riesgos'
          ]
        },
        {
          id: 'module3',
          title: 'Perfil del operador',
          duration: '1 hora',
          topics: [
            'Evaluación ocupacional del operador',
            'Coaching de concientización'
          ]
        },
        {
          id: 'module4',
          title: 'Medidas de Seguridad',
          duration: '3 horas',
          topics: [
            'Procedimientos de trabajo seguro',
            'Equipos de protección personal',
            'Detección de gases y equipos autónomos de respiración',
            'Roles: Entrantes, Asistentes y Supervisores',
            'Plan de rescate y atención a emergencias'
          ]
        }
      ]
    },


    // Default curriculum for courses without specific content
    'default': {
      courseId: 'default',
      courseTitle: 'Curso de Capacitación',
      objective: 'Los participantes adquirirán los conocimientos y habilidades necesarios para aplicar las mejores prácticas en seguridad e higiene industrial.',
      methodology: 'Metodología participativa con enfoque teórico-práctico, incluyendo casos de estudio y ejercicios aplicados.',
      evaluation: [
        'Evaluación teórica',
        'Participación en ejercicios prácticos',
        'Control de asistencia'
      ],
      includes: [
        'Material de estudio digital',
        'Constancia de participación',
        'Acceso a recursos complementarios'
      ],
      modules: [
        {
          id: 'module1',
          title: 'Módulo 1: Introducción y Fundamentos',
          topics: [
            'Conceptos fundamentales',
            'Marco normativo aplicable',
            'Principios básicos',
            'Objetivos del programa'
          ]
        },
        {
          id: 'module2',
          title: 'Módulo 2: Desarrollo de Competencias',
          topics: [
            'Procedimientos estándar',
            'Mejores prácticas',
            'Casos de aplicación',
            'Ejercicios prácticos'
          ]
        },
        {
          id: 'module3',
          title: 'Módulo 3: Implementación',
          topics: [
            'Planificación de implementación',
            'Herramientas de control',
            'Seguimiento y mejora continua',
            'Evaluación de resultados'
          ]
        }
      ]
    }
  };

  constructor() { }

  /**
   * Get curriculum for a specific course
   * @param courseId Course ID
   * @returns Observable of CourseCurriculum
   */
  getCurriculumForCourse(courseId: string): Observable<CourseCurriculum> {
    const curriculum = this.curriculumDatabase[courseId] || this.curriculumDatabase['default'];
    return of(curriculum);
  }

  /**
   * Check if a course has specific curriculum content
   * @param courseId Course ID
   * @returns boolean
   */
  hasCurriculumForCourse(courseId: string): boolean {
    return courseId in this.curriculumDatabase;
  }

  /**
   * Add or update curriculum for a course
   * @param courseId Course ID
   * @param curriculum Curriculum data
   */
  setCurriculumForCourse(courseId: string, curriculum: CourseCurriculum): void {
    this.curriculumDatabase[courseId] = curriculum;
  }

  /**
   * Get all available curriculum course IDs
   * @returns string array of course IDs
   */
  getAvailableCourseIds(): string[] {
    return Object.keys(this.curriculumDatabase).filter(id => id !== 'default');
  }
}