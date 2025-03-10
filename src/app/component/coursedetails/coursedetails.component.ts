import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct, NgbModal, NgbModalRef, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { SafeUrlPipe } from '../../core/pipes/safe.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { slideInAnimation } from '../../route-animations'; // Import the route animations
import { CourseDatePickerComponent } from '../course-date-picker/course-date-picker.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  selectedDate: Date | null = null;
  availableDates: NgbDateStruct[] = [];
  activeSection: 'overview' | 'curriculum' | 'instructor' | 'reviews' = 'overview';
  videoUrl: SafeResourceUrl | null = null;
  showDateAlert = false;
  alertTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private calendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<Date>,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');

    if (!courseId) {
      this.loading = false;
      return;
    }

    // Fetch course data with improved error handling
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        // Check if course is undefined or null
        if (!course) {
          this.loadFromMockData(courseId);
          return;
        }

        this.processCourse(course);
      },
      error: (error) => {
        console.error('Error loading course details, falling back to mock data', error);
        this.loadFromMockData(courseId);
      }
    });
  }

  // Separate method for loading from mock data
  private loadFromMockData(courseId: string): void {
    console.log('Attempting to load course from mock data');

    this.courseService.getMockCourses().subscribe({
      next: (courses) => {
        const mockCourse = courses.find(c => c.id === courseId);
        if (mockCourse) {
          this.processCourse(mockCourse);
        } else {
          console.error('Course not found in mock data');
          this.loading = false;
        }
      },
      error: (fallbackError) => {
        console.error('Failed to load mock course data', fallbackError);
        this.loading = false;
      }
    });
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
    } else {
      this.availableDates = []; // Ensure availableDates is an empty array if undefined or empty
    }

    this.loading = false;

    // Generate the YouTube embed URL
    if (course.previewVideoUrl) {
      course.previewVideoUrl = 'https://www.youtube.com/embed/sample8'
      //this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getEmbedUrl(course.previewVideoUrl));
    }
  }
  private getEmbedUrl(videoUrl: string): string {
    const videoId = videoUrl.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  selectDate(date: NgbDateStruct): void {
    // Convert NgbDateStruct to Date
    this.selectedDate = new Date(date.year, date.month - 1, date.day);
  }

  isDateAvailablelegacy(date: NgbDateStruct): boolean {
    return this.availableDates.some(
      d => d.year === date.year && d.month === date.month && d.day === date.day
    );
  }
  isDateAvailable(date: NgbDateStruct): boolean {
    // Return true if date should be DISABLED (not available)
    return !this.availableDates.some(
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

  /*openDateModal(content: any): void {
    this.modalService.open(content, { centered: true });
  }*/
  proceedToQuickCheckout(): void {
    if (!this.selectedDate) {
      alert('Por favor selecciona una fecha para el curso');
      return;
    }

    this.router.navigate(['/quick-checkout', this.course?.id], {
      queryParams: { date: this.selectedDate.toISOString() }
    });
  }


  checkDateAndProceed(checkoutType: 'regular' | 'quick'): void {
    if (!this.selectedDate) {
      // Show the date picker
      this.openDateSelector();

      // Show the alert
      this.showDateAlert = true;

      // Clear any existing timeout
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }

      // Hide the alert after 3 seconds
      this.alertTimeout = setTimeout(() => {
        this.showDateAlert = false;
      }, 3000);

      return;
    }

    // If date is selected, proceed to checkout
    if (checkoutType === 'regular') {
      this.router.navigate(['/checkout', this.course?.id], {
        queryParams: { date: this.selectedDate.toISOString() }
      });
    } else {
      this.router.navigate(['/quick-checkout', this.course?.id], {
        queryParams: { date: this.selectedDate.toISOString() }
      });
    }
  }




  openDateSelector(): void {
    const modalRef = this.modalService.open(CourseDatePickerComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.availableDates = this.availableDates;
    modalRef.componentInstance.initialDate = this.selectedDate ?
      {
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth() + 1,
        day: this.selectedDate.getDate()
      } : null;

    modalRef.componentInstance.dateSelected.subscribe((date: Date) => {
      this.selectedDate = date;
      modalRef.close();
    });

    modalRef.componentInstance.cancelled.subscribe(() => {
      modalRef.close();
    });
  }
}