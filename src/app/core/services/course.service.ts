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
  
  constructor(private http: HttpClient) {}
  
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
}
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Auditor Líder ISO 45001:2018',
    subtitle: 'Sistemas de Gestión de Seguridad y Salud en el Trabajo',
    description: 'Este curso proporciona los conocimientos y habilidades necesarios para realizar auditorías de sistemas de gestión de seguridad y salud en el trabajo según la norma ISO 45001:2018. Aprenderá a planificar, ejecutar y reportar auditorías de forma efectiva, identificando no conformidades y oportunidades de mejora.',
    category: 'Certificación ISO',
    price: 4500,
    duration: '40 horas',
    isoStandards: ['ISO 45001:2018'],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample1',
    imageUrl: 'assets/images/courses/iso-45001.jpg',
    featured: true,
    nextDate: new Date('2025-04-15'),
    instructor: {
      id: '1',
      name: 'Hector Marin',
      photoUrl: 'assets/images/instructors/hector-marin.jpg',
      bio: 'Auditor líder certificado con más de 15 años de experiencia en sistemas de gestión de seguridad industrial.',
      specialties: ['ISO 45001', 'Seguridad Industrial', 'Gestión de Riesgos']
    },
    availableDates: [
      new Date('2025-04-15'),
      new Date('2025-05-10'),
      new Date('2025-06-05')
    ]
  },
  {
    id: '2',
    title: 'Auditor Interno ISO 14001:2015',
    subtitle: 'Sistemas de Gestión Ambiental',
    description: 'Desarrolle competencias para auditar sistemas de gestión ambiental según la norma ISO 14001:2015. Este curso le permitirá comprender los requisitos de la norma, aplicar métodos de auditoría y evaluar la conformidad de los sistemas implementados en su organización.',
    category: 'Gestión Ambiental',
    price: 3800,
    duration: '24 horas',
    isoStandards: ['ISO 14001:2015'],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample2',
    imageUrl: 'assets/images/courses/iso-14001.jpg',
    featured: false,
    nextDate: new Date('2025-04-22'),
    instructor: {
      id: '2',
      name: 'Laura Sánchez',
      photoUrl: 'assets/images/instructors/laura-sanchez.jpg',
      bio: 'Consultora ambiental con experiencia en implementación de sistemas de gestión en más de 50 empresas.',
      specialties: ['ISO 14001', 'Gestión Ambiental', 'Economía Circular']
    },
    availableDates: [
      new Date('2025-04-22'),
      new Date('2025-05-18'),
      new Date('2025-06-20')
    ]
  },
  {
    id: '3',
    title: 'Formación de Brigadas de Emergencia',
    subtitle: 'Capacitación práctica para respuesta a emergencias',
    description: 'Forme brigadas competentes para atender emergencias en su centro de trabajo. Este curso incluye módulos prácticos de primeros auxilios, combate contra incendios, evacuación y rescate, proporcionando herramientas esenciales para salvaguardar la integridad del personal.',
    category: 'Seguridad Industrial',
    price: 2800,
    duration: '16 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample3',
    imageUrl: 'assets/images/courses/brigadas.jpg',
    featured: true,
    nextDate: new Date('2025-04-10'),
    instructor: {
      id: '3',
      name: 'Carlos Mendoza',
      photoUrl: 'assets/images/instructors/carlos-mendoza.jpg',
      bio: 'Ex comandante de bomberos con especialidad en rescate industrial y más de 20 años de experiencia en campo.',
      specialties: ['Contraincendios', 'Rescate', 'Primeros Auxilios']
    },
    availableDates: [
      new Date('2025-04-10'),
      new Date('2025-04-24'),
      new Date('2025-05-08'),
      new Date('2025-05-22')
    ]
  },
  {
    id: '4',
    title: 'Gestión de Equipos de Alto Rendimiento',
    subtitle: 'Liderazgo efectivo para la seguridad industrial',
    description: 'Aprenda a desarrollar y gestionar equipos enfocados en la seguridad industrial. Este programa proporciona herramientas prácticas para potenciar el liderazgo, la comunicación efectiva y la resolución de conflictos, creando una cultura organizacional centrada en la seguridad.',
    category: 'Liderazgo',
    price: 3200,
    duration: '20 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample4',
    imageUrl: 'assets/images/courses/liderazgo.jpg',
    featured: true,
    nextDate: new Date('2025-04-18'),
    instructor: {
      id: '4',
      name: 'Elena Ramírez',
      photoUrl: 'assets/images/instructors/liderazgo.jpg.jpg',
      bio: 'Especialista en desarrollo organizacional con enfoque en seguridad industrial y certificación en metodología LEGO SiriusPlay.',
      specialties: ['Liderazgo', 'Cultura Organizacional', 'Gestión del Cambio']
    },
    availableDates: [
      new Date('2025-04-18'),
      new Date('2025-05-16'),
      new Date('2025-06-13')
    ]
  },
  {
    id: '5',
    title: 'NOM-035-STPS-2018: Implementación Efectiva',
    subtitle: 'Factores de riesgo psicosocial en el trabajo',
    description: 'Conozca los requisitos de la NOM-035-STPS-2018 y desarrolle estrategias para su implementación efectiva. Este curso aborda la identificación, análisis y prevención de factores de riesgo psicosocial, así como la promoción de entornos organizacionales favorables.',
    category: 'Seguridad Industrial',
    price: 2500,
    duration: '16 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample5',
    imageUrl: 'assets/images/courses/nom-035.jpg',
    featured: false,
    nextDate: new Date('2025-04-25'),
    instructor: {
      id: '5',
      name: 'Roberto Vázquez',
      photoUrl: 'assets/images/instructors/roberto-vazquez.jpg',
      bio: 'Psicólogo industrial con especialidad en factores psicosociales y experiencia como consultor para más de 100 empresas.',
      specialties: ['NOM-035', 'Factores Psicosociales', 'Clima Laboral']
    },
    availableDates: [
      new Date('2025-04-25'),
      new Date('2025-05-23'),
      new Date('2025-06-27')
    ]
  },
  {
    id: '6',
    title: 'Auditor Líder ISO 9001:2015',
    subtitle: 'Sistemas de Gestión de Calidad',
    description: 'Desarrolle competencias para liderar auditorías de sistemas de gestión de calidad según la norma ISO 9001:2015. Este curso proporciona los conocimientos y habilidades necesarios para planificar, ejecutar y dar seguimiento a auditorías, asegurando la mejora continua de los procesos.',
    category: 'Certificación ISO',
    price: 4200,
    duration: '40 horas',
    isoStandards: ['ISO 9001:2015'],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample6',
    imageUrl: 'assets/images/courses/iso-9001.jpg',
    featured: true,
    nextDate: new Date('2025-05-06'),
    instructor: {
      id: '6',
      name: 'Patricia Morales',
      photoUrl: 'assets/images/instructors/liderazgo.jpg',
      bio: 'Consultora de calidad con más de 18 años implementando sistemas de gestión en empresas nacionales e internacionales.',
      specialties: ['ISO 9001', 'Gestión de Calidad', 'Auditorías']
    },
    availableDates: [
      new Date('2025-05-06'),
      new Date('2025-06-10'),
      new Date('2025-07-08')
    ]
  },
  {
    id: '7',
    title: 'Manejo Seguro de Sustancias Químicas',
    subtitle: 'Prevención de riesgos en operaciones químicas',
    description: 'Aprenda a identificar, evaluar y controlar los riesgos asociados al manejo de sustancias químicas. Este curso aborda la clasificación, etiquetado, almacenamiento y transporte seguro, así como la respuesta a emergencias químicas, cumpliendo con normativas nacionales e internacionales.',
    category: 'Seguridad Industrial',
    price: 3000,
    duration: '24 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample7',
    imageUrl: 'assets/images/courses/quimicos.jpg',
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
    id: '8',
    title: 'Gestión Integral de Residuos',
    subtitle: 'Estrategias ambientales para empresas',
    description: 'Desarrolle un plan integral para la gestión de residuos en su organización. Este curso brinda herramientas para la clasificación, manejo, tratamiento y disposición final de residuos, promoviendo prácticas sustentables alineadas con la legislación ambiental vigente.',
    category: 'Gestión Ambiental',
    price: 2800,
    duration: '16 horas',
    isoStandards: [],
    previewVideoUrl: 'https://www.youtube.com/watch?v=sample8',
    imageUrl: 'assets/images/courses/residuos.jpg',
    featured: false,
    nextDate: new Date('2025-05-20'),
    instructor: {
      id: '2',
      name: 'Laura Sánchez',
      photoUrl: 'assets/images/instructors/liderazgo.jpg.jpg',
      bio: 'Consultora ambiental con experiencia en implementación de sistemas de gestión en más de 50 empresas.',
      specialties: ['ISO 14001', 'Gestión Ambiental', 'Economía Circular']
    },
    availableDates: [
      new Date('2025-05-20'),
      new Date('2025-06-24'),
      new Date('2025-07-22')
    ]
  }
];