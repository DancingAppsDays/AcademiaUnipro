// course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Course[]>('getAllCourses', []))
      );
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Course>('getCourseById'))
      );
  }

  getCoursesByCategory(category: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/category/${category}`)
      .pipe(
        catchError(this.handleError<Course[]>('getCoursesByCategory', []))
      );
  }

  // Fallback method that returns mock data
  getMockCourses(): Observable<Course[]> {
    return of(MOCK_COURSES);
  }

  private getMockCourseById(id: string): Course | undefined {
    return MOCK_COURSES.find(course => course.id === id);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
} const MOCK_COURSES: Course[] = [
  // Normativas Clave category
  {
    id: '1',
    title: 'NOM-004-STPS: Maquinaria y Equipo',
    subtitle: 'Cumplimiento normativo para equipos industriales',
    description: 'Este curso proporciona los conocimientos necesarios para cumplir con la NOM-004-STPS relacionada con los sistemas de protección y dispositivos de seguridad en maquinaria y equipo. Aprenderá a identificar los riesgos, implementar medidas preventivas y establecer procedimientos de seguridad adecuados.',
    category: 'Normativas Clave',
    price: 3200,
    duration: '16 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample1',
    imageUrl: 'assets/images/courses/nom-004.jpg',
    featured: true,
    nextDate: new Date('2025-04-15'),
    instructor: {
      id: '1',
      name: 'Roberto Vázquez',
      photoUrl: 'assets/images/instructors/prof2.png',
      bio: 'Ingeniero industrial con más de 12 años de experiencia en seguridad industrial y cumplimiento normativo.',
      specialties: ['Normatividad STPS', 'Seguridad Industrial', 'Gestión de Riesgos']
    },
    availableDates: [
      new Date('2025-04-15'),
      new Date('2025-05-10'),
      new Date('2025-06-05')
    ]
  },
  {
    id: '2',
    title: 'NOM-018-STPS: Sistema Globalmente Armonizado',
    subtitle: 'Identificación y comunicación de peligros por sustancias químicas',
    description: 'Aprenda a implementar el Sistema Globalmente Armonizado (SGA) para la identificación y comunicación de peligros por sustancias químicas peligrosas según la NOM-018-STPS. Este curso aborda la clasificación de sustancias, etiquetado, hojas de datos de seguridad y capacitación del personal.',
    category: 'Normativas Clave',
    price: 2800,
    duration: '16 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample2',
    imageUrl: 'assets/images/courses/nom-018.jpg',
    featured: false,
    nextDate: new Date('2025-04-22'),
    instructor: {
      id: '7',
      name: 'Javier Torres',
      photoUrl: 'assets/images/instructors/prof3.png',
      bio: 'Ingeniero químico con especialidad en seguridad de procesos y certificaciones internacionales en manejo de materiales peligrosos.',
      specialties: ['Materiales Peligrosos', 'Sistema Globalmente Armonizado', 'Control de Derrames']
    },
    availableDates: [
      new Date('2025-04-22'),
      new Date('2025-05-18'),
      new Date('2025-06-20')
    ]
  },
  {
    id: '3',
    title: 'NOM-027-STPS: Corte y Soldadura',
    subtitle: 'Seguridad en trabajos de soldadura y corte',
    description: 'Este curso aborda los requisitos de seguridad para prevenir riesgos en las operaciones de soldadura y corte conforme a la NOM-027-STPS. Aprenderá a implementar medidas preventivas, controles de seguridad y procedimientos de trabajo seguro para trabajos en caliente.',
    category: 'Normativas Clave',
    price: 2600,
    duration: '16 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample3',
    imageUrl: 'assets/images/courses/nom-027.jpg',
    featured: false,
    nextDate: new Date('2025-04-18'),
    instructor: {
      id: '3',
      name: 'Carlos Mendoza',
      photoUrl: 'assets/images/instructors/prof3.png',
      bio: 'Especialista en seguridad industrial con amplia experiencia en procesos de soldadura y trabajos en caliente.',
      specialties: ['Trabajos en Caliente', 'Soldadura', 'Prevención de Incendios']
    },
    availableDates: [
      new Date('2025-04-18'),
      new Date('2025-05-15'),
      new Date('2025-06-12')
    ]
  },
  {
    id: '4',
    title: 'NOM-029-STPS: Instalaciones Eléctricas',
    subtitle: 'Seguridad en mantenimiento de instalaciones eléctricas',
    description: 'Conozca los requisitos de seguridad para realizar actividades de mantenimiento en instalaciones eléctricas según la NOM-029-STPS. Este curso cubre la identificación de peligros, evaluación de riesgos, medidas preventivas y procedimientos de trabajo seguro con electricidad.',
    category: 'Normativas Clave',
    price: 3000,
    duration: '24 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample4',
    imageUrl: 'assets/images/courses/nom-029.jpg',
    featured: true,
    nextDate: new Date('2025-04-25'),
    instructor: {
      id: '8',
      name: 'Eduardo Ramírez',
      photoUrl: 'assets/images/instructors/prof1.png',
      bio: 'Ingeniero eléctrico certificado con más de 15 años de experiencia en seguridad eléctrica industrial.',
      specialties: ['Seguridad Eléctrica', 'Instalaciones Eléctricas', 'Normatividad']
    },
    availableDates: [
      new Date('2025-04-25'),
      new Date('2025-05-20'),
      new Date('2025-06-15')
    ]
  },

  // Seguridad Especializada category
  {
    id: '5',
    title: 'Bloqueo de Energía LOTO',
    subtitle: 'Procedimientos de bloqueo y etiquetado de energías peligrosas',
    description: 'Desarrolle e implemente un programa efectivo de Control de Energías Peligrosas (LOTO) en su organización. Este curso proporciona los conocimientos para establecer procedimientos de bloqueo/etiquetado, seleccionar dispositivos adecuados y cumplir con los requerimientos normativos aplicables.',
    category: 'Seguridad Especializada',
    price: 2500,
    duration: '16 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample5',
    imageUrl: 'assets/images/courses/montacargas.jpg',
    featured: true,
    nextDate: new Date('2025-04-10'),
    instructor: {
      id: '1',
      name: 'Roberto Vázquez',
      photoUrl: 'assets/images/instructors/prof3.png',
      bio: 'Ingeniero industrial con más de 12 años de experiencia en seguridad industrial y cumplimiento normativo.',
      specialties: ['Control de Energías', 'LOTO', 'Seguridad en Mantenimiento']
    },
    availableDates: [
      new Date('2025-04-10'),
      new Date('2025-05-08'),
      new Date('2025-06-10')
    ]
  },
  {
    id: '6',
    title: 'Manejo de Sustancias Químicas',
    subtitle: 'Prevención de riesgos en operaciones con productos químicos',
    description: 'Aprenda a identificar, evaluar y controlar los riesgos asociados al manejo de sustancias químicas. Este curso aborda la clasificación, etiquetado, almacenamiento y transporte seguro, así como la respuesta a emergencias químicas, cumpliendo con normativas nacionales e internacionales.',
    category: 'Seguridad Especializada',
    price: 3000,
    duration: '24 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample6',
    imageUrl: 'assets/images/courses/successful.jpg',
    featured: false,
    nextDate: new Date('2025-05-13'),
    instructor: {
      id: '7',
      name: 'Javier Torres',
      photoUrl: 'assets/images/instructors/javier-torres.jpg',
      bio: 'Ingeniero químico con especialidad en seguridad de procesos y certificaciones internacionales en manejo de materiales peligrosos.',
      specialties: ['Materiales Peligrosos', 'Sistema Globalmente Armonizado', 'Control de Derrames']
    },
    availableDates: [
      new Date('2025-05-13'),
      new Date('2025-06-17'),
      new Date('2025-07-15')
    ]
  },
  {
    id: '7',
    title: 'Manejo de Residuos Peligrosos',
    subtitle: 'Gestión segura y cumplimiento ambiental',
    description: 'Conozca la normativa aplicable y las mejores prácticas para la gestión integral de residuos peligrosos. Este curso cubre la identificación, clasificación, manejo, almacenamiento, transporte y disposición final de residuos peligrosos, así como las responsabilidades legales de los generadores.',
    category: 'Seguridad Especializada',
    price: 2800,
    duration: '16 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample7',
    imageUrl: 'assets/images/courses/legos.png',
    featured: false,
    nextDate: new Date('2025-04-20'),
    instructor: {
      id: '2',
      name: 'Laura Sánchez',
      photoUrl: 'assets/images/instructors/laura-sanchez.jpg',
      bio: 'Consultora ambiental con experiencia en implementación de sistemas de gestión en más de 50 empresas.',
      specialties: ['Gestión Ambiental', 'Residuos Peligrosos', 'Cumplimiento Legal']
    },
    availableDates: [
      new Date('2025-04-20'),
      new Date('2025-05-25'),
      new Date('2025-06-22')
    ]
  },
  {
    id: '8',
    title: 'NOM-033-STPS: Espacios Confinados',
    subtitle: 'Seguridad en trabajos en espacios confinados',
    description: 'Desarrolle las competencias necesarias para implementar un programa de seguridad en espacios confinados según la NOM-033-STPS. Este curso aborda la identificación de peligros, evaluación de riesgos, medidas preventivas, permisos de trabajo, monitoreo atmosférico y procedimientos de emergencia.',
    category: 'Seguridad Especializada',
    price: 3200,
    duration: '24 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample8',
    imageUrl: 'assets/images/courses/iso14000.jpg',
    featured: true,
    nextDate: new Date('2025-04-15'),
    instructor: {
      id: '3',
      name: 'Carlos Mendoza',
      photoUrl: 'assets/images/instructors/carlos-mendoza.jpg',
      bio: 'Ex comandante de bomberos con especialidad en rescate industrial y más de 20 años de experiencia en campo.',
      specialties: ['Espacios Confinados', 'Rescate Industrial', 'Análisis de Riesgos']
    },
    availableDates: [
      new Date('2025-04-15'),
      new Date('2025-05-12'),
      new Date('2025-06-18')
    ]
  },

  // Protección y Prevención category
  {
    id: '9',
    title: 'NOM-011-STPS: Ruido',
    subtitle: 'Control y prevención de riesgos por exposición a ruido',
    description: 'Este curso proporciona los conocimientos necesarios para identificar, evaluar y controlar la exposición ocupacional al ruido conforme a la NOM-011-STPS. Aprenderá a realizar monitoreos, implementar medidas de control y establecer un programa de conservación auditiva efectivo.',
    category: 'Protección y Prevención',
    price: 2400,
    duration: '16 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample9',
    imageUrl: 'assets/images/courses/nom-011.jpg',
    featured: false,
    nextDate: new Date('2025-04-28'),
    instructor: {
      id: '9',
      name: 'Ana Martínez',
      photoUrl: 'assets/images/instructors/ana-martinez.jpg',
      bio: 'Especialista en higiene industrial con amplia experiencia en evaluación y control de agentes físicos en el ambiente laboral.',
      specialties: ['Higiene Industrial', 'Agentes Físicos', 'Salud Ocupacional']
    },
    availableDates: [
      new Date('2025-04-28'),
      new Date('2025-05-26'),
      new Date('2025-06-23')
    ]
  },
  {
    id: '10',
    title: 'NOM-017-STPS: EPP',
    subtitle: 'Selección, uso y mantenimiento de equipo de protección personal',
    description: 'Conozca los requisitos para la selección, uso y mantenimiento del equipo de protección personal según la NOM-017-STPS. Este curso aborda la identificación de riesgos, selección adecuada de EPP, programas de capacitación y verificación de su uso correcto.',
    category: 'Protección y Prevención',
    price: 2200,
    duration: '8 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample10',
    imageUrl: 'assets/images/courses/nom-017.jpg',
    featured: true,
    nextDate: new Date('2025-04-12'),
    instructor: {
      id: '5',
      name: 'Héctor Marin',
      photoUrl: 'assets/images/instructors/hector-marin.jpg',
      bio: 'Consultor en seguridad industrial con especialidad en equipo de protección personal y análisis de riesgos.',
      specialties: ['EPP', 'Análisis de Riesgos', 'Normatividad STPS']
    },
    availableDates: [
      new Date('2025-04-12'),
      new Date('2025-04-26'),
      new Date('2025-05-10'),
      new Date('2025-05-24')
    ]
  },
  {
    id: '11',
    title: 'NOM-019-STPS: Comisión de Seguridad',
    subtitle: 'Constitución y funcionamiento de comisiones de seguridad e higiene',
    description: 'Aprenda a constituir, integrar y operar adecuadamente las comisiones de seguridad e higiene en los centros de trabajo según la NOM-019-STPS. Este curso brinda herramientas para realizar verificaciones efectivas, identificar riesgos y proponer medidas preventivas y correctivas.',
    category: 'Protección y Prevención',
    price: 2000,
    duration: '8 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample11',
    imageUrl: 'assets/images/courses/legos.png',
    featured: false,
    nextDate: new Date('2025-04-19'),
    instructor: {
      id: '1',
      name: 'Roberto Vázquez',
      photoUrl: 'assets/images/instructors/roberto-vazquez.jpg',
      bio: 'Ingeniero industrial con más de 12 años de experiencia en seguridad industrial y cumplimiento normativo.',
      specialties: ['Normatividad STPS', 'Seguridad Industrial', 'Gestión de Riesgos']
    },
    availableDates: [
      new Date('2025-04-19'),
      new Date('2025-05-17'),
      new Date('2025-06-14')
    ]
  },
  {
    id: '12',
    title: 'NOM-025-STPS: Iluminación',
    subtitle: 'Condiciones de iluminación en centros de trabajo',
    description: 'Este curso aborda los requisitos de iluminación en los centros de trabajo según la NOM-025-STPS. Aprenderá a realizar evaluaciones, implementar medidas de control y diseñar sistemas de iluminación adecuados para las diferentes áreas y actividades laborales.',
    category: 'Protección y Prevención',
    price: 2200,
    duration: '16 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample12',
    imageUrl: 'assets/images/courses/lideres.jpg',
    featured: false,
    nextDate: new Date('2025-05-05'),
    instructor: {
      id: '9',
      name: 'Ana Martínez',
      photoUrl: 'assets/images/instructors/ana-martinez.jpg',
      bio: 'Especialista en higiene industrial con amplia experiencia en evaluación y control de agentes físicos en el ambiente laboral.',
      specialties: ['Higiene Industrial', 'Agentes Físicos', 'Salud Ocupacional']
    },
    availableDates: [
      new Date('2025-05-05'),
      new Date('2025-06-02'),
      new Date('2025-07-07')
    ]
  },
  {
    id: '13',
    title: 'NOM-026-STPS: Señalización',
    subtitle: 'Colores y señales de seguridad e identificación de riesgos',
    description: 'Conozca los requisitos para la señalización de seguridad e identificación de riesgos según la NOM-026-STPS. Este curso cubre los colores, formas, símbolos y dimensiones de las señales, así como su aplicación en los diferentes entornos laborales.',
    category: 'Protección y Prevención',
    price: 2000,
    duration: '8 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample13',
    imageUrl: 'assets/images/courses/nom-026.jpg',
    featured: false,
    nextDate: new Date('2025-04-05'),
    instructor: {
      id: '5',
      name: 'Héctor Marin',
      photoUrl: 'assets/images/instructors/hector-marin.jpg',
      bio: 'Consultor en seguridad industrial con especialidad en equipo de protección personal y análisis de riesgos.',
      specialties: ['Señalización', 'Seguridad Industrial', 'Normatividad STPS']
    },
    availableDates: [
      new Date('2025-04-05'),
      new Date('2025-05-03'),
      new Date('2025-06-07')
    ]
  },

  // Calidad category (from second image)
  {
    id: '14',
    title: 'AMEF (Análisis de Modo y Efecto de Falla)',
    subtitle: 'Metodología para identificación y prevención de fallos',
    description: 'Aprenda a aplicar la metodología AMEF para identificar y prevenir fallos potenciales en productos y procesos. Este curso proporciona herramientas para evaluar riesgos, priorizar acciones correctivas y mejorar la confiabilidad de los sistemas.',
    category: 'Calidad',
    price: 3200,
    duration: '16 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample14',
    imageUrl: 'assets/images/courses/amef.jpg',
    featured: true,
    nextDate: new Date('2025-04-08'),
    instructor: {
      id: '6',
      name: 'Patricia Morales',
      photoUrl: 'assets/images/instructors/patricia-morales.jpg',
      bio: 'Consultora de calidad con más de 18 años implementando sistemas de gestión en empresas nacionales e internacionales.',
      specialties: ['Calidad', 'Core Tools', 'Mejora de Procesos']
    },
    availableDates: [
      new Date('2025-04-08'),
      new Date('2025-05-06'),
      new Date('2025-06-03')
    ]
  },
  {
    id: '15',
    title: 'SPC (Control Estadístico de Procesos)',
    subtitle: 'Técnicas estadísticas para control y mejora de procesos',
    description: 'Desarrolle competencias para implementar el Control Estadístico de Procesos (SPC) en su organización. Este curso cubre los conceptos fundamentales de variación, gráficos de control, estudios de capacidad y estrategias para la mejora continua de sus procesos.',
    category: 'Calidad',
    price: 3000,
    duration: '24 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample15',
    imageUrl: 'assets/images/courses/lideres.jpg',
    featured: false,
    nextDate: new Date('2025-04-29'),
    instructor: {
      id: '6',
      name: 'Patricia Morales',
      photoUrl: 'assets/images/instructors/patricia-morales.jpg',
      bio: 'Consultora de calidad con más de 18 años implementando sistemas de gestión en empresas nacionales e internacionales.',
      specialties: ['Calidad', 'Core Tools', 'Mejora de Procesos']
    },
    availableDates: [
      new Date('2025-04-29'),
      new Date('2025-05-27'),
      new Date('2025-06-24')
    ]
  },

  // Desarrollo Profesional category (from second image)
  {
    id: '16',
    title: 'Formación de Instructores',
    subtitle: 'Desarrollo de habilidades para capacitación efectiva',
    description: 'Desarrolle las competencias necesarias para diseñar e impartir cursos de capacitación efectivos. Este programa aborda técnicas didácticas, manejo de grupos, elaboración de materiales y evaluación del aprendizaje, con enfoque en la capacitación técnica industrial.',
    category: 'Desarrollo Profesional',
    price: 3500,
    duration: '24 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample16',
    imageUrl: 'assets/images/courses/brigadas.jpg',
    featured: true,
    nextDate: new Date('2025-04-14'),
    instructor: {
      id: '4',
      name: 'Elena Ramírez',
      photoUrl: 'assets/images/instructors/prof1.png',
      bio: 'Especialista en desarrollo organizacional con enfoque en seguridad industrial y certificación en metodologías de aprendizaje.',
      specialties: ['Capacitación', 'Desarrollo Organizacional', 'Seguridad Industrial']
    },
    availableDates: [
      new Date('2025-04-14'),
      new Date('2025-05-12'),
      new Date('2025-06-09')
    ]
  },
  {
    id: '17',
    title: 'Supervisores de Seguridad',
    subtitle: 'Liderazgo efectivo para la seguridad industrial',
    description: 'Fortalezca las competencias de supervisión en materia de seguridad industrial. Este curso aborda las responsabilidades legales, técnicas de identificación de riesgos, gestión del cumplimiento normativo y estrategias de liderazgo para promover una cultura de seguridad.',
    category: 'Desarrollo Profesional',
    price: 3200,
    duration: '24 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample17',
    imageUrl: 'assets/images/courses/brigadas.jpg',
    featured: false,
    nextDate: new Date('2025-04-21'),
    instructor: {
      id: '5',
      name: 'Héctor Marin',
      photoUrl: 'assets/images/instructors/prof1.png.jpg',
      bio: 'Consultor en seguridad industrial con especialidad en equipo de protección personal y análisis de riesgos.',
      specialties: ['Liderazgo', 'Supervisión', 'Cultura de Seguridad']
    },
    availableDates: [
      new Date('2025-04-21'),
      new Date('2025-05-19'),
      new Date('2025-06-16')
    ]
  }
];