import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { slideInAnimation } from '../../route-animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, NgbCarousel], 
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('staggerList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  featuredCourses: Course[] = [];
  categoryCourses: { [key: string]: Course[] } = {};
  loading = true;
  categories = ['Seguridad Industrial', 'Certificación ISO', 'Liderazgo', 'Gestión Ambiental'];
  
  // For the hero carousel
  carouselImages = [
    { 
      src: 'assets/images/hero1.jpg', 
      title: 'Formación de Alto Impacto', 
      subtitle: 'Capacitación práctica para profesionales'
    },
    { 
      src: 'assets/images/hero2.jpg', 
      title: 'Certificación Internacional', 
      subtitle: 'Cursos avalados por organismos reconocidos'
    },
    { 
      src: 'assets/images/hero3.jpg', 
      title: 'Instructores Expertos', 
      subtitle: 'Aprenda de líderes en la industria'
    }
  ];

  constructor(
    private courseService: CourseService,
    private router: Router,
   // private http: HttpClient // Inject HttpClientModule
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    
    // In a real implementation, we would call the backend
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.featuredCourses = courses.filter(course => course.featured).slice(0, 4);
        
        // Group courses by category
        this.categories.forEach(category => {
          this.categoryCourses[category] = courses
            .filter(course => course.category === category)
            .slice(0, 4);
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses', error);
        this.loading = false;
        
        // Fallback to mock data if API fails
        this.loadMockData();
      }
    });
  }
  
  loadMockData(): void {
    this.courseService.getMockCourses().subscribe(courses => {
      this.featuredCourses = courses.filter(course => course?.featured).slice(0, 4);
      
      this.categories.forEach(category => {
        this.categoryCourses[category] = courses
          .filter(course => course.category === category)
          .slice(0, 4);
      });
      
      this.loading = false;
    });
  }

  navigateToCourse(courseId: string): void {
    this.router.navigate(['/course', courseId]);
  }
  
  navigateToCategory(category: string): void {
    this.router.navigate(['/courses', category]);
  }
}