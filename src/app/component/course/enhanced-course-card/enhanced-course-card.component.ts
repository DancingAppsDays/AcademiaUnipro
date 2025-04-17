// enhanced-course-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../../core/models/course.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Router } from '@angular/router';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { CourseDatePickerComponent } from '../../course-date-picker/course-date-picker.component';

@Component({
  selector: 'app-enhanced-course-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './enhanced-course-card.component.html',
  styleUrls: ['./enhanced-course-card.component.scss'],
  animations: [
    trigger('expandAnimation', [
      state('collapsed', style({
        height: '0',
        minHeight: '0',
        padding: '0',
        opacity: '0',
        transform: 'translateY(100%)'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1',
        transform: 'translateY(0)'
      })),
      transition('collapsed => expanded', [
        animate('200ms ease-out')
      ]),
      transition('expanded => collapsed', [
        animate('200ms ease-in')
      ])
    ])
  ]
})
export class EnhancedCourseCardComponent {
  @Input() course!: Course;
  @Output() dateSelected = new EventEmitter<{course: Course, date: Date}>();
  
  isExpanded = false;
  
  constructor(
    private modalService: NgbModal,
    private router: Router
  ) {}

  toggleExpanded(expanded: boolean): void {
    this.isExpanded = expanded;
  }
  
  viewCourseDetails(event: MouseEvent): void {
    // Prevent event bubbling
    event.preventDefault();
    event.stopPropagation();
    
    // Check if course and course.id exist before navigating
    if (this.course && this.course._id) {
      // Navigate to course details
      console.log('Navigating to course details for ID:', this.course._id);
      this.router.navigate(['/course', this.course._id]);
    } else {
      console.error('Cannot navigate to course details: course ID is undefined', this.course);
    }
  }
  
  consultDates(event: MouseEvent): void {
    // Prevent event bubbling
    event.preventDefault();
    event.stopPropagation();
    
    // Check if course exists and has available dates
    if (!this.course) {
      console.error('Cannot consult dates: course is undefined');
      return;
    }
    
    // Get available dates from the course
    if (!this.course.availableDates || this.course.availableDates.length === 0) {
      console.warn('No available dates for this course');
      alert('No hay fechas disponibles para este curso.');
      return;
    }
    
    // Open date picker modal
    console.log('Opening date picker with dates:', this.course.availableDates);
    const modalRef = this.modalService.open(CourseDatePickerComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
    
    // Pass available dates to the date picker
    modalRef.componentInstance.availableDates = this.course.availableDates.map(date => {
      const dateObj = new Date(date);
      return {
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        day: dateObj.getDate()
      };
    });
    
    // Handle date selection
    modalRef.componentInstance.dateSelected.subscribe((date: Date) => {
      // Emit date selected event with course and date
      this.dateSelected.emit({ course: this.course, date: date });
      modalRef.close();
    });
    
    // Handle cancel 
    modalRef.componentInstance.cancelled.subscribe(() => {
      modalRef.close();
    });
  }
  
  cardClick(event: MouseEvent): void {
    // Prevent default behavior 
    event.preventDefault();
    event.stopPropagation();
    
    // Navigate to course details
    this.viewCourseDetails(event);
  }
}