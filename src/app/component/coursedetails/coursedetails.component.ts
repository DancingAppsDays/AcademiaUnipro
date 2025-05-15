import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseService } from '../../core/services/course.service';
import { CourseDateService } from '../../core/services/course-date.service';
import { Course } from '../../core/models/course.model';
import { CourseDate } from '../../core/models/course-date.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { CourseDatePickerComponent } from '../course-date-picker/course-date-picker.component';
import { CourseDateSelectorComponent } from '../course/course-date-selector/course-date-selector.component';
import { SafeUrlPipe } from '../../core/pipes/safe.pipe';
import { CourseFaqComponent } from '../course-faq/course-faq.component';
import { CourseInfoDetailsComponent } from '../course-info-details/course-info-details.component';
import { ViewportScroller } from '@angular/common';
import { InstructorService } from '../../core/services/instructor.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    SafeUrlPipe,
    CourseDateSelectorComponent,
    CourseFaqComponent,
    CourseInfoDetailsComponent,
    
  ],
  templateUrl: './coursedetails.component.html',
  styleUrls: ['./coursedetails.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(30px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('alertAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class CourseDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('datesSection') datesSection!: ElementRef;
  
  course: Course | null = null;
  loading = true;
  loadError = false;
  errorMessage: string | null = null;
  selectedDate: Date | null = null;
  selectedCourseInstance: CourseDate | null = null;
  availableDates: NgbDateStruct[] = [];
  activeSection: 'overview' | 'curriculum' | 'instructor' | 'reviews' | 'dates' | 'faq' = 'overview';
  showDateAlert = false;
  alertTimeout: any;
  
  // Added flags for displaying course date features
  hasCourseDates = false;
  loadingCourseDates = false;
  minimumStudentsRequired = 6;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private courseDateService: CourseDateService,
    private calendar: NgbCalendar,
     private viewportScroller: ViewportScroller ,
      private instructorService: InstructorService
  ) { }

   ngAfterViewInit(): void {
    // Scroll to top after the component has been initialized
    setTimeout(() => {
     // window.scrollTo(0, 0);
      // Alternative method with smooth scrolling
       this.viewportScroller.scrollToPosition([0, 0]);
    }, 100);
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    
    // Check for date or instance ID in query parameters
    const dateParam = this.route.snapshot.queryParamMap.get('date');
    const instanceIdParam = this.route.snapshot.queryParamMap.get('instanceId');

    if (dateParam) {
      try {
        this.selectedDate = new Date(dateParam);
        console.log('Date from URL:', this.selectedDate);
      } catch (error) {
        console.error('Error parsing date from URL', error);
      }
    }

    this.loadCourseData(courseId, instanceIdParam);
  }

  private loadCourseData(courseId: string | null, instanceId: string | null = null): void {
    if (!courseId) {
      this.loading = false;
      this.loadError = true;
      this.errorMessage = "No se especificó un curso";
      return;
    }

    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        if (!course) {
          this.loadFromMockData(courseId);
          return;
        }
        
        this.processCourse(course);
        
        // If an instance ID was provided, load that specific course instance
        if (instanceId) {
          this.loadCourseInstance(instanceId);
        } else {
          // Otherwise, load all course dates for this course
          this.loadingCourseDates = true;
          this.loadCourseDates(courseId);
        }
      },
      error: (error) => {
        console.error('Error loading course details', error);
        this.loadFromMockData(courseId);
      }
    });
  }

  private loadFromMockData(courseId: string): void {
    console.log('Loading course from mock data');
    
    this.courseService.getMockCourses().subscribe({
      next: (courses) => {
        const mockCourse = courses.find(c => c._id === courseId);
        if (mockCourse) {
          this.processCourse(mockCourse);
          this.loadingCourseDates = true;
          this.loadCourseDates(courseId);
        } else {
          this.loading = false;
          this.loadError = true;
          this.errorMessage = "No se encontró el curso especificado";
        }
      },
      error: (fallbackError) => {
        this.loading = false;
        this.loadError = true;
        this.errorMessage = "Error al cargar los datos del curso";
        console.error('Failed to load mock course data', fallbackError);
      }
    });
  }

  private processCourse(course: Course): void {

    if (course.previewVideoUrl) {
    course.previewVideoUrl = this.getYoutubeEmbedUrl(course.previewVideoUrl);
  }
    this.course = course;

      this.enhanceCourseWithMockInstructor(course);

    
    // Set minimum students required from course policy or use default
    this.minimumStudentsRequired = course.postponementPolicy?.minimumRequired || 6;
    
    // Convert available dates for legacy support
    if (course.availableDates && course.availableDates.length > 0) {
      this.availableDates = course.availableDates.map(date => {
        const dateObj = new Date(date);
        return {
          year: dateObj.getFullYear(),
          month: dateObj.getMonth() + 1,
          day: dateObj.getDate()
        };
      });
      
      // Validate selected date against available dates
      this.validateSelectedDate();
    }
    
    this.loading = false;
  }

  private validateSelectedDate(): void {
    if (!this.selectedDate || !this.availableDates.length) {
      return;
    }
    
    // Check if selected date is in available dates
    const selectedYear = this.selectedDate.getFullYear();
    const selectedMonth = this.selectedDate.getMonth() + 1;
    const selectedDay = this.selectedDate.getDate();
    
    const isDateAvailable = this.availableDates.some(date => 
      date.year === selectedYear && 
      date.month === selectedMonth && 
      date.day === selectedDay
    );
    
    if (!isDateAvailable) {
      console.warn('Selected date is not available');
      this.selectedDate = null;
    }
  }
  
  private loadCourseDates(courseId: string): void {
    this.courseDateService.getCourseInstancesForCourse(courseId).subscribe({
      next: (instances) => {
        this.hasCourseDates = instances.length > 0;
        this.loadingCourseDates = false;
        
        // If we have a selected date but no instance, try to find one that matches
        if (this.selectedDate && !this.selectedCourseInstance) {
          this.tryMatchSelectedDateToInstance(instances);
        }
      },
      error: (error) => {
        console.error('Error loading course dates', error);
        this.loadingCourseDates = false;
        this.hasCourseDates = false;
      }
    });
  }
  
  private loadCourseInstance(instanceId: string): void {
    this.courseDateService.getCourseInstanceById(instanceId).subscribe({
      next: (instance) => {
        if (instance) {
          this.selectedCourseInstance = instance;
          this.selectedDate = new Date(instance.startDate);
          this.hasCourseDates = true;
        }
        this.loadingCourseDates = false;
      },
      error: (error) => {
        console.error('Error loading course instance', error);
        this.loadingCourseDates = false;
      }
    });
  }
  
  private tryMatchSelectedDateToInstance(instances: CourseDate[]): void {
    if (!this.selectedDate) return;
    
    // Try to find an instance with a matching date
    const matchingInstance = instances.find(instance => {
      const instanceDate = new Date(instance.startDate);
      return instanceDate.toDateString() === this.selectedDate?.toDateString();
    });
    
    if (matchingInstance) {
      this.selectedCourseInstance = matchingInstance;
    }
  }

  onCourseInstanceSelected(instance: CourseDate): void {
    this.selectedCourseInstance = instance;
    this.selectedDate = new Date(instance.startDate);
    
    // Update URL with selected instance ID (without navigation)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        instanceId: instance._id,
        date: this.selectedDate.toISOString()
      },
      queryParamsHandling: 'merge'
    });
  }

  // New method to handle inscription requests from the date selector
  onInscriptionRequested(instance: CourseDate): void {
    console.log("Inscription requested for instance:", instance);
    // Make sure we have selected this instance
    this.selectedCourseInstance = instance;
    this.selectedDate = new Date(instance.startDate);
    
    // Proceed to checkout
    this.proceedToCheckout();
  }

  changeSection(section: 'overview' | 'curriculum' | 'instructor' | 'reviews' | 'dates' | 'faq'): void {
    this.activeSection = section;
    
    // If changing to dates section, scroll to it after a short delay
    // to allow for component to render
    if (section === 'dates') {
      setTimeout(() => {
        if (this.datesSection) {
          this.datesSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }

  proceedToCheckout(): void {
    // If no date is selected, show alert and open dates section
    if (!this.selectedCourseInstance && !this.selectedDate) {
      this.showDateAlert = true;
      
      // Clear previous timeout if exists
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
      
      // Hide alert after 3 seconds
      this.alertTimeout = setTimeout(() => {
        this.showDateAlert = false;
      }, 3000);
      
      this.changeSection('dates');
      return;
    }

    // Navigate to checkout with the selected instance and date
    const queryParams: any = {};
    
    if (this.selectedCourseInstance) {
      queryParams.instanceId = this.selectedCourseInstance._id;
    }
    
    if (this.selectedDate) {
      queryParams.date = this.selectedDate.toISOString();
    }

    this.router.navigate(['/checkout', this.course?._id], { queryParams });
  }
  
  // Useful date formatting helpers
  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  isDateAvailable(date: NgbDateStruct): boolean {
    return this.availableDates.some(
      d => d.year === date.year && d.month === date.month && d.day === date.day
    );
  }
  
  isToday(date: NgbDateStruct): boolean {
    const today = this.calendar.getToday();
    return date.year === today.year && date.month === today.month && date.day === today.day;
  }


  //this extracts descipriont from the course object and returns it as a string
  //vert dpendent on the format copied to database
  getCleanDescription(): string {
    if (!this.course || !this.course.description) return '';
    
    const fullDescription = this.course.description;
    
    // Look for the exact marker "Objetivos de Aprendizaje"
    const markerIndex = fullDescription.indexOf('🎯 Objetivos de Aprendizaje');
    
    // If marker not found, return the full description
    if (markerIndex === -1) return fullDescription;
    
    // Return everything before the marker
    return fullDescription.substring(0, markerIndex).trim();
  }

    private getYoutubeEmbedUrl(url: string): string {
    if (!url || url === '') return '';
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) return '';
    // Add parameters for enhanced embed
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
  }






  
private enhanceCourseWithMockInstructor(course: Course): void {

  console.log("about to set mock isntrutor", course)
  if (!course) return;
  
  // Replace with placeholder instructor if missing or has minimal data
  const needsInstructorData = !course.instructor || 
                              !course.instructor.bio || 
                              course.instructor.bio.length < 50;
  
  if (needsInstructorData) {
    // Import and inject the InstructorService in your constructor first
    this.instructorService.getMockInstructorByCategory(course.category).subscribe(instructor => {
      // Keep the original ID if it exists
      const originalId = course.instructor?._id;
      
      // Replace the instructor data
      course.instructor = instructor;
      
      // Restore original ID if it existed
      if (originalId) {
        course.instructor._id = originalId;
      }
      
      console.log('Enhanced course with mock instructor data', course.instructor.name);
    });
  }
}




/*
   private loadFromMockData(courseId: string): void {
    console.log('Loading course from mock data');
    
    this.courseService.getMockCourses().subscribe({
      next: (courses) => {
        const mockCourse = courses.find(c => c._id === courseId);
        if (mockCourse) {
          // Enhance the course with more detailed instructor data if available
          if (mockCourse.category) {
            const categoryKey = this.getCategoryKey(mockCourse.category);
            if (this.mockInstructorData[categoryKey]) {
              mockCourse.instructor = this.mockInstructorData[categoryKey];
            } else {
              // Fallback to default instructor if no category match
              mockCourse.instructor = this.mockInstructorData['default'];
            }
          } else {
            // Use default instructor data if no category
            mockCourse.instructor = this.mockInstructorData['default'];
          }
          
          this.processCourse(mockCourse);
          this.loadingCourseDates = true;
          this.loadCourseDates(courseId);
        } else {
          this.loading = false;
          this.loadError = true;
          this.errorMessage = "No se encontró el curso especificado";
        }
      },
      error: (fallbackError) => {
        this.loading = false;
        this.loadError = true;
        this.errorMessage = "Error al cargar los datos del curso";
        console.error('Failed to load mock course data', fallbackError);
      }
    });
  }
  
  // Helper method to map course categories to instructor data keys
  private getCategoryKey(category: string): string {
    // Map category names to keys in the mockInstructorData object
    const categoryMap = {
      'Normativas Clave': 'normativas',
      'Seguridad Especializada': 'seguridad',
      'Protección y Prevención': 'brigadas',
      'Desarrollo Profesional': 'default'
    };
    
    return categoryMap[category] || 'default';
  }


   // Mock instructor data that will be used when loaded from API fails
  private mockInstructorData = {
    'default': {
      _id: 'instr-1',
      name: 'Ing. Joram Morales Cabrera',
      photoUrl: 'assets/images/instructors/joram-morales.jpg',
      bio: `Especialista en Seguridad Industrial, Brigadas de Emergencia y Gestión de Proyectos. Instructor Certificado por CONOCER EC0217 | Experto en ambientes de alto riesgo y formación didáctica aplicada.
      
      El Ing. Joram Morales es un profesional con sólida experiencia en seguridad industrial, salud ocupacional y respuesta ante emergencias, tanto en campo como en formación de talento técnico. Cuenta con certificación oficial EC0217 de CONOCER, además de una trayectoria destacada como supervisor de seguridad en industrias automotrices de alto nivel como BMW, Hutchinson y DURR México.
      
      Actualmente forma parte del equipo de instructores acreditados de UNIPROTEC, donde imparte cursos prácticos y actualizados en temas de NOM-STPS, brigadas de emergencia, medio ambiente y ergonomía industrial, integrando métodos gamificados y recursos de aprendizaje virtual.`,
      specialties: ['Seguridad Industrial', 'Respuesta a Emergencias', 'Normativa STPS', 'Formación de Brigadas']
    },
    'normativas': {
      _id: 'instr-2',
      name: 'Ing. Roberto Vázquez Hernández',
      photoUrl: 'assets/images/instructors/roberto-vazquez.jpg',
      bio: `Especialista en Normatividad STPS y Sistemas de Gestión de Seguridad | Auditor certificado ISO 45001 | Consultor en cumplimiento normativo industrial.
      
      El Ing. Vázquez cuenta con más de 15 años de experiencia en implementación y auditoría de sistemas de gestión de seguridad y salud en el trabajo. Ha colaborado con empresas de diversos sectores para asegurar el cumplimiento de normativas federales e internacionales.
      
      Su enfoque práctico y orientado a resultados ha permitido a sus alumnos implementar exitosamente programas de seguridad que no solo cumplen con la normatividad, sino que reducen significativamente la incidencia de accidentes laborales.`,
      specialties: ['Normatividad STPS', 'ISO 45001', 'Sistemas de Gestión SST', 'Auditorías de Cumplimiento']
    },
    'brigadas': {
      _id: 'instr-3',
      name: 'TUM Laura Sánchez Méndez',
      photoUrl: 'assets/images/instructors/laura-sanchez.jpg',
      bio: `Técnico en Urgencias Médicas | Especialista en Formación de Brigadas | Instructora certificada en PHTLS y BLS | Experta en simulacros de emergencia.
      
      La TUM Laura Sánchez combina su experiencia práctica como paramédico con su pasión por la formación de brigadistas, habiendo capacitado a más de 5,000 personas en los últimos 8 años.
      
      Su metodología única integra casos prácticos basados en escenarios reales, permitiendo a los participantes desarrollar habilidades críticas para la respuesta a emergencias bajo presión. Ha coordinado programas de brigadas para empresas multinacionales y plantas industriales de alto riesgo.`,
      specialties: ['Primeros Auxilios', 'Brigadas de Emergencia', 'Evacuación', 'Rescate Industrial']
    },
    'seguridad': {
      _id: 'instr-4',
      name: 'Ing. Carlos Mendoza Fuentes',
      photoUrl: 'assets/images/instructors/carlos-mendoza.jpg',
      bio: `Ingeniero en Seguridad Industrial | Especialista en Análisis de Riesgos | Experto en Espacios Confinados y Trabajos en Altura | Certificado en Protección Contra Caídas.
      
      El Ing. Mendoza ha desarrollado su carrera profesional en la industria petrolera y petroquímica, donde ha implementado programas de seguridad para operaciones de alto riesgo.
      
      Su enfoque en la prevención basada en el comportamiento y el análisis sistemático de riesgos ha sido fundamental para elevar los estándares de seguridad en múltiples organizaciones. Cuenta con certificaciones internacionales en trabajos especializados de alto riesgo.`,
      specialties: ['Espacios Confinados', 'Trabajos en Altura', 'Análisis de Riesgos', 'Bloqueo LOTO']
    }
  };*/
}