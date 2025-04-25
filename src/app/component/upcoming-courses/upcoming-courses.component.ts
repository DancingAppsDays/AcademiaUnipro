// src/app/component/upcoming-courses/upcoming-courses.component.ts
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from '../../core/models/course.model';
import { CourseDate } from '../../core/models/course-date.model';
import { CourseDateService } from '../../core/services/course-date.service';
import { CourseService } from '../../core/services/course.service';
import { environment } from '../../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';

interface UpcomingCourse {
  _id: string;
  courseId: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  category: string;
  price: number;
  date: Date;
  instructor: {
    name: string;
    photoUrl: string;
  };
}

@Component({
  selector: 'app-upcoming-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
 
    <div class="upcoming-courses-section">
      <div class="section-header">
     
        <h2>{{ title }}</h2>
        <p class="section-subtitle">{{ subtitle }}</p>
      </div>
      
      <div *ngIf="loading" class="loading-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando próximos cursos...</p>
      </div>
      
      <div *ngIf="!loading && upcomingCourses.length === 0" class="no-courses">
        <i class="bi bi-calendar-x"></i>
        <p>No hay cursos programados para próximas fechas.</p>
      </div>
      
      <div *ngIf="!loading && upcomingCourses.length > 0" class="upcoming-courses-grid" @staggerFade>
        <div *ngFor="let course of upcomingCourses" class="upcoming-course-card" @fadeIn>
          <div class="course-date-badge">
            <div class="date-month">{{ formatMonth(course.date) }}</div>
            <div class="date-day">{{ formatDay(course.date) }}</div>
          </div>
          
          <div class="card-img-container">
            <img [src]="course.imageUrl || 'assets/images/courses/default.jpg'" [alt]="course.title">
            <div class="category-badge">{{ course.category }}</div>
          </div>
          
          <div class="card-content">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-subtitle">{{ course.subtitle }}</p>
            
            <div class="course-info">
              <div class="info-item">
                <i class="bi bi-clock"></i>
                <span>{{ formatTime(course.date) }}</span>
              </div>
              <div class="info-item">
                <i class="bi bi-person-badge"></i>
                <span>Capacitador: {{ course.instructor.name }}</span>
              </div>
            </div>
            
            <div class="card-footer">
              <div class="price">{{ course.price | currency:'MXN':'symbol':'1.0-0' }}</div>
              <div class="actions">
                <a [routerLink]="['/course', course.courseId]" class="btn btn-primary btn-sm">Ver Detalles</a>
                <a [routerLink]="['/checkout', course.courseId]" [queryParams]="{date: course.date.toISOString()}" class="btn btn-outline-primary btn-sm">Inscribirse</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upcoming-courses-section {
      padding: 2rem 0;
      font-family: 'Montserrat', sans-serif;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 2rem;
      
      h2 {
        font-weight: 700;
        color: #0066b3;
        margin-bottom: 0.5rem;
      }
      
      .section-subtitle {
        font-weight: 700;
        color: #0066b3;
      }
    }
    
    .loading-container, .no-courses {
      text-align: center;
      padding: 2rem;
      
      i {
        font-size: 3rem;
        color: #999;
        margin-bottom: 1rem;
        display: block;
      }
      
      p {
        color: #666;
        margin-bottom: 0;
      }
    }
    
    .upcoming-courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    .upcoming-course-card {
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
      
      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
      }
      
      .course-date-badge {
        position: absolute;
        top: 15px;
        left: 15px;
        z-index: 2;
        width: 60px;
        height: 60px;
        background-color: #0066b3;
        color: white;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        
        .date-month {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          line-height: 1;
        }
        
        .date-day {
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 1.2;
        }
      }
      
      .card-img-container {
        height: 160px;
        position: relative;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        
        .category-badge {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background-color: #ffba00;
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          z-index: 1;
        }
      }
      
      .card-content {
        padding: 1.2rem;
        
        .course-title {
          font-weight: 700;
          color: #0066b3;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          min-height: 2.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .course-subtitle {
          color: #666;
          font-size: 0.85rem;
          margin-bottom: 0.8rem;
          min-height: 2rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .course-info {
          margin-bottom: 1rem;
          
          .info-item {
            display: flex;
            align-items: center;
            margin-bottom: 0.3rem;
            font-size: 0.85rem;
            color: #666;
            
            i {
              color: #0066b3;
              width: 18px;
              margin-right: 0.5rem;
            }
          }
        }
        
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .price {
            font-weight: 700;
            color: #0066b3;
            font-size: 1.1rem;
          }
          
          .actions {
            display: flex;
            gap: 0.5rem;
            
            .btn {
              padding: 0.25rem 0.5rem;
              font-size: 0.8rem;
              border-radius: 4px;
            }
          }
        }
      }
    }
    
    // Responsive adjustments
    @media (max-width: 767px) {
      .upcoming-courses-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class UpcomingCoursesComponent implements OnInit {
  @Input() title: string = 'Próximos Cursos';
  @Input() subtitle: string = 'Inscríbete a nuestros cursos con fechas próximas';
  @Input() limit: number = 4;
  
  upcomingCourses: UpcomingCourse[] = [];
  loading = true;
  
  private courseDateService = inject(CourseDateService);
  private courseService = inject(CourseService);
  private http = inject(HttpClient);
  
  ngOnInit(): void {
    this.loadUpcomingCourses();
  }
  
  private loadUpcomingCourses(): void {
    this.loading = true;
    
    const endpoint = `${environment.apiUrl}/course-dates/upcoming?limit=${this.limit}`;
    
    // Try to load from API first
    this.http.get<any[]>(endpoint).subscribe({
      next: (courseDates) => {
        this.processCourseDates(courseDates);
      },
      error: (error) => {
        console.error('Error loading upcoming courses from API:', error);
        
        // Fall back to service method
        this.courseDateService.getUpcomingInstances(this.limit).subscribe({
          next: (courseDates) => {
            this.processCourseDates(courseDates);
          },
          error: (fallbackError) => {
            console.error('Error loading upcoming courses from service:', fallbackError);
            this.loading = false;
            this.generateMockData();
          }
        });
      }
    });
  }
  
  private processCourseDates(courseDates: any[]): void {
    if (!courseDates || courseDates.length === 0) {
      this.loading = false;
      return;
    }
    
    // Map course dates to our simplified model
    const processed = courseDates
      .filter(date => date.course) // Ensure the course object exists
      .map(date => {
        const course = date.course;
        return {
          _id: date._id,
          courseId: course._id,
          title: course.title,
          subtitle: course.subtitle || '',
          imageUrl: course.imageUrl || 'assets/images/courses/default.jpg',
          category: course.category,
          price: course.price,
          date: new Date(date.startDate),
          instructor: {
            name: date.instructor?.name || 'Instructor',
            photoUrl: date.instructor?.photoUrl || 'assets/images/instructors/default.png'
          }
        };
      });
    
    this.upcomingCourses = processed;
    this.loading = false;
  }
  
  private generateMockData(): void {
    // Generate mock data for development purposes
    const now = new Date();
    
    // Create future dates
    const dates = Array(this.limit).fill(0).map((_, index) => {
      const date = new Date(now);
      date.setDate(date.getDate() + 3 + index * 2); // Each 2 days starting from 3 days from now
      return date;
    });
    
    // Get mock courses
    this.courseService.getMockCourses().subscribe(courses => {
      if (!courses || courses.length === 0) {
        return;
      }
      
      this.upcomingCourses = dates.map((date, index) => {
        const course = courses[index % courses.length]; // Cycle through available courses
        return {
          _id: `mock-${index}`,
          courseId: course._id,
          title: course.title,
          subtitle: course.subtitle,
          imageUrl: course.imageUrl || 'assets/images/courses/default.jpg',
          category: course.category,
          price: course.price,
          date: date,
          instructor: {
            name: course.instructor.name,
            photoUrl: course.instructor.photoUrl
          }
        };
      });
      
      this.loading = false;
    });
  }
  
  // Helper methods for formatting
  formatMonth(date: Date): string {
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return months[date.getMonth()];
  }
  
  formatDay(date: Date): string {
    return date.getDate().toString();
  }
  
  formatHOUR(date: Date): string {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }

  formatTime(date: Date): string {
    // Apply timezone adjustment (-5 hours for database time)
    const adjustedDate = new Date(date);
    adjustedDate.setHours(adjustedDate.getHours() - 6); // Adjust for UTC-6 (Mexico City time)
    
    const timeString = adjustedDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const endDate = new Date(adjustedDate);
    endDate.setHours(adjustedDate.getHours() + 4); // Assuming 8-hour courses
    const endTimeString = endDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    
    return `${timeString} - ${endTimeString} hrs`;
  }
}