// src/app/component/user/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { CourseService } from '../../../core/services/course.service';
import { CourseDateService } from '../../../core/services/course-date.service';
import { environment } from '../../../../environments/environment';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface EnrollmentWithCourseInfo {
  _id: string;
  status: string;
  course: any;
  courseDate: any;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
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
  
  // Next course info
  nextCourse: any = null;
  recommendedCourses: any[] = [];
  
  private userService = inject(UserService);
  private courseService = inject(CourseService);
  private courseDateService = inject(CourseDateService);
  private http = inject(HttpClient);
  
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.userName = user?.fullName || 'Usuario';
      
      this.loadDashboardData();
    });
  }
  
  private loadDashboardData(): void {
    this.loading = true;
    
    if (!this.currentUser) {
      console.error('No user is currently logged in');
      this.loading = false;
      return;
    }
    
    // Try to fetch real enrollment data from API
    const userId = this.currentUser._id;
    const enrollmentsUrl = `${environment.apiUrl}/enrollments/user/${userId}`;
    
    console.log(`Fetching enrollments for user ${userId} from ${enrollmentsUrl}`);
    
    this.http.get<any[]>(enrollmentsUrl).subscribe({
      next: (enrollments) => {
        console.log('Successfully fetched enrollments from API:', enrollments);
        
        if (enrollments && enrollments.length > 0) {
          this.processEnrollments(enrollments);
        } else {
          console.log('No enrollments found for user');
          // Handle empty enrollments gracefully
          this.handleEmptyEnrollments();
        }
      },
      error: (error) => {
        console.error('Error fetching enrollments from API:', error);
        // Handle API error gracefully
        this.handleEmptyEnrollments();
      }
    });
  }
  
  private handleEmptyEnrollments(): void {
    // Reset all counters to 0
    this.upcomingCoursesCount = 0;
    this.completedCoursesCount = 0;
    this.certificatesCount = 0;
    this.nextCourse = null;
    
    // Still load recommended courses to show something useful
    this.loadRecommendedCourses();
    
    this.loading = false;
  }
  
  private processEnrollments(enrollments: any[]): void {
    if (!enrollments || enrollments.length === 0) {
      this.handleEmptyEnrollments();
      return;
    }
    
    try {
      // Count totals
      this.completedCoursesCount = enrollments.filter(e => e.status === 'completed').length;
      
      // Filter upcoming enrollments (course date is in the future)
      const now = new Date();
      const upcomingEnrollments = enrollments.filter(e => {
        const startDate = new Date(e.courseDate.startDate);
        return startDate > now && e.status !== 'canceled' && e.status !== 'postponed';
      });
      
      this.upcomingCoursesCount = upcomingEnrollments.length;
      
      // Sort by date and get next course
      upcomingEnrollments.sort((a, b) => {
        return new Date(a.courseDate.startDate).getTime() - new Date(b.courseDate.startDate).getTime();
      });
      
      // Get certificates count
      this.certificatesCount = enrollments.filter(e => e.status === 'completed' && e.certificateUrl).length;
      
      // Set next course info if available
      if (upcomingEnrollments.length > 0) {
        const nextEnrollment = upcomingEnrollments[0];
        const course = nextEnrollment.courseDate.course;
        
        this.nextCourse = {
          id: course._id,
          title: course.title,
          description: course.subtitle || course.description,
          date: new Date(nextEnrollment.courseDate.startDate),
          location: nextEnrollment.courseDate.location || 'Virtual',
          instructor: nextEnrollment.courseDate.instructor?.name || 'Instructor',
          duration: course.duration || '8 horas',
          meetingUrl: nextEnrollment.courseDate.meetingUrl || null,
          whatsappGroup: nextEnrollment.whatsappGroup || null 
        };
      }
      
      // Load recommended courses
      this.loadRecommendedCourses();
      
      this.loading = false;
    } catch (error) {
      console.error('Error processing enrollments:', error);
      this.handleEmptyEnrollments();
    }
  }
  
  private loadRecommendedCourses(): void {
    this.courseService.getFeaturedCourses().subscribe({
      next: (courses) => {
        this.recommendedCourses = courses.slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading recommended courses:', error);
        // Set empty array if can't load recommended courses
        this.recommendedCourses = [];
      }
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
  
  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }
}