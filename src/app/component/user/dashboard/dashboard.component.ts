// src/app/component/user/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { CourseService } from '../../../core/services/course.service';
import { CourseDateService } from '../../../core/services/course-date.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container" @fadeIn>
      <div class="dashboard-header">
        <div class="container">
          <h1>Dashboard</h1>
          <p class="welcome-message">Bienvenido, {{ userName }}</p>
        </div>
      </div>
      
      <div class="dashboard-content">
        <div class="container">
          <!-- Loading State -->
          <div *ngIf="loading" class="loading-container">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando tu información...</p>
          </div>
          
          <!-- Dashboard Overview -->
          <div *ngIf="!loading" class="dashboard-overview">
            <!-- User Stats Cards -->
            <div class="stats-row">
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="bi bi-mortarboard"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ upcomingCoursesCount }}</div>
                  <div class="stat-label">Cursos Próximos</div>
                </div>
                <a routerLink="/dashboard/courses" class="card-link">
                  <i class="bi bi-arrow-right"></i>
                </a>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="bi bi-check-circle"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ completedCoursesCount }}</div>
                  <div class="stat-label">Cursos Completados</div>
                </div>
                <a routerLink="/dashboard/courses" class="card-link">
                  <i class="bi bi-arrow-right"></i>
                </a>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="bi bi-award"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ certificatesCount }}</div>
                  <div class="stat-label">Certificados</div>
                </div>
                <a routerLink="/dashboard/certificates" class="card-link">
                  <i class="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
            
            <!-- Next Course Panel -->
            <div class="upcoming-course-panel" *ngIf="nextCourse">
              <div class="panel-header">
                <h2>Tu Próximo Curso</h2>
                <a routerLink="/dashboard/courses" class="view-all-link">Ver todos</a>
              </div>
              
              <div class="next-course-card">
                <div class="course-date-time">
                  <div class="date-badge">
                    <div class="month">{{ formatMonth(nextCourse.date) }}</div>
                    <div class="day">{{ formatDay(nextCourse.date) }}</div>
                  </div>
                  <div class="time-location">
                    <div class="time">{{ formatTime(nextCourse.date) }}</div>
                    <div class="location">{{ nextCourse.location }}</div>
                  </div>
                </div>
                
                <div class="course-info">
                  <h3>{{ nextCourse.title }}</h3>
                  <p>{{ nextCourse.description }}</p>
                  
                  <div class="course-meta">
                    <span class="instructor">
                      <i class="bi bi-person"></i> {{ nextCourse.instructor }}
                    </span>
                    <span class="duration">
                      <i class="bi bi-clock"></i> {{ nextCourse.duration }}
                    </span>
                  </div>
                </div>
                
                <div class="course-actions">
                  <a [href]="nextCourse.meetingUrl" target="_blank" class="btn btn-primary">
                    <i class="bi bi-camera-video"></i> Acceder
                  </a>
                  <a [routerLink]="['/course', nextCourse.id]" class="btn btn-outline-primary">
                    <i class="bi bi-info-circle"></i> Detalles
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Recommended Courses -->
            <div class="recommended-courses">
              <div class="panel-header">
                <h2>Cursos Recomendados</h2>
                <a routerLink="/courses" class="view-all-link">Ver catálogo</a>
              </div>
              
              <div class="recommended-grid">
                <div class="recommendation-card" *ngFor="let course of recommendedCourses">
                  <div class="card-img">
                    <img [src]="course.imageUrl" [alt]="course.title">
                    <div class="card-category">{{ course.category }}</div>
                  </div>
                  <div class="card-body">
                    <h3>{{ course.title }}</h3>
                    <p>{{ course.subtitle }}</p>
                    <div class="card-footer">
                      <span class="price">{{ course.price | currency:'MXN':'symbol':'1.0-0' }}</span>
                      <a [routerLink]="['/course', course.id]" class="btn btn-sm btn-primary">Ver Curso</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      font-family: 'Montserrat', sans-serif;
    }
    
    .dashboard-header {
      background-color: #0066b3;
      color: white;
      padding: 2rem 0;
      
      h1 {
        margin: 0;
        font-weight: 700;
        font-size: 2rem;
      }
      
      .welcome-message {
        margin: 0.5rem 0 0;
        opacity: 0.9;
        font-size: 1.1rem;
      }
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }
    
    .dashboard-content {
      padding: 2rem 0;
    }
    
    .loading-container {
      text-align: center;
      padding: 2rem;
      
      .spinner-border {
        color: #0066b3;
      }
    }
    
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background-color: white;
      border-radius: 10px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      position: relative;
      
      .stat-icon {
        width: 60px;
        height: 60px;
        background-color: rgba(0, 102, 179, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        
        i {
          font-size: 1.8rem;
          color: #0066b3;
        }
      }
      
      .stat-content {
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #0066b3;
          line-height: 1;
          margin-bottom: 0.3rem;
        }
        
        .stat-label {
          color: #666;
          font-size: 0.9rem;
        }
      }
      
      .card-link {
        position: absolute;
        top: 1rem;
        right: 1rem;
        color: #0066b3;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        
        &:hover {
          opacity: 1;
        }
      }
    }
    
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      
      h2 {
        font-weight: 700;
        color: #0066b3;
        font-size: 1.5rem;
        margin: 0;
      }
      
      .view-all-link {
        color: #0066b3;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    .upcoming-course-panel {
      margin-bottom: 2rem;
    }
    
    .next-course-card {
      background-color: white;
      border-radius: 10px;
      padding: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      
      .course-date-time {
        display: flex;
        align-items: center;
        gap: 1rem;
        
        .date-badge {
          width: 80px;
          height: 80px;
          background-color: #0066b3;
          color: white;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          
          .month {
            font-size: 0.8rem;
            font-weight: 500;
          }
          
          .day {
            font-size: 1.8rem;
            font-weight: 700;
            line-height: 1;
          }
        }
        
        .time-location {
          .time {
            font-weight: 700;
            font-size: 1.1rem;
            color: #333;
          }
          
          .location {
            font-size: 0.9rem;
            color: #666;
          }
        }
      }
      
      .course-info {
        flex: 1;
        min-width: 200px;
        
        h3 {
          font-weight: 700;
          color: #0066b3;
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.3rem;
        }
        
        p {
          color: #666;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        
        .course-meta {
          display: flex;
          gap: 1.5rem;
          
          span {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            color: #666;
            
            i {
              margin-right: 0.3rem;
              color: #0066b3;
            }
          }
        }
      }
      
      .course-actions {
        display: flex;
        gap: 1rem;
        
        @media (max-width: 767px) {
          width: 100%;
          
          .btn {
            flex: 1;
          }
        }
      }
    }
    
    .recommended-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    .recommendation-card {
      background-color: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
      }
      
      .card-img {
        height: 160px;
        position: relative;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .card-category {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background-color: #ffba00;
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
        }
      }
      
      .card-body {
        padding: 1.2rem;
        
        h3 {
          font-weight: 700;
          color: #0066b3;
          font-size: 1.1rem;
          margin-top: 0;
          margin-bottom: 0.5rem;
          min-height: 2.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        p {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          min-height: 3rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
        }
      }
    }
    
    // Button styles
    .btn {
      border-radius: 50px;
      font-weight: 500;
      
      &-primary {
        background-color: #0066b3;
        border-color: #0066b3;
        
        &:hover {
          background-color: #004c86;
          border-color: #004c86;
        }
      }
      
      &-outline-primary {
        color: #0066b3;
        border-color: #0066b3;
        
        &:hover {
          background-color: #0066b3;
          color: white;
        }
      }
    }
    
    // Responsive adjustments
    @media (max-width: 767px) {
      .dashboard-header {
        padding: 1.5rem 0;
        
        h1 {
          font-size: 1.8rem;
        }
      }
      
      .next-course-card {
        flex-direction: column;
        
        .course-date-time {
          width: 100%;
        }
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  loading = true;
  currentUser: User | null = null;
  userName = '';
  upcomingCoursesCount = 0;
  completedCoursesCount = 0;
  certificatesCount = 0;
  
  // Mock data for display
  nextCourse: any = null;
  recommendedCourses: any[] = [];
  
  private userService = inject(UserService);
  private courseService = inject(CourseService);
  private courseDateService = inject(CourseDateService);
  
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.userName = user?.fullName || 'Usuario';
      
      this.loadDashboardData();
    });
  }
  
  private loadDashboardData(): void {
    // In a real app, we would load this data from backend services
    // For now, we'll use mock data
    
    // Mock stats
    this.upcomingCoursesCount = 2;
    this.completedCoursesCount = 3;
    this.certificatesCount = 2;
    
    // Mock next course
    this.nextCourse = {
      id: '101',
      title: 'NOM-004-STPS: Maquinaria y Equipo',
      description: 'Curso especializado en normativas de seguridad para maquinaria industrial.',
      date: new Date('2025-05-10T09:00:00'),
      location: 'Virtual (Zoom)',
      instructor: 'Roberto Vázquez',
      duration: '8 horas',
      meetingUrl: 'https://zoom.us/j/example'
    };
    
    // Load recommended courses from mock data
    this.courseService.getMockCourses().subscribe(courses => {
      // Get 3 random courses as recommendations
      this.recommendedCourses = this.getRandomCourses(courses, 3);
      this.loading = false;
    });
  }
  
  private getRandomCourses(courses: any[], count: number): any[] {
    const shuffled = [...courses].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // Helper methods for formatting
  formatMonth(date: Date): string {
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return months[date.getMonth()];
  }
  
  formatDay(date: Date): string {
    return date.getDate().toString();
  }
  
  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }
}