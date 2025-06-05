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
          duration: '4 horas',
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
          duration: '6 horas',
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
          duration: '4 horas',
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