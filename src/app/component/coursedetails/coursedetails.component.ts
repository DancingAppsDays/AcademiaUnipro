


// course-detail.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct, NgbModal, NgbModalRef, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { SafeUrlPipe } from '../../core/pipes/safe.pipe';

@Component({
  selector: 'app-coursedetails',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbDatepickerModule, SafeUrlPipe],
  templateUrl: '../coursedetails/coursedetails.component.html',
  styleUrls: ['./coursedetails.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(30px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  loading = true;
  selectedDate: Date | null = null;
  availableDates: NgbDateStruct[] = [];
  activeSection: 'overview' | 'curriculum' | 'instructor' | 'reviews' = 'overview';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private calendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<Date>,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe({
        next: (course) => {
          this.processCourse(course);
          this.loading = false;
          
          // Convert available dates to NgbDateStruct format
          if (course.availableDates && course.availableDates.length > 0) {
            this.availableDates = course.availableDates.map(date => {
              const dateObj = new Date(date);
              return {
                year: dateObj.getFullYear(),
                month: dateObj.getMonth() + 1,
                day: dateObj.getDate()
              };
            });
          }
        },
        error: (error) => {
          console.error('Error loading course details', error);
            // Fallback to mock data
            this.courseService.getMockCourses().subscribe(courses => {
              const mockCourse = courses.find(c => c.id === courseId);
              if (mockCourse) {
                this.processCourse(mockCourse);
              } else {
                this.loading = false;
                console.error('Course not found in mock data');
              }});
        }
      });
    }
  }
  
  private processCourse(course: Course): void {
    this.course = course;
    
    // Convert available dates to NgbDateStruct format
    if (course.availableDates && course.availableDates.length > 0) {
      this.availableDates = course.availableDates.map(date => {
        const dateObj = new Date(date);
        return {
          year: dateObj.getFullYear(),
          month: dateObj.getMonth() + 1,
          day: dateObj.getDate()
        };
      });
    }
    
    this.loading = false;
  }

  selectDate(date: NgbDateStruct): void {
    // Convert NgbDateStruct to Date
    this.selectedDate = new Date(date.year, date.month - 1, date.day);
  }
  
  isDateAvailable(date: NgbDateStruct): boolean {
    return this.availableDates.some(
      d => d.year === date.year && d.month === date.month && d.day === date.day
    );
  }
  
  isSelected(date: NgbDateStruct): boolean {
    if (!this.selectedDate) return false;
    
    const selected = new Date(this.selectedDate);
    return date.year === selected.getFullYear() &&
           date.month === selected.getMonth() + 1 &&
           date.day === selected.getDate();
  }
  
  changeSection(section: 'overview' | 'curriculum' | 'instructor' | 'reviews'): void {
    this.activeSection = section;
  }
  
  proceedToCheckout(): void {
    if (!this.selectedDate) {
      alert('Por favor selecciona una fecha para el curso');
      return;
    }
    
    this.router.navigate(['/checkout', this.course?.id], {
      queryParams: { date: this.selectedDate.toISOString() }
    });
  }
  
  openDateModal(content: any): void {
    this.modalService.open(content, { centered: true });
  }
}