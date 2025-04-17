// company-success.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-company-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-success.component.html',
  styleUrls: ['./company-success.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CompanySuccessComponent implements OnInit {
  companyName: string | null = null;
  contactEmail: string | null = null;
  course: Course | null = null;
  selectedDate: Date | null = null;
  requestId: string | null = null;
  quantity: number = 1;
  loading = true;
  
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  
  ngOnInit(): void {
    this.companyName = this.route.snapshot.queryParamMap.get('companyName');
    this.contactEmail = this.route.snapshot.queryParamMap.get('contactEmail');
    this.requestId = this.route.snapshot.queryParamMap.get('requestId');
    
    const courseId = this.route.snapshot.queryParamMap.get('courseId');
    const dateParam = this.route.snapshot.queryParamMap.get('date');
    const quantityParam = this.route.snapshot.queryParamMap.get('quantity');
    
    if (quantityParam) {
      this.quantity = parseInt(quantityParam, 10) || 1;
    }
    
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
          this.loadFromMockData(courseId);
        }
      });
    } else {
      this.loading = false;
    }
  }
  
  private loadFromMockData(courseId: string): void {
    this.courseService.getMockCourses().subscribe({
      next: (courses) => {
        const mockCourse = courses.find(c => c._id === courseId);
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
  
  downloadRequestDetails(): void {
    // In a real implementation, this would generate a PDF
    // For now, we'll just show an alert
    alert('La funcionalidad de descarga estará disponible pronto.');
  }
}