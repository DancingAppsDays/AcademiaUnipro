// course-date-picker.service.ts
import { Injectable } from '@angular/core';
import { NgbDateStruct, NgbModal,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CourseDatePickerComponent } from '../../component/course-date-picker/course-date-picker.component';

@Injectable({
  providedIn: 'root'
})
export class CourseDatePickerService {
  
  constructor(private modalService: NgbModal) {}
  
  openDatePicker(
    availableDates: Date[],
    currentSelectedDate: Date | null,
    onDateSelected: (date: Date) => void
  ): NgbModalRef  {
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
}