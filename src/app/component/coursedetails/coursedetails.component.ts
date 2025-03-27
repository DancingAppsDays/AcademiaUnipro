// course-detail.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbDateStruct, NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { CourseDatePickerComponent } from '../course-date-picker/course-date-picker.component';
import { SafeUrlPipe } from '../../core/pipes/safe.pipe';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    SafeUrlPipe
  ],
  templateUrl: './coursedetails.component.html',
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
    ]),
    trigger('alertAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  loading = true;
  loadError = false;
  errorMessage: string | null = null;
  selectedDate: Date | null = null;
  availableDates: NgbDateStruct[] = [];
  activeSection: 'overview' | 'curriculum' | 'instructor' | 'reviews' = 'overview';
  showDateAlert = false;
  alertTimeout: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private modalService: NgbModal,
    private calendar: NgbCalendar
  ) { }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    
    // Check for date in query parameters
    const dateParam = this.route.snapshot.queryParamMap.get('date');
    if (dateParam) {
      try {
        this.selectedDate = new Date(dateParam);
        console.log('Date from URL:', this.selectedDate);
      } catch (error) {
        console.error('Error parsing date from URL', error);
      }
    }

    this.loadCourseData(courseId);
  }

  private loadCourseData(courseId: string | null): void {
    if (!courseId) {
      this.loading = false;
      this.loadError = true;
      this.errorMessage = "No se especificó un curso";
      return;
    }

    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        if (!course) {
          this.loadFromMockData(courseId);
          return;
        }
        
        this.processCourse(course);
      },
      error: (error) => {
        console.error('Error loading course details', error);
        this.loadFromMockData(courseId);
      }
    });
  }

  private loadFromMockData(courseId: string): void {
    console.log('Loading course from mock data');
    
    this.courseService.getMockCourses().subscribe({
      next: (courses) => {
        const mockCourse = courses.find(c => c.id === courseId);
        if (mockCourse) {
          this.processCourse(mockCourse);
        } else {
          this.loading = false;
          this.loadError = true;
          this.errorMessage = "No se encontró el curso especificado";
        }
      },
      error: (fallbackError) => {
        this.loading = false;
        this.loadError = true;
        this.errorMessage = "Error al cargar los datos del curso";
        console.error('Failed to load mock course data', fallbackError);
      }
    });
  }

  private processCourse(course: Course): void {
    this.course = course;
    
    // Convert available dates
    if (course.availableDates && course.availableDates.length > 0) {
      this.availableDates = course.availableDates.map(date => {
        const dateObj = new Date(date);
        return {
          year: dateObj.getFullYear(),
          month: dateObj.getMonth() + 1,
          day: dateObj.getDate()
        };
      });
      
      // Validate selected date against available dates
      this.validateSelectedDate();
    }
    
    this.loading = false;
  }

  private validateSelectedDate(): void {
    if (!this.selectedDate || !this.availableDates.length) {
      return;
    }
    
    // Check if selected date is in available dates
    const selectedYear = this.selectedDate.getFullYear();
    const selectedMonth = this.selectedDate.getMonth() + 1;
    const selectedDay = this.selectedDate.getDate();
    
    const isDateAvailable = this.availableDates.some(date => 
      date.year === selectedYear && 
      date.month === selectedMonth && 
      date.day === selectedDay
    );
    
    if (!isDateAvailable) {
      console.warn('Selected date is not available');
      this.selectedDate = null;
    }
  }

  openDatePicker(): void {
    if (!this.course || !this.availableDates.length) {
      console.warn('No available dates for this course');
      return;
    }
    
    const modalRef = this.modalService.open(CourseDatePickerComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
    
    // Pass available dates to the date picker
    modalRef.componentInstance.availableDates = this.availableDates;
    
    // Pass initial date if one is already selected
    if (this.selectedDate) {
      modalRef.componentInstance.initialDate = {
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth() + 1,
        day: this.selectedDate.getDate()
      };
    }
    
    // Handle date selection
    modalRef.componentInstance.dateSelected.subscribe((date: Date) => {
      this.selectedDate = date;
      // Update URL with selected date (without navigation)
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { date: date.toISOString() },
        queryParamsHandling: 'merge'
      });
      modalRef.close();
    });
    
    // Handle cancel
    modalRef.componentInstance.cancelled.subscribe(() => {
      modalRef.close();
    });
  }

  changeSection(section: 'overview' | 'curriculum' | 'instructor' | 'reviews'): void {
    this.activeSection = section;
  }

  proceedToCheckout(): void {
    if (!this.selectedDate) {
      // If no date is selected, show alert and open date picker
      this.showDateAlert = true;
      
      // Clear previous timeout if exists
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
      
      // Hide alert after 3 seconds
      this.alertTimeout = setTimeout(() => {
        this.showDateAlert = false;
      }, 3000);
      
      this.openDatePicker();
      return;
    }

    // Navigate to checkout with the selected date
    this.router.navigate(['/checkout', this.course?.id], {
      queryParams: { date: this.selectedDate.toISOString() }
    });
  }

  proceedToQuickCheckout(): void {
    if (!this.selectedDate) {
      // If no date is selected, show alert and open date picker
      this.showDateAlert = true;
      
      // Clear previous timeout if exists
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
      
      // Hide alert after 3 seconds
      this.alertTimeout = setTimeout(() => {
        this.showDateAlert = false;
      }, 3000);
      
      this.openDatePicker();
      return;
    }

    // Navigate to quick checkout with the selected date
    this.router.navigate(['/quick-checkout', this.course?.id], {
      queryParams: { date: this.selectedDate.toISOString() }
    });
  }
  
  // Useful date formatting helpers
  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  isDateAvailable(date: NgbDateStruct): boolean {
    return this.availableDates.some(
      d => d.year === date.year && d.month === date.month && d.day === date.day
    );
  }
  
  isToday(date: NgbDateStruct): boolean {
    const today = this.calendar.getToday();
    return date.year === today.year && date.month === today.month && date.day === today.day;
  }
}