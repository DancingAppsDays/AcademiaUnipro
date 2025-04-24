// improved-redesigned-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { CourseCarouselComponent } from '../course/course-carousel/course-carousel.component';

@Component({
  selector: 'app-redesigned-home',
  standalone: true,
  imports: [
    CommonModule, 
    NgbCarouselModule, 
    CourseCarouselComponent
  ],
  templateUrl: './homere.component.html',
  styleUrls: ['./homere.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class RedesignedHomeComponent implements OnInit {
  featuredCourses: Course[] = [];
  categoryCourses: { [key: string]: Course[] } = {};
  loading = true;
  categories: string[] = ['Normativas Clave', 'Seguridad Especializada', 'Protección y Prevención', 'Calidad', 'Desarrollo Profesional'];
  
  // Store selected dates for courses
  selectedDates: { [courseId: string]: Date } = {};
  
  // Hero slides data - ensure images don't have overlays built in
  heroSlides = [
   /* {
      imageUrl: 'assets/images/ACADEMIA_Web_portada_1.png',
      title: 'Normativas STPS',
      subtitle: 'Capacitación especializada en cumplimiento normativo',
      badge: 'NUEVO',
      action: 'courses',
      actionText: 'Ver Cursos'
    },
    {
      imageUrl: 'assets/images/courses/brigadas.jpg',
      title: 'Seguridad Industrial',
      subtitle: 'Cursos prácticos para entornos industriales seguros',
      badge: 'DESTACADO',
      action: 'featured',
      actionText: 'Cursos Destacados'
    },
    {
      imageUrl: 'assets/images/courses/lideres.jpg',
      title: 'Desarrollo Profesional',
      subtitle: 'Fortalezca sus habilidades y competencias',
      badge: 'PREMIUM',
      action: 'benefits',
      actionText: 'Descubrir Beneficios'
    },*/
    {
      imageUrl: 'assets/images/ACADEMIA_Web_portada_1.png',
      title: 'La capacitación industrial nunca había sido tan accesible',
      subtitle: 'Conéctate y aprende en vivo con expertos en seguridad y calidad',
      badge: 'NUEVO',
      action: 'courses',
      actionText: 'Ver Cursos'
    },
    {
      imageUrl: 'assets/images/courses/brigadas.jpg',
      title: 'La seguridad en el trabajo no es opcional',
      subtitle: 'Es una inversión en vida. Capacítate con los mejores y lleva tu carrera al siguiente nivel',
      badge: 'DESTACADO',
      action: 'featured',
      actionText: 'Cursos Destacados'
    },
    {
      imageUrl: 'assets/images/courses/lideres.jpg',
      title: 'Tu empresa necesita trabajadores mejor preparados',
      subtitle: 'Aprende en vivo con expertos y aplica el conocimiento de inmediato',
      badge: 'PREMIUM',
      action: 'benefits',
      actionText: 'Descubrir Beneficios'
    },
    {
      imageUrl: 'assets/images/courses/montacargas.jpg',
      title: 'La capacitación correcta puede evitar accidentes y salvar vidas',
      subtitle: 'Todos los martes, nuevos cursos para profesionales como tú',
      badge: 'PRÓXIMO',
      action: 'upcoming',
      actionText: 'Próximos Cursos'
    }
  ];

  constructor(
    private courseService: CourseService,
    private router: Router,
    private courseDateService: CourseService 
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.processCourses(courses);
        console.log(" courses from backend loaded successfully:", courses.length);
      },
      error: (error) => {
        console.error("Error loading courses:", error);
        this.loading = false;
      }
    });;
    // Load courses with minimal delay to improve performance
   // this.loadMockData();
  }

  //this method is bad, coursedate service doest have getUpcomingInstances method
  //we need to check all coursedate and grab the 4 closest ones to date now
  /*
  loadUpcomingCourses(): void {
    // Get upcoming course dates
    this.courseDateService.getUpcomingInstances(4).subscribe({
      next: (instances) => {
        // We need to get actual course objects
        const courseIds = [...new Set(instances.map(instance => instance.courseId))];
        
        // Get all courses and filter the ones we need
        this.courseService.getAllCourses().subscribe({
          next: (courses) => {
            this.upcomingCourses = courses.filter(course => 
              courseIds.includes(course._id)
            ).slice(0, 4);
            this.loading = false;
          },
          error: (err) => {
            console.error("Error loading upcoming courses:", err);
            this.loadMockUpcomingCourses();
          }
        });
      },
      error: (error) => {
        console.error("Error loading upcoming instances:", error);
        this.loadMockUpcomingCourses();
      }
    });
  }*/

  loadMockData(): void {
    this.courseService.getMockCourses().subscribe({
      next: (courses) => {
        this.processCourses(courses);
        console.log("Mock courses loaded successfully:", courses.length);
      },
      error: (error) => {
        console.error("Error loading mock courses:", error);
        this.loading = false;
      }
    });
  }
  
  private processCourses(courses: Course[]): void {
    if (!courses || courses.length === 0) {
      console.warn("No courses received");
      this.loading = false;
      return;
    }
    
    // Filter featured courses
    this.featuredCourses = courses.filter(course => course.featured);
    console.log("Featured courses:", this.featuredCourses.length);

    // Group courses by category without limiting the number
    this.categories.forEach(category => {
      this.categoryCourses[category] = courses
        .filter(course => course.category === category);
      console.log(`Category ${category}: ${this.categoryCourses[category]?.length || 0} courses`);
    });

    this.loading = false;
  }

  navigateToAllCourses(): void {
    this.router.navigate(['/courses']);
  }

  navigateToCategory(category: string | null): void {
    if (category) {
      this.router.navigate(['/courses', category]);
    } else {
      this.navigateToAllCourses();
    }
  }
  
  navigateToSection(sectionId: string): void {
    if (sectionId === 'courses') {
      this.navigateToAllCourses();
      return;
    }
    
    // Scroll to section if it's on the current page
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onDateSelected(event: {course: Course, date: Date}): void {
    // Store the selected date for this course
    this.selectedDates[event.course._id] = event.date;
    console.log(`Date selected for course ${event.course.title}: ${event.date}`);
    
    // Navigate to course details with the selected date
    this.router.navigate(['/course', event.course._id], {
      queryParams: { date: event.date.toISOString() }
    });
  }
}