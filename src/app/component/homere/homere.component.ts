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
    {
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
    }
  ];

  constructor(
    private courseService: CourseService,
    private router: Router
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