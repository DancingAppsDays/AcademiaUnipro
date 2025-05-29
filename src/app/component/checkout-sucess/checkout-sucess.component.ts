// src/app/component/checkout-sucess/checkout-sucess.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { CourseDateService } from '../../core/services/course-date.service';
import { UserService } from '../../core/services/user.service';
import { Course } from '../../core/models/course.model';
import { CourseDate } from '../../core/models/course-date.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout-sucess.component.html',
  styleUrls: ['./checkout-sucess.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CheckoutSuccessComponent implements OnInit {
  email: string | null = null;
  course: Course | null = null;
  selectedDate: Date | null = null;
  courseInstance: CourseDate | null = null;
  purchaseId: string | null = null;
  whatsappGroup: string | null = null;
  meetingUrl: string | null = null;
  loading = true;
  enrollmentConfirmed = false; // Whether course enrollment is guaranteed
  showPostponementWarning = false; // Show warning about possible postponement

  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private courseDateService = inject(CourseDateService);
  private userService = inject(UserService);
  

  ngOnInit(): void {
    // Get basic purchase info
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.purchaseId = this.route.snapshot.queryParamMap.get('purchaseId');
    
    // Get course info
    const courseId = this.route.snapshot.queryParamMap.get('courseId');
    const courseInstanceId = this.route.snapshot.queryParamMap.get('courseInstanceId');
    const dateParam = this.route.snapshot.queryParamMap.get('date');

    // Parse date if provided
    if (dateParam) {
      try {
        this.selectedDate = new Date(dateParam);
      } catch (error) {
        console.error('Error parsing date', error);
      }
    }

    // First priority: load the course instance if available
    if (courseInstanceId) {
      this.loadCourseInstance(courseInstanceId);
    }
    // Second priority: load the course with date fallback
    else if (courseId) {
      this.loadCourse(courseId, this.selectedDate);
    } else {
      this.loading = false;
    }

    // Check if user is logged in and add to calendar if appropriate
    if (this.purchaseId) {
      this.userService.getCurrentUser().subscribe(user => {
        if (user && this.selectedDate) {
          this.addToCalendar();
        }
      });
    }
  }

  private loadCourse(courseId: string, date: Date | null = null): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course = course;
        
        // If we have a date but no instance, try to find a matching instance
        if (date) {
          this.loadCourseInstanceByDate(courseId, date);
        } else {
          this.loading = false;
          
          // Default: enrollment is confirmed
          this.enrollmentConfirmed = true;
        }
      },
      error: (error) => {
        console.error('Error loading course', error);
        //this.loadFromMockData(courseId);
      }
    });
  }
  
  private loadCourseInstance(instanceId: string): void {
    this.courseDateService.getCourseInstanceById(instanceId).subscribe({
      next: (instance) => {
        if (instance) {
          this.courseInstance = instance;
          this.selectedDate = new Date(instance.startDate);

            this.meetingUrl = instance.meetingUrl || null;
        this.whatsappGroup = instance.whatsappGroup || null;
          
          // Check if we need to show a postponement warning
          // If enrolled count is less than minimum required and date is within 3 days
          const enrolledCount = instance.enrolledCount;
          const daysUntilStart = Math.ceil((new Date(instance.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          if (enrolledCount < instance.minimumRequired && daysUntilStart <= 3) {
            this.showPostponementWarning = true;
          }
          
          // Enrollment is confirmed if enough students or date is confirmed
          this.enrollmentConfirmed = enrolledCount >= instance.minimumRequired || instance.status === 'confirmed';
          
          // Load the course too
          this.loadCourse(instance.courseId);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading course instance', error);
        this.loading = false;
      }
    });
  }
  
  private loadCourseInstanceByDate(courseId: string, date: Date): void {
    this.courseDateService.getCourseInstancesForCourse(courseId).subscribe({
      next: (instances) => {
        // Find an instance that matches the selected date
        const matchingInstance = instances.find(instance => {
          const instanceDate = new Date(instance.startDate);
          return instanceDate.toDateString() === date.toDateString();
        });
        
        if (matchingInstance) {
          this.courseInstance = matchingInstance;
          
          // Check if we need to show a postponement warning
          const enrolledCount = matchingInstance.enrolledCount;
          const daysUntilStart = Math.ceil((new Date(matchingInstance.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          if (enrolledCount < matchingInstance.minimumRequired && daysUntilStart <= 3) {
            this.showPostponementWarning = true;
          }
          
          // Enrollment is confirmed if enough students or date is confirmed
          this.enrollmentConfirmed = enrolledCount >= matchingInstance.minimumRequired || matchingInstance.status === 'confirmed';
        } else {
          // No matching instance found, assume confirmed
          this.enrollmentConfirmed = true;
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading course instances', error);
        this.loading = false;
        // Default: enrollment is confirmed
        this.enrollmentConfirmed = true;
      }
    });
  }

  private loadFromMockData(courseId: string): void {
    this.courseService.getMockCourses().subscribe({
      next: (courses) => {
        const mockCourse = courses.find(c => c._id === courseId);
        if (mockCourse) {
          this.course = mockCourse;
        }
        this.loading = false;
        
        // Default: enrollment is confirmed
        this.enrollmentConfirmed = true;
      },
      error: () => {
        this.loading = false;
        this.enrollmentConfirmed = true;
      }
    });
  }

  addToCalendar(): void {
    if (!this.course || !this.selectedDate) return;

    const courseTitle = encodeURIComponent(this.course.title);
    const startDate = this.formatDateForCalendar(this.selectedDate);

    // Create end date (assuming 8 hours duration)
    const endDate = new Date(this.selectedDate);
    endDate.setHours(endDate.getHours() + 8);
    const endDateFormatted = this.formatDateForCalendar(endDate);

    let details = encodeURIComponent(`Curso de capacitación: ${this.course.title}`);
    
    //TODO: fix database location of coursedates
    // Add location if available from course instance
    let location = 'Zoom meeting';
    if (this.courseInstance?.location) {
      //location = `&location=${encodeURIComponent(this.courseInstance.location)}`;
    }
    
    // Add meeting URL if available
    if (this.courseInstance?.meetingUrl) {
      details += encodeURIComponent(`\n\nEnlace de reunión: ${this.courseInstance.meetingUrl}`);
    }

    // Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${courseTitle}&dates=${startDate}/${endDateFormatted}&details=${details}${location}`;

    // Open in new tab
    window.open(googleCalendarUrl, '_blank');
  }

  private formatDateForCalendar(date: Date): string {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  }

  downloadConfirmation(): void {
    // In a real implementation, this would generate a PDF
    // For now, we'll just show an alert
    alert('La funcionalidad de descarga estará disponible pronto.');
  }
  
  getInstructorName(): string {
    if (this.courseInstance?.instructor) {
      return this.courseInstance.instructor.name;
    }
    return this.course?.instructor.name || '';
  }
  
  getInstructorPhoto(): string {
    if (this.courseInstance?.instructor) {
      return this.courseInstance.instructor.photoUrl;
    }
    return this.course?.instructor.photoUrl || '';
  }
}