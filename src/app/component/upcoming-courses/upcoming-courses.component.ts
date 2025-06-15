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
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

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

  promotionalText?: string;
  promotionalBadge?: string;
  isPromotional?: boolean;
}

@Component({
  selector: 'app-upcoming-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbCarouselModule],
  templateUrl: './upcoming-courses.component.html',
  styleUrls: ['./upcoming-courses.component.scss'],
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
  @Input() limit: number = 28; // Increased to have enough courses for multiple slides
  @Input() useGrid: boolean = false;
  @Input() coursesPerSlide: number = 4;

  upcomingCourses: UpcomingCourse[] = [];
  loading = true;

  // Different grouped courses for different screen sizes
  desktopGroupedCourses: UpcomingCourse[][] = []; // 4 per slide for xl screens
  largeTabletGroupedCourses: UpcomingCourse[][] = []; // 3 per slide for lg screens
  mediumTabletGroupedCourses: UpcomingCourse[][] = []; // 2 per slide for md screens

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
          },
          promotionalText: date.promotionalText,
          promotionalBadge: date.promotionalBadge,
          isPromotional: date.isPromotional || false
        };
      });

    this.upcomingCourses = processed;
    this.createGroupedCourses();
    this.loading = false;
  }

  private createGroupedCourses(): void {
    // Create groups for different screen sizes
    this.desktopGroupedCourses = this.chunkArray(this.upcomingCourses, 4); // 4 per slide for xl
    this.largeTabletGroupedCourses = this.chunkArray(this.upcomingCourses, 3); // 3 per slide for lg
    this.mediumTabletGroupedCourses = this.chunkArray(this.upcomingCourses, 2); // 2 per slide for md
  }

  // Group courses into chunks for carousel slides
  private chunkArray(array: any[], size: number): any[][] {
    if (!array || array.length === 0) {
      return []; // Return empty array if input is empty
    }

    // Create continuous looping slides
    const chunked = [];
    const totalItems = array.length;

    // If we have fewer items than the size, just return them as a single chunk
    if (totalItems <= size) {
      return [array];
    }

    // Create proper sized chunks
    for (let i = 0; i < totalItems; i += size) {
      chunked.push(array.slice(i, Math.min(i + size, totalItems)));
    }

    return chunked;
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

      this.createGroupedCourses();
      this.loading = false;
    });
  }

  // Helper methods for formatting
  formatMonth(date: Date): string {
    if (!date) return '';
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return months[date.getMonth()];
  }

  formatDay(date: Date): string {
    if (!date) return '';
    return date.getDate().toString();
  }

  formatTime(date: Date): string {
    if (!date) return '';

    // Create a new date object to avoid mutating the original
    const courseDatex = new Date(date); // UTC date from backend
    const courseDate = new Date(courseDatex.getTime() + courseDatex.getTimezoneOffset() * 1); // Convert to UTC

    // Format start time with AM/PM
    const startTime = courseDate.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // Use 12-hour format with AM/PM
    });

    // Create end time (assuming 4 hours duration)
    const endDate = new Date(courseDate);
    endDate.setHours(courseDate.getHours() + 4);

    // Format end time with AM/PM
    const endTime = endDate.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // Use 12-hour format with AM/PM
    });

    // Return formatted string
    return `${startTime} - ${endTime} hrs`;
  }
}