// src/app/core/services/course-date-picker.service.ts
import { Injectable } from '@angular/core';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CourseDatePickerComponent } from '../../component/course-date-picker/course-date-picker.component';
import { CourseDateService } from './course-date.service';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseDatePickerService {
  
  constructor(
    private modalService: NgbModal,
    private courseDateService: CourseDateService
  ) {}
  
  /**
   * Opens a date picker modal showing available dates for a course
   * @param availableDates - Array of available dates
   * @param currentSelectedDate - Currently selected date (if any)
   * @param onDateSelected - Callback function when a date is selected
   * @returns NgbModalRef - Reference to the opened modal
   */
  openDatePicker(
    availableDates: Date[],
    currentSelectedDate: Date | null,
    onDateSelected: (date: Date) => void
  ): NgbModalRef {
    // Create component via the modal service
    const modalRef = this.modalService.open(CourseDatePickerComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
    
    // Format available dates for the date picker component
    const formattedDates = availableDates.map(date => {
      const dateObj = new Date(date);
      return {
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        day: dateObj.getDate()
      };
    });
    
    // Set inputs on the component
    modalRef.componentInstance.availableDates = formattedDates;
    
    // Set initial date if one is already selected
    if (currentSelectedDate) {
      modalRef.componentInstance.initialDate = {
        year: currentSelectedDate.getFullYear(),
        month: currentSelectedDate.getMonth() + 1,
        day: currentSelectedDate.getDate()
      };
    }
    
    // Subscribe to output events
    modalRef.componentInstance.dateSelected.subscribe((date: Date) => {
      onDateSelected(date);
      modalRef.close();
    });
    
    // Handle cancellation
    modalRef.componentInstance.cancelled.subscribe(() => {
      modalRef.close();
    });
    
    return modalRef;
  }

  /**
   * Opens a date picker for a specific course, checking available capacity
   * @param courseId - ID of the course to get dates for
   * @param currentSelectedDate - Currently selected date (if any)
   * @param onDateSelected - Callback function when a date is selected
   * @returns Promise<NgbModalRef> - Promise resolving to the modal reference
   */
  async openDatePickerForCourse(
    courseId: string,
    currentSelectedDate: Date | null,
    onDateSelected: (date: Date) => void
  ): Promise<NgbModalRef | null> {
    try {
      // Get course dates with availability info
      const instances = await lastValueFrom(
        this.courseDateService.getCourseInstancesForCourse(courseId)
      );
      
      if (!instances || instances.length === 0) {
        console.error('No available dates for this course');
        // You could open a different modal here to inform the user
        return null;
      }

      // Get current date to filter out past dates
      const now = new Date();

      // Filter to only include future dates with available capacity
      const availableDatesWithCapacity = instances
        .map(instance => this.courseDateService.checkAvailability(instance))
        .filter(instance => {
          const startDate = new Date(instance.startDate);
          return instance.availableSeats > 0 && startDate > now; // Filter out past dates and full dates
        })
        .map(instance => new Date(instance.startDate));
      
      if (availableDatesWithCapacity.length === 0) {
        console.error('All dates are at full capacity or have already passed');
        // You could open a different modal here to inform the user
        return null;
      }
      
      // Open the date picker with available dates
      return this.openDatePicker(
        availableDatesWithCapacity,
        currentSelectedDate,
        onDateSelected
      );
    } catch (error) {
      console.error('Error fetching course dates', error);
      return null;
    }
  }
}