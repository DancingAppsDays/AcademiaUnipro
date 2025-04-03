// src/app/component/course/course-date-selector/course-date-selector.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseDateService } from '../../../core/services/course-date.service';
import { CourseDate, CourseDateWithAvailability } from '../../../core/models/course-date.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-course-date-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="date-selector-container">
      <div class="section-header">
        <h3>Fechas Disponibles</h3>
        <p class="text-muted">Selecciona una fecha para el curso</p>
      </div>
      
      <div class="alert alert-info policy-alert" *ngIf="showPostponementPolicy">
        <i class="bi bi-info-circle me-2"></i>
        <div>
          <strong>Política de Aplazamiento</strong>
          <p>Este curso requiere un mínimo de {{ minimumRequired }} participantes para realizarse. 
             Si no se alcanza este mínimo 2 días antes de la fecha, el curso podría ser reprogramado. 
             Los participantes inscritos serían reubicados a la siguiente fecha disponible o podrían solicitar un reembolso.</p>
        </div>
      </div>
      
      <div class="date-list" *ngIf="instances.length > 0">
        <div class="date-card" *ngFor="let instance of instances"
             [class.selected]="selectedInstanceId === instance.id"
             [class.nearly-full]="instance.isNearlyFull"
             [class.at-risk]="instance.isAtRiskOfPostponement"
             (click)="selectInstance(instance)">
          
          <div class="date-header">
            <div class="date-info">
              <i class="bi bi-calendar-event"></i>
              <span>{{ instance.startDate | date:'EEEE, d MMMM, yyyy':'':'es' }}</span>
            </div>
            <div class="seats-info" [class.seats-warning]="instance.isNearlyFull">
              <i class="bi" [ngClass]="instance.availableSeats > 0 ? 'bi-person-check' : 'bi-x-circle'"></i>
              <span>{{ instance.availableSeats }} / {{ instance.capacity }} plazas disponibles</span>
            </div>
          </div>
          
          <div class="date-details">
            <div class="detail-item">
              <i class="bi bi-clock"></i>
              <span>{{ instance.startDate | date:'shortTime' }} - {{ instance.endDate | date:'shortTime' }}</span>
            </div>
            <div class="detail-item">
              <i class="bi bi-geo-alt"></i>
              <span>{{ instance.location }}</span>
            </div>
            <div class="detail-item">
              <i class="bi bi-person-badge"></i>
              <span>{{ instance.instructor.name }}</span>
            </div>
          </div>
          
          <div class="date-status">
            <div class="status-badge" *ngIf="instance.isConfirmed">
              <i class="bi bi-check-circle"></i>
              <span>Confirmado</span>
            </div>
            <div class="status-badge warning" *ngIf="instance.isAtRiskOfPostponement">
              <i class="bi bi-exclamation-triangle"></i>
              <span>Riesgo de aplazamiento</span>
            </div>
            <div class="status-badge nearly-full" *ngIf="instance.isNearlyFull && !instance.isAtRiskOfPostponement">
              <i class="bi bi-exclamation-circle"></i>
              <span>¡Últimos lugares!</span>
            </div>
          </div>
          
          <button class="btn btn-primary select-date-btn"
                 [disabled]="instance.availableSeats <= 0"
                 [class.selected]="selectedInstanceId === instance.id">
            {{ selectedInstanceId === instance.id ? 'Seleccionado' : 'Seleccionar' }}
          </button>
        </div>
      </div>
      
      <div class="no-dates-message" *ngIf="instances.length === 0">
        <i class="bi bi-calendar-x"></i>
        <p>No hay fechas disponibles para este curso en este momento.</p>
        <p>Por favor, consulte más adelante o contáctenos para más información.</p>
      </div>
    </div>
  `,
  styles: [`
    .date-selector-container {
      font-family: 'Montserrat', sans-serif;
    }
    
    .section-header {
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .section-header h3 {
      font-weight: 700;
      color: #0066b3;
      margin-bottom: 0.5rem;
    }
    
    .policy-alert {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      background-color: rgba(0, 102, 179, 0.1);
      border: none;
      border-radius: 10px;
    }
    
    .policy-alert i {
      font-size: 1.5rem;
      color: #0066b3;
      margin-top: 0.3rem;
    }
    
    .policy-alert p {
      margin-bottom: 0;
    }
    
    .date-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .date-card {
      background-color: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    
    .date-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    .date-card.selected {
      border: 2px solid #0066b3;
      background-color: rgba(0, 102, 179, 0.05);
    }
    
    .date-card.nearly-full {
      border-left: 4px solid #ffc107;
    }
    
    .date-card.at-risk {
      border-left: 4px solid #dc3545;
    }
    
    .date-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    
    .date-info {
      display: flex;
      align-items: center;
      font-weight: 700;
      color: #0066b3;
      margin-bottom: 0.5rem;
    }
    
    .date-info i {
      margin-right: 0.5rem;
    }
    
    .seats-info {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: #555;
    }
    
    .seats-info i {
      margin-right: 0.5rem;
    }
    
    .seats-info.seats-warning {
      color: #dc3545;
      font-weight: 500;
    }
    
    .date-details {
      margin-bottom: 1.5rem;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    .detail-item i {
      width: 20px;
      margin-right: 0.5rem;
      color: #0066b3;
    }
    
    .date-status {
      margin-bottom: 1rem;
    }
    
    .status-badge {
      display: inline-flex;
      align-items: center;
      background-color: #28a745;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .status-badge i {
      margin-right: 0.3rem;
    }
    
    .status-badge.warning {
      background-color: #dc3545;
    }
    
    .status-badge.nearly-full {
      background-color: #ffc107;
      color: #212529;
    }
    
    .select-date-btn {
      width: 100%;
      margin-top: 0.5rem;
    }
    
    .select-date-btn.selected {
      background-color: #004c86;
    }
    
    .no-dates-message {
      text-align: center;
      padding: 2rem;
      background-color: #f8f9fa;
      border-radius: 10px;
      margin-top: 1rem;
    }
    
    .no-dates-message i {
      font-size: 3rem;
      color: #6c757d;
      margin-bottom: 1rem;
    }
    
    @media (max-width: 767px) {
      .date-list {
        grid-template-columns: 1fr;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CourseDateSelectorComponent implements OnInit, OnChanges {
  @Input() courseId!: string;
  @Input() minimumRequired: number = 6;
  @Input() showPostponementPolicy: boolean = true;
  @Input() preSelectedInstanceId?: string;
  
  @Output() instanceSelected = new EventEmitter<CourseDate>();
  
  instances: CourseDateWithAvailability[] = [];
  selectedInstanceId?: string;
  loading = true;
  
  constructor(private courseDateService: CourseDateService) {}
  
  ngOnInit(): void {
    this.loadCourseInstances();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseId'] && !changes['courseId'].firstChange) {
      this.loadCourseInstances();
    }
    
    if (changes['preSelectedInstanceId']) {
      this.selectedInstanceId = this.preSelectedInstanceId;
    }
  }
  
  loadCourseInstances(): void {
    if (!this.courseId) return;
    
    this.loading = true;
    this.courseDateService.getCourseInstancesForCourse(this.courseId).subscribe({
      next: (instances) => {
        // Enrich instances with availability information
        this.instances = instances.map(instance => 
          this.courseDateService.checkAvailability(instance)
        );
        
        this.loading = false;
        
        // Automatically select preselected instance if provided
        if (this.preSelectedInstanceId) {
          this.selectedInstanceId = this.preSelectedInstanceId;
        }
      },
      error: (error) => {
        console.error('Error loading course instances', error);
        this.loading = false;
        this.instances = [];
      }
    });
  }
  
  selectInstance(instance: CourseDateWithAvailability): void {
    if (instance.availableSeats <= 0) return;
    
    this.selectedInstanceId = instance.id;
    this.instanceSelected.emit(instance);
  }
}