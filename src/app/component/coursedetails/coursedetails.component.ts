import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseService } from '../../core/services/course.service';
import { CourseDateService } from '../../core/services/course-date.service';
import { Course } from '../../core/models/course.model';
import { CourseDate } from '../../core/models/course-date.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { CourseDatePickerComponent } from '../course-date-picker/course-date-picker.component';
import { CourseDateSelectorComponent } from '../course/course-date-selector/course-date-selector.component';
import { SafeUrlPipe } from '../../core/pipes/safe.pipe';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    SafeUrlPipe,
    CourseDateSelectorComponent
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
  @ViewChild('datesSection') datesSection!: ElementRef;
  
  course: Course | null = null;
  loading = true;
  loadError = false;
  errorMessage: string | null = null;
  selectedDate: Date | null = null;
  selectedCourseInstance: CourseDate | null = null;
  availableDates: NgbDateStruct[] = [];
  activeSection: 'overview' | 'curriculum' | 'instructor' | 'reviews' | 'dates' = 'overview';
  showDateAlert = false;
  alertTimeout: any;
  
  // Added flags for displaying course date features
  hasCourseDates = false;
  loadingCourseDates = false;
  minimumStudentsRequired = 6;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private courseDateService: CourseDateService,
    private calendar: NgbCalendar
  ) { }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    
    // Check for date or instance ID in query parameters
    const dateParam = this.route.snapshot.queryParamMap.get('date');
    const instanceIdParam = this.route.snapshot.queryParamMap.get('instanceId');

    if (dateParam) {
      try {
        this.selectedDate = new Date(dateParam);
        console.log('Date from URL:', this.selectedDate);
      } catch (error) {
        console.error('Error parsing date from URL', error);
      }
    }

    this.loadCourseData(courseId, instanceIdParam);
  }

  private loadCourseData(courseId: string | null, instanceId: string | null = null): void {
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
        
        // If an instance ID was provided, load that specific course instance
        if (instanceId) {
          this.loadCourseInstance(instanceId);
        } else {
          // Otherwise, load all course dates for this course
          this.loadingCourseDates = true;
          this.loadCourseDates(courseId);
        }
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
        const mockCourse = courses.find(c => c._id === courseId);
        if (mockCourse) {
          this.processCourse(mockCourse);
          this.loadingCourseDates = true;
          this.loadCourseDates(courseId);
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
    
    // Set minimum students required from course policy or use default
    this.minimumStudentsRequired = course.postponementPolicy?.minimumRequired || 6;
    
    // Convert available dates for legacy support
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
  
  private loadCourseDates(courseId: string): void {
    this.courseDateService.getCourseInstancesForCourse(courseId).subscribe({
      next: (instances) => {
        this.hasCourseDates = instances.length > 0;
        this.loadingCourseDates = false;
        
        // If we have a selected date but no instance, try to find one that matches
        if (this.selectedDate && !this.selectedCourseInstance) {
          this.tryMatchSelectedDateToInstance(instances);
        }
      },
      error: (error) => {
        console.error('Error loading course dates', error);
        this.loadingCourseDates = false;
        this.hasCourseDates = false;
      }
    });
  }
  
  private loadCourseInstance(instanceId: string): void {
    this.courseDateService.getCourseInstanceById(instanceId).subscribe({
      next: (instance) => {
        if (instance) {
          this.selectedCourseInstance = instance;
          this.selectedDate = new Date(instance.startDate);
          this.hasCourseDates = true;
        }
        this.loadingCourseDates = false;
      },
      error: (error) => {
        console.error('Error loading course instance', error);
        this.loadingCourseDates = false;
      }
    });
  }
  
  private tryMatchSelectedDateToInstance(instances: CourseDate[]): void {
    if (!this.selectedDate) return;
    
    // Try to find an instance with a matching date
    const matchingInstance = instances.find(instance => {
      const instanceDate = new Date(instance.startDate);
      return instanceDate.toDateString() === this.selectedDate?.toDateString();
    });
    
    if (matchingInstance) {
      this.selectedCourseInstance = matchingInstance;
    }
  }

  onCourseInstanceSelected(instance: CourseDate): void {
    this.selectedCourseInstance = instance;
    this.selectedDate = new Date(instance.startDate);
    
    // Update URL with selected instance ID (without navigation)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        instanceId: instance._id,
        date: this.selectedDate.toISOString()
      },
      queryParamsHandling: 'merge'
    });
  }

  // New method to handle inscription requests from the date selector
  onInscriptionRequested(instance: CourseDate): void {
    console.log("Inscription requested for instance:", instance);
    // Make sure we have selected this instance
    this.selectedCourseInstance = instance;
    this.selectedDate = new Date(instance.startDate);
    
    // Proceed to checkout
    this.proceedToCheckout();
  }

  changeSection(section: 'overview' | 'curriculum' | 'instructor' | 'reviews' | 'dates'): void {
    this.activeSection = section;
    
    // If changing to dates section, scroll to it after a short delay
    // to allow for component to render
    if (section === 'dates') {
      setTimeout(() => {
        if (this.datesSection) {
          this.datesSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }

  proceedToCheckout(): void {
    // If no date is selected, show alert and open dates section
    if (!this.selectedCourseInstance && !this.selectedDate) {
      this.showDateAlert = true;
      
      // Clear previous timeout if exists
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
      
      // Hide alert after 3 seconds
      this.alertTimeout = setTimeout(() => {
        this.showDateAlert = false;
      }, 3000);
      
      this.changeSection('dates');
      return;
    }

    // Navigate to checkout with the selected instance and date
    const queryParams: any = {};
    
    if (this.selectedCourseInstance) {
      queryParams.instanceId = this.selectedCourseInstance._id;
    }
    
    if (this.selectedDate) {
      queryParams.date = this.selectedDate.toISOString();
    }

    this.router.navigate(['/checkout', this.course?._id], { queryParams });
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