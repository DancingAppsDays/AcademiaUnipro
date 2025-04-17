// src/app/core/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;
  private mockDataEnabled = true; // Toggle this based on whether mock data should be used as fallback

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    console.log('Attempting to fetch courses from API:', this.apiUrl);
    
    return this.http.get<Course[]>(this.apiUrl).pipe(
      tap(courses => console.log('Fetched courses from API:', courses)),
      catchError(error => this.handleApiError('getAllCourses', error))
    );
  }

  getCourseById(id: string): Observable<Course> {
    console.log(`Attempting to fetch course ${id} from API`);
    
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      tap(course => console.log(`Fetched course ${id} from API:`, course)),
      catchError(error => this.handleApiError('getCourseById', error, id))
    );
  }

  getCoursesByCategory(category: string): Observable<Course[]> {
    console.log(`Attempting to fetch courses in category ${category} from API`);
    
    return this.http.get<Course[]>(`${this.apiUrl}/category/${category}`).pipe(
      tap(courses => console.log(`Fetched ${courses.length} courses in category ${category} from API`)),
      catchError(error => this.handleApiError('getCoursesByCategory', error, category))
    );
  }

  getFeaturedCourses(): Observable<Course[]> {
    console.log('Attempting to fetch featured courses from API');
    
    return this.http.get<Course[]>(`${this.apiUrl}/featured`).pipe(
      tap(courses => console.log(`Fetched ${courses.length} featured courses from API`)),
      catchError(error => this.handleApiError('getFeaturedCourses', error))
    );
  }

  // This method handles API errors and falls back to mock data when appropriate
  private handleApiError(operation: string, error: HttpErrorResponse, param?: string): Observable<any> {
    console.error(`Error in ${operation}${param ? ` with param ${param}` : ''}:`, error);
    
    // Only use mock data as fallback if enabled
    if (!this.mockDataEnabled) {
      return throwError(() => error);
    }
    
    console.log(`Falling back to mock data for ${operation}`);
    
    // Provide appropriate mock data based on the operation
    switch (operation) {
      case 'getAllCourses':
        return this.getMockCourses();
      
      case 'getCourseById':
        const mockCourse = this.findMockCourseById(param as string);
        return mockCourse ? of(mockCourse) : throwError(() => new Error('Course not found in mock data'));
      
      case 'getCoursesByCategory':
        return of(MOCK_COURSES.filter(c => c.category === param));
      
      case 'getFeaturedCourses':
        return of(MOCK_COURSES.filter(c => c.featured));
      
      default:
        return throwError(() => new Error('Unknown operation'));
    }
  }

  // This method directly returns mock data without HTTP request
  getMockCourses(): Observable<Course[]> {
    console.log('Returning all mock courses');
    return of([...MOCK_COURSES]); // Return a copy to prevent modifications
  }

  // Find a specific mock course by ID
  private findMockCourseById(id: string): Course | undefined {
    console.log(`Looking for mock course with ID: ${id}`);
    return MOCK_COURSES.find(course => course._id === id);
  }
}

