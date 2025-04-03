// src/app/component/user/user-courses/user-courses.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CourseDateService } from '../../../core/services/course-date.service';
import { CourseService } from '../../../core/services/course.service';
import { CourseDate, CourseDateWithAvailability } from '../../../core/models/course-date.model';
import { Course } from '../../../core/models/course.model';
import { animate, style, transition, trigger } from '@angular/animations';

interface EnrolledCourse {
  id: string;
  enrollmentId: string;
  course: Course;
  instance: CourseDateWithAvailability;
  isPast: boolean;
  isUpcoming: boolean;
  isToday: boolean;
  daysUntilStart: number;
}

@Component({
  selector: 'app-user-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="user-courses-dashboard" @fadeIn>
      <div class="dashboard-header">
        <h1>Mis Cursos</h1>
        <p class="subtitle">Gestiona tus inscripciones y accede a tus cursos</p>
      </div>
      
      <!-- Loading state -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando tus cursos...</p>
      </div>
      
      <!-- No courses state -->
      <div *ngIf="!loading && enrolledCourses.length === 0" class="no-courses-container">
        <div class="empty-state">
          <i class="bi bi-mortarboard"></i>
          <h2>No tienes cursos inscritos</h2>
          <p>Explora nuestro catálogo y encuentra cursos que potencien tu carrera profesional.</p>
          <button class="btn btn-primary" routerLink="/courses">Ver catálogo de cursos</button>
        </div>
      </div>
      
      <!-- Alert section for courses at risk of postponement -->
      <div *ngIf="hasPostponementRisk" class="alert-section">
        <div class="alert alert-warning">
          <div class="alert-icon">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <div class="alert-content">
            <h3>Aviso Importante</h3>
            <p>Uno o más de tus cursos próximos están en riesgo de ser aplazados por no cumplir con el mínimo de participantes requerido.</p>
            <p>Por favor, revisa los detalles a continuación y considera las opciones disponibles.</p>
          </div>
        </div>
      </div>
      
      <!-- Upcoming courses -->
      <div *ngIf="!loading && upcomingCourses.length > 0" class="courses-section">
        <h2>Próximos Cursos</h2>
        
        <div class="courses-grid">
          <div *ngFor="let enrolled of upcomingCourses" class="course-card" 
               [class.at-risk]="enrolled.instance.isAtRiskOfPostponement"
               [class.confirmed]="enrolled.instance.isConfirmed">
            
            <div class="card-status" *ngIf="enrolled.instance.isAtRiskOfPostponement || enrolled.instance.isConfirmed">
              <span class="status-badge" [class.warning]="enrolled.instance.isAtRiskOfPostponement" [class.success]="enrolled.instance.isConfirmed">
                <i class="bi" [ngClass]="enrolled.instance.isAtRiskOfPostponement ? 'bi-exclamation-triangle' : 'bi-check-circle'"></i>
                {{ enrolled.instance.isAtRiskOfPostponement ? 'Riesgo de aplazamiento' : 'Confirmado' }}
              </span>
            </div>
            
            <div class="card-header">
              <img [src]="enrolled.course.imageUrl || 'assets/images/course-placeholder.jpg'" [alt]="enrolled.course.title">
              <div class="course-category">{{ enrolled.course.category }}</div>
            </div>
            
            <div class="card-body">
              <h3 class="course-title">{{ enrolled.course.title }}</h3>
              
              <div class="course-info">
                <div class="info-item">
                  <i class="bi bi-calendar"></i>
                  <span>{{ enrolled.instance.startDate | date:'fullDate':'':'es' }}</span>
                </div>
                <div class="info-item">
                  <i class="bi bi-clock"></i>
                  <span>{{ enrolled.instance.startDate | date:'shortTime' }} - {{ enrolled.instance.endDate | date:'shortTime' }}</span>
                </div>
                <div class="info-item">
                  <i class="bi bi-person-badge"></i>
                  <span>{{ enrolled.instance.instructor.name }}</span>
                </div>
                <div class="info-item" *ngIf="enrolled.instance.location">
                  <i class="bi bi-geo-alt"></i>
                  <span>{{ enrolled.instance.location }}</span>
                </div>
              </div>
              
              <div class="enrollment-stats" *ngIf="enrolled.instance.isAtRiskOfPostponement">
                <div class="progress">
                  <div class="progress-bar" 
                       [style.width.%]="(enrolled.instance.enrolledCount / enrolled.instance.minimumRequired) * 100">
                    {{ enrolled.instance.enrolledCount }}/{{ enrolled.instance.minimumRequired }}
                  </div>
                </div>
                <div class="stats-label">
                  Faltan {{ enrolled.instance.minimumRequired - enrolled.instance.enrolledCount }} participantes para confirmar
                </div>
              </div>
              
              <div class="card-actions">
                <button *ngIf="enrolled.instance.meetingUrl" class="btn btn-primary"
                        [disabled]="enrolled.daysUntilStart > 0">
                  <i class="bi bi-camera-video"></i> Acceder al curso
                </button>
                
                <button *ngIf="enrolled.instance.isAtRiskOfPostponement" class="btn btn-outline-warning"
                        (click)="showRescheduleOptions(enrolled)">
                  <i class="bi bi-calendar-check"></i> Ver opciones
                </button>
                
                <button *ngIf="!enrolled.instance.isAtRiskOfPostponement" class="btn btn-outline-primary"
                        routerLink="/course/{{ enrolled.course.id }}">
                  <i class="bi bi-info-circle"></i> Ver detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Past courses -->
      <div *ngIf="!loading && pastCourses.length > 0" class="courses-section past-courses">
        <h2>Historial de Cursos</h2>
        
        <div class="courses-list">
          <div *ngFor="let enrolled of pastCourses" class="course-item">
            <div class="course-logo">
              <img [src]="enrolled.course.imageUrl || 'assets/images/course-placeholder.jpg'" [alt]="enrolled.course.title">
            </div>
            
            <div class="course-details">
              <h3>{{ enrolled.course.title }}</h3>
              <div class="detail-row">
                <span><i class="bi bi-calendar"></i> {{ enrolled.instance.startDate | date:'mediumDate':'':'es' }}</span>
                <span><i class="bi bi-person-badge"></i> {{ enrolled.instance.instructor.name }}</span>
              </div>
            </div>
            
            <div class="course-actions">
              <button class="btn btn-sm btn-outline-primary">
                <i class="bi bi-file-earmark-pdf"></i> Certificado
              </button>
              <button class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-cloud-download"></i> Materiales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-courses-dashboard {
      font-family: 'Montserrat', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    .dashboard-header {
      text-align: center;
      margin-bottom: 2rem;
      
      h1 {
        font-weight: 700;
        color: #0066b3;
        margin-bottom: 0.5rem;
      }
      
      .subtitle {
        color: #666;
        font-size: 1.1rem;
      }
    }
    
    .loading-container, .no-courses-container {
      text-align: center;
      padding: 3rem;
      
      .spinner-border {
        color: #0066b3;
        margin-bottom: 1rem;
      }
    }
    
    .empty-state {
      padding: 3rem;
      background-color: #f8f9fa;
      border-radius: 10px;
      
      i {
        font-size: 3rem;
        color: #0066b3;
        margin-bottom: 1rem;
      }
      
      h2 {
        color: #333;
        margin-bottom: 1rem;
      }
      
      p {
        color: #666;
        margin-bottom: 1.5rem;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
      }
    }
    
    .alert-section {
      margin-bottom: 2rem;
      
      .alert {
        display: flex;
        align-items: flex-start;
        border-radius: 10px;
        padding: 1.2rem;
        background-color: #fff3cd;
        border: 1px solid #ffecb5;
      }
      
      .alert-icon {
        font-size: 2rem;
        color: #ffc107;
        margin-right: 1rem;
        flex-shrink: 0;
      }
      
      .alert-content {
        h3 {
          color: #212529;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        
        p {
          margin-bottom: 0.5rem;
          color: #212529;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    
    .courses-section {
      margin-bottom: 3rem;
      
      h2 {
        font-weight: 700;
        color: #0066b3;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #f0f0f0;
      }
    }
    
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    
    .course-card {
      background-color: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;
      border-top: 4px solid transparent;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }
      
      &.at-risk {
        border-top-color: #ffc107;
      }
      
      &.confirmed {
        border-top-color: #28a745;
      }
      
      .card-status {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          color: white;
          background-color: #28a745;
          
          i {
            margin-right: 0.3rem;
          }
          
          &.warning {
            background-color: #ffc107;
            color: #212529;
          }
        }
      }
      
      .card-header {
        position: relative;
        height: 160px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .course-category {
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
        padding: 1.5rem;
        
        .course-title {
          font-weight: 700;
          color: #0066b3;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          min-height: 2.8rem;
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
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            
            i {
              width: 20px;
              margin-right: 0.5rem;
              color: #0066b3;
            }
          }
        }
        
        .enrollment-stats {
          margin-bottom: 1rem;
          
          .progress {
            height: 0.8rem;
            margin-bottom: 0.5rem;
            border-radius: 10px;
            
            .progress-bar {
              background-color: #ffc107;
              color: white;
              font-size: 0.7rem;
              text-align: center;
              border-radius: 10px;
              min-width: 30px;
            }
          }
          
          .stats-label {
            font-size: 0.8rem;
            color: #666;
            text-align: center;
          }
        }
        
        .card-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          
          .btn {
            width: 100%;
          }
        }
      }
    }
    
    .courses-list {
      .course-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        margin-bottom: 1rem;
        
        &:hover {
          background-color: #f9f9f9;
        }
        
        .course-logo {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          margin-right: 1.5rem;
          flex-shrink: 0;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        
        .course-details {
          flex-grow: 1;
          
          h3 {
            font-weight: 700;
            font-size: 1.1rem;
            color: #0066b3;
            margin-bottom: 0.5rem;
          }
          
          .detail-row {
            display: flex;
            gap: 1.5rem;
            font-size: 0.85rem;
            color: #666;
            
            span {
              display: flex;
              align-items: center;
              
              i {
                margin-right: 0.3rem;
                color: #0066b3;
              }
            }
          }
        }
        
        .course-actions {
          display: flex;
          gap: 0.5rem;
          margin-left: 1rem;
          flex-shrink: 0;
        }
      }
    }
    
    // Responsive adjustments
    @media (max-width: 767px) {
      .courses-list {
        .course-item {
          flex-direction: column;
          align-items: flex-start;
          
          .course-logo {
            margin-right: 0;
            margin-bottom: 1rem;
          }
          
          .course-details {
            margin-bottom: 1rem;
            width: 100%;
          }
          
          .course-actions {
            margin-left: 0;
            width: 100%;
            
            .btn {
              flex: 1;
            }
          }
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
export class UserCoursesComponent implements OnInit {
  enrolledCourses: EnrolledCourse[] = [];
  upcomingCourses: EnrolledCourse[] = [];
  pastCourses: EnrolledCourse[] = [];
  loading = true;
  hasPostponementRisk = false;
  
  private userService = inject(UserService);
  private courseDateService = inject(CourseDateService);
  private courseService = inject(CourseService);
  
  ngOnInit(): void {
    this.loadUserCourses();
  }
  
  private loadUserCourses(): void {
    this.loading = true;
    
    // In a real application, you would call an API to get the user's enrolled courses
    // For now, we'll generate some mock data
    this.generateMockEnrollments().then(enrollments => {
      this.enrolledCourses = enrollments;
      
      // Split into upcoming and past courses
      const now = new Date();
      
      this.upcomingCourses = this.enrolledCourses.filter(course => {
        const startDate = new Date(course.instance.startDate);
        return startDate >= now;
      }).sort((a, b) => {
        return new Date(a.instance.startDate).getTime() - new Date(b.instance.startDate).getTime();
      });
      
      this.pastCourses = this.enrolledCourses.filter(course => {
        const startDate = new Date(course.instance.startDate);
        return startDate < now;
      }).sort((a, b) => {
        return new Date(b.instance.startDate).getTime() - new Date(a.instance.startDate).getTime();
      });
      
      // Check if any upcoming courses are at risk of postponement
      this.hasPostponementRisk = this.upcomingCourses.some(course => course.instance.isAtRiskOfPostponement);
      
      this.loading = false;
    });
  }
  
  showRescheduleOptions(enrolledCourse: EnrolledCourse): void {
    // In a real application, you would show a modal with available dates for rescheduling
    alert('En una implementación real, aquí se mostraría un modal con opciones de reprogramación para el curso.');
  }
  
  private async generateMockEnrollments(): Promise<EnrolledCourse[]> {
    // Get all course instances
    return new Promise<EnrolledCourse[]>((resolve) => {
      this.courseDateService.getUpcomingInstances(20).subscribe(instances => {
        // Get all courses
        this.courseService.getMockCourses().subscribe(courses => {
          // Create mock enrollments
          const enrollments: EnrolledCourse[] = [];
          
          // Add 3 upcoming courses, including one at risk of postponement
          const upcomingInstances = instances.filter(instance => new Date(instance.startDate) > new Date());
          
          // Make sure at least one instance is at risk (for demo purposes)
          if (upcomingInstances.length >= 3) {
            // Modify the first instance to be at risk
            const riskInstance = { 
              ...upcomingInstances[0],
              enrolledCount: upcomingInstances[0].minimumRequired - 2 // Make it 2 short of minimum
            };
            
            const course = courses.find(c => c.id === riskInstance.courseId);
            if (course) {
              const withAvailability = this.courseDateService.checkAvailability(riskInstance);
              
              // Calculate days until start
              const startDate = new Date(riskInstance.startDate);
              const now = new Date();
              const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              
              // Add to enrollments
              enrollments.push({
                id: `mock-${riskInstance.id}`,
                enrollmentId: `enroll-${Math.floor(Math.random() * 10000)}`,
                course: course,
                instance: withAvailability,
                isPast: false,
                isUpcoming: true,
                isToday: false,
                daysUntilStart: daysUntilStart
              });
            }
            
            // Add 2 more upcoming courses that are not at risk
            for (let i = 1; i < Math.min(3, upcomingInstances.length); i++) {
              const instance = upcomingInstances[i];
              const course = courses.find(c => c.id === instance.courseId);
              
              if (course) {
                // Make sure this one has enough enrollments
                const confirmedInstance = {
                  ...instance,
                  enrolledCount: instance.minimumRequired + 2 // 2 more than minimum
                };
                
                const withAvailability = this.courseDateService.checkAvailability(confirmedInstance);
                
                // Calculate days until start
                const startDate = new Date(confirmedInstance.startDate);
                const now = new Date();
                const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                
                // Add to enrollments
                enrollments.push({
                  id: `mock-${confirmedInstance.id}`,
                  enrollmentId: `enroll-${Math.floor(Math.random() * 10000)}`,
                  course: course,
                  instance: withAvailability,
                  isPast: false,
                  isUpcoming: true,
                  isToday: false,
                  daysUntilStart: daysUntilStart
                });
              }
            }
          }
          
          // Add 2 past courses
          for (let i = 0; i < Math.min(2, courses.length); i++) {
            const course = courses[i];
            
            // Create a past instance
            const pastDate = new Date();
            pastDate.setMonth(pastDate.getMonth() - (i + 1)); // 1-2 months ago
            
            const pastInstance: CourseDate = {
              id: `past-${i}`,
              courseId: course.id,
              startDate: pastDate,
              endDate: new Date(pastDate.getTime() + 8 * 60 * 60 * 1000), // 8 hours later
              capacity: 15,
              enrolledCount: 12,
              instructor: course.instructor,
              location: 'Virtual (Zoom)',
              meetingUrl: 'https://zoom.us/j/past-example',
              status: 'completed',
              minimumRequired: 6
            };
            
            const withAvailability = this.courseDateService.checkAvailability(pastInstance);
            
            // Add to enrollments
            enrollments.push({
              id: `mock-past-${i}`,
              enrollmentId: `enroll-past-${Math.floor(Math.random() * 10000)}`,
              course: course,
              instance: withAvailability,
              isPast: true,
              isUpcoming: false,
              isToday: false,
              daysUntilStart: -30 * (i + 1) // Negative days since it's in the past
            });
          }
          
          resolve(enrollments);
        });
      });
    });
  }
}