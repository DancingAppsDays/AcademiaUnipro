import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { NgbCarousel, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { slideInAnimation } from '../../route-animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, NgbCarousel, NgbCarouselModule],
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
  categories: string[] = ['Normativas Clave', 'Seguridad Especializada', 'Protección y Prevención', 'Calidad', 'Desarrollo Profesional'];

  // For the hero carousel
  carouselImages = [
    {
      src: 'assets/images/courses/montacargas.jpg',
      title: 'Normativas STPS',
      subtitle: 'Capacitación especializada en cumplimiento normativo'
    },
    {
      src: 'assets/images/courses/brigadas.jpg',
      title: 'Seguridad Industrial',
      subtitle: 'Cursos prácticos para entornos industriales seguros'
    },
    {
      src: 'assets/images/courses/lideres.jpg',
      title: 'Desarrollo Profesional',
      subtitle: 'Fortalezca sus habilidades y competencias'
    }
  ];

  constructor(
    private courseService: CourseService,
    private router: Router,
    // private http: HttpClient // Inject HttpClientModule
  ) { }

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

  navigateToAllCourses(): void {
    this.router.navigate(['/courses']);
  }
  getCoursesForCategory(category: string): Course[] {
    return this.categoryCourses[category] || [];
  }

  getTopCoursesForCategory(category: string): Course[] {
    return this.getCoursesForCategory(category).slice(0, 3);
  }

  selectedTabIndex: number = 0;

  selectTab(index: number): void {
    this.selectedTabIndex = index;
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Normativas Clave': 'bi bi-clipboard-check',
      'Seguridad Especializada': 'bi bi-shield-check',
      'Protección y Prevención': 'bi bi-exclamation-triangle',
      'Calidad': 'bi bi-award',
      'Desarrollo Profesional': 'bi bi-person-workspace'
    };
    return icons[category] || 'bi bi-book';
  }

  getImageName(category: string): string {
    // Convert category name to lowercase and replace spaces with hyphens
    return category.toLowerCase().replace(/\s+/g, '-');
  }


}