// Mock data is kept at the end of the file for reference
const MOCK_COURSES: Course[] = [
  // Normativas Clave category
  // {
  //   id: '1',
  //   title: 'NOM-004-STPS: Maquinaria y Equipo',
  //   subtitle: 'Cumplimiento normativo para equipos industriales',
  //   description: 'Este curso proporciona los conocimientos necesarios para cumplir con la NOM-004-STPS relacionada con los sistemas de protección y dispositivos de seguridad en maquinaria y equipo. Aprenderá a identificar los riesgos, implementar medidas preventivas y establecer procedimientos de seguridad adecuados.',
  //   category: 'Normativas Clave',
  //   price: 3200,
  //   duration: '16 horas',
  //   isoStandards: [],
  //   previewVideoUrl: 'https://www.youtube.com/embed/evT-E8LtsQo',
  //   imageUrl: 'assets/images/courses/lideres.jpg',
  //   featured: true,
  //   nextDate: new Date('2025-04-15'),
  //   instructor: {
  //     id: '1',
  //     name: 'Roberto Vázquez',
  //     photoUrl: 'assets/images/instructors/prof2.png',
  //     bio: 'Ingeniero industrial con más de 12 años de experiencia en seguridad industrial y cumplimiento normativo.',
  //     specialties: ['Normatividad STPS', 'Seguridad Industrial', 'Gestión de Riesgos']
  //   },
  //   availableDates: [
  //     new Date('2025-04-15'),
  //     new Date('2025-05-10'),
  //     new Date('2025-06-05')
  //   ],
  //   postponementPolicy: {
  //     minimumRequired: 6,
  //     deadlineDays: 2,
  //     message: 'Este curso requiere un mínimo de 6 participantes para realizarse en la fecha programada.'
  //   }
  // },
  // // Additional mock courses as needed...
  // {
  //   id: '2',
  //   title: 'NOM-018-STPS: Sistema Globalmente Armonizado',
  //   subtitle: 'Identificación y comunicación de peligros por sustancias químicas',
  //   description: 'Aprenda a implementar el Sistema Globalmente Armonizado (SGA) para la identificación y comunicación de peligros por sustancias químicas peligrosas según la NOM-018-STPS. Este curso aborda la clasificación de sustancias, etiquetado, hojas de datos de seguridad y capacitación del personal.',
  //   category: 'Normativas Clave',
  //   price: 2800,
  //   duration: '16 horas',
  //   isoStandards: [],
  //   previewVideoUrl: 'https://www.youtube.com/embed/evT-E8LtsQo',
  //   imageUrl: 'assets/images/courses/002.jpg',
  //   featured: false,
  //   nextDate: new Date('2025-04-22'),
  //   instructor: {
  //     id: '7',
  //     name: 'Javier Torres',
  //     photoUrl: 'assets/images/instructors/prof3.png',
  //     bio: 'Ingeniero químico con especialidad en seguridad de procesos y certificaciones internacionales en manejo de materiales peligrosos.',
  //     specialties: ['Materiales Peligrosos', 'Sistema Globalmente Armonizado', 'Control de Derrames']
  //   },
  //   availableDates: [
  //     new Date('2025-04-22'),
  //     new Date('2025-05-18'),
  //     new Date('2025-06-20')
  //   ],
  //   postponementPolicy: {
  //     minimumRequired: 6,
  //     deadlineDays: 2,
  //     message: 'Este curso requiere un mínimo de 6 participantes para realizarse en la fecha programada.'
  //   }
  // },
  // {
  //   id: '3',
  //   title: 'NOM-027-STPS: Corte y Soldadura',
  //   subtitle: 'Seguridad en trabajos de soldadura y corte',
  //   description: 'Este curso aborda los requisitos de seguridad para prevenir riesgos en las operaciones de soldadura y corte conforme a la NOM-027-STPS. Aprenderá a implementar medidas preventivas, controles de seguridad y procedimientos de trabajo seguro para trabajos en caliente.',
  //   category: 'Normativas Clave',
  //   price: 2600,
  //   duration: '16 horas',
  //   isoStandards: [],
  //   previewVideoUrl: 'https://www.youtube.com/embed/evT-E8LtsQo',
  //   imageUrl: 'assets/images/courses/003.jpg',
  //   featured: false,
  //   nextDate: new Date('2025-04-18'),
  //   instructor: {
  //     id: '3',
  //     name: 'Carlos Mendoza',
  //     photoUrl: 'assets/images/instructors/prof3.png',
  //     bio: 'Especialista en seguridad industrial con amplia experiencia en procesos de soldadura y trabajos en caliente.',
  //     specialties: ['Trabajos en Caliente', 'Soldadura', 'Prevención de Incendios']
  //   },
  //   availableDates: [
  //     new Date('2025-04-18'),
  //     new Date('2025-05-15'),
  //     new Date('2025-06-12')
  //   ]
  // },
  // {
  //   id: '4',
  //   title: 'NOM-029-STPS: Instalaciones Eléctricas',
  //   subtitle: 'Seguridad en mantenimiento de instalaciones eléctricas',
  //   description: 'Conozca los requisitos de seguridad para realizar actividades de mantenimiento en instalaciones eléctricas según la NOM-029-STPS. Este curso cubre la identificación de peligros, evaluación de riesgos, medidas preventivas y procedimientos de trabajo seguro con electricidad.',
  //   category: 'Normativas Clave',
  //   price: 3000,
  //   duration: '24 horas',
  //   isoStandards: [],
  //   previewVideoUrl: 'https://www.youtube.com/embed/evT-E8LtsQo',
  //   imageUrl: 'assets/images/courses/001.jpg',
  //   featured: true,
  //   nextDate: new Date('2025-04-25'),
  //   instructor: {
  //     id: '8',
  //     name: 'Eduardo Ramírez',
  //     photoUrl: 'assets/images/instructors/prof1.png',
  //     bio: 'Ingeniero eléctrico certificado con más de 15 años de experiencia en seguridad eléctrica industrial.',
  //     specialties: ['Seguridad Eléctrica', 'Instalaciones Eléctricas', 'Normatividad']
  //   },
  //   availableDates: [
  //     new Date('2025-04-25'),
  //     new Date('2025-05-20'),
  //     new Date('2025-06-15')
  //   ]
  // },
  // {
  //   id: '5',
  //   title: 'Bloqueo de Energía LOTO',
  //   subtitle: 'Procedimientos de bloqueo y etiquetado de energías peligrosas',
  //   description: 'Desarrolle e implemente un programa efectivo de Control de Energías Peligrosas (LOTO) en su organización. Este curso proporciona los conocimientos para establecer procedimientos de bloqueo/etiquetado, seleccionar dispositivos adecuados y cumplir con los requerimientos normativos aplicables.',
  //   category: 'Seguridad Especializada',
  //   price: 2500,
  //   duration: '16 horas',
  //   isoStandards: [],
  //   previewVideoUrl: 'https://www.youtube.com/embed/evT-E8LtsQo',
  //   imageUrl: 'assets/images/courses/001.jpg',
  //   featured: true,
  //   nextDate: new Date('2025-04-10'),
  //   instructor: {
  //     id: '1',
  //     name: 'Roberto Vázquez',
  //     photoUrl: 'assets/images/instructors/prof3.png',
  //     bio: 'Ingeniero industrial con más de 12 años de experiencia en seguridad industrial y cumplimiento normativo.',
  //     specialties: ['Control de Energías', 'LOTO', 'Seguridad en Mantenimiento']
  //   },
  //   availableDates: [
  //     new Date('2025-04-10'),
  //     new Date('2025-05-08'),
  //     new Date('2025-06-10')
  //   ]
  // }
];