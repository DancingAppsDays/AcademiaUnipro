// checkout-success.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { UserService } from '../../core/services/user.service';
import { Course } from '../../core/models/course.model';
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
  purchaseId: string | null = null;
  loading = true;

  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private userService = inject(UserService);

  ngOnInit(): void {

    console.log('CheckoutSuccessComponent');
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.purchaseId = this.route.snapshot.queryParamMap.get('purchaseId');
    var courseId = this.route.snapshot.queryParamMap.get('courseId');
    var dateParam = this.route.snapshot.queryParamMap.get('date');


    //debug
    courseId = '1';
    dateParam = '2025-08-05T00:00:00Z';

    // Parse date if provided
    if (dateParam) {
      try {
        this.selectedDate = new Date(dateParam);
      } catch (error) {
        console.error('Error parsing date', error);
      }
    }

    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe({
        next: (course) => {
          this.course = course;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading course', error);
          this.loadFromMockData(courseId!);
        }
      });
    } else {
      this.loading = false;
    }

    // Add purchase to user's calendar if logged in
    if (this.purchaseId) {
      this.userService.getCurrentUser().subscribe(user => {
        if (user && this.selectedDate) {
          this.addToCalendar();
        }
      });
    }
  }

  private loadFromMockData(courseId: string): void {
    this.courseService.getMockCourses().subscribe({
      next: (courses) => {
        const mockCourse = courses.find(c => c.id === courseId);
        if (mockCourse) {
          this.course = mockCourse;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
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

    const details = encodeURIComponent(`Curso de capacitación: ${this.course.title}`);

    // Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${courseTitle}&dates=${startDate}/${endDateFormatted}&details=${details}`;

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
}