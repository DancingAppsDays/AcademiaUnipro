// src/app/component/course/enhanced-course-card/enhanced-course-card.component.ts
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger, state } from '@angular/animations';

import { Course } from '../../../core/models/course.model';
import { CourseDate } from '../../../core/models/course-date.model';
import { CourseDateService } from '../../../core/services/course-date.service';
import { CourseDatePickerService } from '../../../core/services/course-date-picker.service';
import { CourseDateSelectorComponent } from '../course-date-selector/course-date-selector.component';
import { CourseDatePickerComponent } from '../../course-date-picker/course-date-picker.component';

@Component({
  selector: 'app-enhanced-course-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CourseDateSelectorComponent, CourseDatePickerComponent],
  templateUrl: './enhanced-course-card.component.html',
  styleUrls: ['./enhanced-course-card.component.scss'],
  animations: [
    trigger('expandAnimation', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('250ms ease-in-out')
      ])
    ])
  ]
})
export class EnhancedCourseCardComponent implements OnInit {
  @Input() course!: Course;
  @Output() dateSelected = new EventEmitter<{course: Course, date: Date}>();
  
  @ViewChild('dateSelectionModal') dateSelectionModal!: TemplateRef<any>;
  
  isExpanded = false;
  availableDates: CourseDate[] = [];
  loadingDates = false;
  
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private courseDateService: CourseDateService,
    private courseDatePickerService: CourseDatePickerService
  ) {}
  
  ngOnInit(): void {
    // You could pre-fetch available dates here if needed
  }
  
  toggleExpanded(expanded: boolean): void {
    this.isExpanded = expanded;
  }
  
  cardClick(event: Event): void {
    // Prevent default only if clicking on the card itself (not a button)
    if (!(event.target as HTMLElement).closest('button')) {
      event.preventDefault();
      event.stopPropagation();
      this.viewCourseDetails(event);
    }
  }
  
  viewCourseDetails(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/course', this.course._id]);
  }
  
  async consultDates(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    
    this.loadingDates = true;
    
    try {
      // Use the enhanced service method that checks capacity
      const modalRef = await this.courseDatePickerService.openDatePickerForCourse(
        this.course._id,
        null,
        (selectedDate: Date) => this.onDateSelected(selectedDate)
      );
      
      // If no modalRef is returned, it means no dates are available or all are at capacity
      if (!modalRef) {
        // Fetch the dates anyway to show in the "no dates available" modal
        const dates = await this.courseDateService.getCourseInstancesForCourse(this.course._id).toPromise();
        this.availableDates = dates || [];
        
        // Open the no dates available modal
        this.modalService.open(this.dateSelectionModal, { centered: true });
      }
      
      this.loadingDates = false;
    } catch (error) {
      console.error('Error consulting dates:', error);
      this.loadingDates = false;
      this.modalService.open(this.dateSelectionModal, { centered: true });
    }
  }
  
  onDateSelected(date: Date): void {
    // Emit selected date to parent component
    this.dateSelected.emit({
      course: this.course,
      date: date
    });
    
    // Optionally, navigate to course details with selected date
    this.router.navigate(['/course', this.course._id], {
      queryParams: { date: date.toISOString() }
    });
  }
  
  // Helper methods for formatting dates
  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  getMonth(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-MX', { month: 'short' }).toUpperCase();
  }
  
  getDay(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.getDate().toString();
  }
  
  formatTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }
}