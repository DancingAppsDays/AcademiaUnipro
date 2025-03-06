// course-date-picker.component.ts
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbDateStruct, NgbCalendar, NgbDate, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-course-date-picker',
  standalone: true,
  imports: [CommonModule, NgbDatepickerModule],
  template: `
    <div class="course-date-picker">
      <div class="date-picker-header">
        <h4>Selecciona fecha del curso</h4>
        <p class="text-muted">Solo puedes seleccionar las fechas disponibles (resaltadas)</p>
      </div>
      
      <div class="calendar-container">
        <ngb-datepicker
          #dp
          [displayMonths]="displayMonths"
          [dayTemplate]="customDay"
          [markDisabled]="isDateDisabled"
          (dateSelect)="onDateChange($event)"
          [minDate]="minDate"
          [maxDate]="maxDate"
          [startDate]="startDate"
          navigation="arrows"
          outsideDays="hidden">
        </ngb-datepicker>
        
        <ng-template #customDay let-date let-currentMonth="currentMonth" let-selected="selected" let-disabled="disabled" let-focused="focused">
          <div class="custom-day"
            [class.available]="isDateAvailable(date)"
            [class.selected]="isDateSelected(date)"
            [class.unavailable]="!isDateAvailable(date)"
            [class.today]="isToday(date)"
            [class.focused]="focused"
            (click)="onDayClick(date, isDateAvailable(date))"
            [ngStyle]="{'pointer-events': isDateAvailable(date) ? 'auto' : 'none'}">
            {{ date.day }}
            <div class="available-indicator" *ngIf="isDateAvailable(date)"></div>
          </div>
        </ng-template>
      </div>
      
      <div class="calendar-legend">
        <div class="legend-item">
          <span class="legend-color available"></span>
          <span>Fecha disponible</span>
        </div>
        <div class="legend-item">
          <span class="legend-color selected"></span>
          <span>Fecha seleccionada</span>
        </div>
        <div class="legend-item">
          <span class="legend-color today"></span>
          <span>Hoy</span>
        </div>
        <div class="legend-item">
          <span class="legend-color unavailable"></span>
          <span>No disponible</span>
        </div>
      </div>
      
      <div class="selected-date-info" *ngIf="selectedDateStruct">
        <div class="info-badge">
          <i class="bi bi-calendar-check"></i>
        </div>
        <div class="info-content">
          <small>Fecha seleccionada</small>
          <strong>{{ formatDate(selectedDateStruct) }}</strong>
        </div>
      </div>
      
      <div class="action-buttons">
        <button type="button" class="btn btn-secondary" (click)="cancelSelection()">
          Cancelar
        </button>
        <button 
          type="button" 
          class="btn btn-primary" 
          [disabled]="!selectedDateStruct"
          (click)="confirmSelection()">
          Confirmar fecha
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./course-date-picker.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CourseDatePickerComponent implements OnInit {
  @Input() availableDates: NgbDateStruct[] = [];
  @Input() initialDate: NgbDateStruct | null = null;
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() cancelled = new EventEmitter<void>();
  
  selectedDateStruct: NgbDateStruct | null = null;
  displayMonths = 1;
  minDate!: NgbDateStruct;
  maxDate!: NgbDateStruct;
  startDate!: NgbDateStruct;
  
  private calendar = inject(NgbCalendar);
  private config = inject(NgbDatepickerConfig);
  
  ngOnInit(): void {
    this.checkScreenSize();
    
    // Set initial date if provided and it's available
    if (this.initialDate && this.isDateInAvailableDates(this.initialDate)) {
      this.selectedDateStruct = this.initialDate;
    }
    
    // Set min date to today
    this.minDate = this.calendar.getToday();
    
    // Set max date to 6 months from now
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);
    this.maxDate = {
      year: futureDate.getFullYear(),
      month: futureDate.getMonth() + 1,
      day: futureDate.getDate()
    };
    
    // Find the earliest available date to show first
    if (this.availableDates.length > 0) {
      // Sort available dates
      const sorted = [...this.availableDates].sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1, a.day);
        const dateB = new Date(b.year, b.month - 1, b.day);
        return dateA.getTime() - dateB.getTime();
      });
      
      // Set start date to earliest available date if it's in the future
      const firstDate = sorted[0];
      const firstDateObj = new Date(firstDate.year, firstDate.month - 1, firstDate.day);
      
      if (firstDateObj > new Date()) {
        this.startDate = firstDate;
      } else {
        this.startDate = this.minDate;
      }
    } else {
      this.startDate = this.minDate;
    }
    
    // Configure datepicker
    this.config.outsideDays = 'hidden';
    this.config.navigation = 'arrows';
  }
  
  private checkScreenSize(): void {
    this.displayMonths = window.innerWidth > 768 ? 2 : 1;
  }
  
  isDateAvailable(date: NgbDateStruct): boolean {
    return this.availableDates.some(
      d => d.year === date.year && d.month === date.month && d.day === date.day
    );
  }
  
  isDateInAvailableDates(date: NgbDateStruct): boolean {
    return this.availableDates.some(
      d => d.year === date.year && d.month === date.month && d.day === date.day
    );
  }
  
  isDateDisabled = (date: NgbDateStruct): boolean => {
    return !this.isDateAvailable(date);
  }
  
  isDateSelected(date: NgbDateStruct): boolean {
    if (!this.selectedDateStruct) return false;
    
    return date.year === this.selectedDateStruct.year && 
           date.month === this.selectedDateStruct.month && 
           date.day === this.selectedDateStruct.day;
  }
  
  isToday(date: NgbDateStruct): boolean {
    const today = this.calendar.getToday();
    return date.year === today.year && date.month === today.month && date.day === today.day;
  }
  
  onDateChange(date: NgbDateStruct): void {
    // This handles the built-in dateSelect event
    // Only set the selected date if it's available
    if (this.isDateInAvailableDates(date)) {
      this.selectedDateStruct = date;
    }
  }
  
  onDayClick(date: NgbDateStruct, isAvailable: boolean): void {
    // Custom click handler for the day template
    if (isAvailable) {
      this.selectedDateStruct = date;
    }
  }
  
  confirmSelection(): void {
    if (!this.selectedDateStruct) return;
    
    const selectedDate = new Date(
      this.selectedDateStruct.year,
      this.selectedDateStruct.month - 1,
      this.selectedDateStruct.day
    );
    
    this.dateSelected.emit(selectedDate);
  }
  
  cancelSelection(): void {
    this.cancelled.emit();
  }
  
  formatDate(date: NgbDateStruct): string {
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const weekdays = [
      'domingo', 'lunes', 'martes', 'miércoles', 
      'jueves', 'viernes', 'sábado'
    ];
    
    const dateObj = new Date(date.year, date.month - 1, date.day);
    const weekday = weekdays[dateObj.getDay()];
    
    return `${weekday}, ${date.day} de ${monthNames[date.month - 1]} de ${date.year}`;
  }
}