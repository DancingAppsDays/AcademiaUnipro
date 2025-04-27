// src/app/admin/components/admin-course-dates/admin-course-dates.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CourseDateStatus } from '../../../core/models/course-date.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-course-dates',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-course-dates">
      <div class="page-header">
        <h1>Course Dates Management</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="checkPostponementStatus()">
            <i class="bi bi-arrow-clockwise"></i> Check Postponement Status
          </button>
        </div>
      </div>
      
      <div class="filters">
        <div class="row">
          <div class="col-md-4 mb-3">
            <label for="statusFilter">Status</label>
            <select id="statusFilter" class="form-select" [(ngModel)]="filterDto.status" (change)="loadCourseDates()">
              <option [ngValue]="undefined">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="postponed">Postponed</option>
              <option value="canceled">Canceled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div class="col-md-4 mb-3">
            <label for="startDateFrom">Start Date From</label>
            <input type="date" id="startDateFrom" class="form-control" 
                  [(ngModel)]="startDateFrom" (change)="updateDateFilter()">
          </div>
          
          <div class="col-md-4 mb-3">
            <label for="startDateTo">Start Date To</label>
            <input type="date" id="startDateTo" class="form-control" 
                  [(ngModel)]="startDateTo" (change)="updateDateFilter()">
          </div>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div *ngIf="!loading" class="course-dates-list">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Course</th>
              <th>Start Date</th>
              <th>Instructor</th>
              <th>Enrolled</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let courseDate of courseDates" 
                [ngClass]="{'at-risk': isAtRisk(courseDate), 'confirmed': courseDate.status === 'confirmed'}">
              <td>{{courseDate.course.title}}</td>
              <td>{{courseDate.startDate | date:'medium'}}</td>
              <td>{{courseDate.instructor.name}}</td>
              <td>{{courseDate.enrolledCount}}/{{courseDate.capacity}} 
                <span *ngIf="courseDate.minimumRequired">(min: {{courseDate.minimumRequired}})</span>
              </td>
              <td>
                <span class="status-badge" [ngClass]="courseDate.status">
                  {{courseDate.status | titlecase}}
                </span>
              </td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-primary" [routerLink]="['/admin/course-dates', courseDate._id]">
                    View
                  </button>
                  
                  <!-- Status-based actions -->
                  <ng-container *ngIf="courseDate.status === 'scheduled'">
                    <button class="btn btn-sm btn-success" (click)="confirmCourseDate(courseDate._id)">
                      Confirm
                    </button>
                    <button class="btn btn-sm btn-warning" (click)="openPostponeModal(courseDate)">
                      Postpone
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="openCancelModal(courseDate)">
                      Cancel
                    </button>
                  </ng-container>
                  
                  <ng-container *ngIf="courseDate.status === 'confirmed'">
                    <button class="btn btn-sm btn-info" (click)="completeCourseDate(courseDate._id)">
                      Complete
                    </button>
                    <button class="btn btn-sm btn-warning" (click)="openPostponeModal(courseDate)">
                      Postpone
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="openCancelModal(courseDate)">
                      Cancel
                    </button>
                  </ng-container>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Postpone Modal (simplified) -->
      <div *ngIf="postponeModalVisible" class="modal-backdrop show"></div>
      <div *ngIf="postponeModalVisible" class="modal show d-block">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Postpone Course</h5>
              <button type="button" class="btn-close" (click)="postponeModalVisible = false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="newDate">New Date</label>
                <input type="datetime-local" id="newDate" class="form-control" [(ngModel)]="postponeDto.newDate">
              </div>
              <div class="mb-3">
                <label for="reason">Reason</label>
                <textarea id="reason" class="form-control" [(ngModel)]="postponeDto.reason"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="postponeModalVisible = false">Cancel</button>
              <button type="button" class="btn btn-warning" (click)="postponeCourseDate()">Postpone</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Cancel Modal (simplified) -->
      <div *ngIf="cancelModalVisible" class="modal-backdrop show"></div>
      <div *ngIf="cancelModalVisible" class="modal show d-block">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Cancel Course</h5>
              <button type="button" class="btn-close" (click)="cancelModalVisible = false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="cancelReason">Reason</label>
                <textarea id="cancelReason" class="form-control" [(ngModel)]="cancelDto.reason"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="cancelModalVisible = false">Close</button>
              <button type="button" class="btn btn-danger" (click)="cancelCourseDate()">Cancel Course</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-course-dates {
      padding: 20px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 50px 0;
    }
    
    .filters {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .course-dates-list {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: bold;
    }
    
    .status-badge.scheduled {
      background-color: #e9ecef;
      color: #495057;
    }
    
    .status-badge.confirmed {
      background-color: #d1e7dd;
      color: #0f5132;
    }
    
    .status-badge.postponed {
      background-color: #fff3cd;
      color: #664d03;
    }
    
    .status-badge.canceled {
      background-color: #f8d7da;
      color: #842029;
    }
    
    .status-badge.completed {
      background-color: #cff4fc;
      color: #055160;
    }
    
    tr.at-risk {
      background-color: rgba(255, 193, 7, 0.1);
    }
    
    tr.confirmed {
      background-color: rgba(25, 135, 84, 0.1);
    }
    
    .modal-backdrop {
      opacity: 0.5;
    }
  `]
})
export class AdminCourseDatesComponent implements OnInit {
  loading = true;
  courseDates: any[] = [];
  
  filterDto: any = {
    status: undefined,
    startDateFrom: undefined,
    startDateTo: undefined
  };
  
  startDateFrom: string | null = null;
  startDateTo: string | null = null;
  
  // Postpone modal
  postponeModalVisible = false;
  selectedCourseDate: any = null;
  postponeDto = { newDate: '', reason: '' };
  
  // Cancel modal
  cancelModalVisible = false;
  cancelDto = { reason: '' };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCourseDates();
  }

  loadCourseDates(): void {
    this.loading = true;
    this.adminService.getCourseDates(this.filterDto).subscribe({
      next: (data) => {
        this.courseDates = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading course dates', error);
        this.loading = false;
      }
    });
  }
  
  updateDateFilter(): void {
    if (this.startDateFrom) {
      this.filterDto.startDateFrom = new Date(this.startDateFrom);
    } else {
      this.filterDto.startDateFrom = undefined;
    }
    
    if (this.startDateTo) {
      this.filterDto.startDateTo = new Date(this.startDateTo);
    } else {
      this.filterDto.startDateTo = undefined;
    }
    
    this.loadCourseDates();
  }
  
  isAtRisk(courseDate: any): boolean {
    if (courseDate.status !== 'scheduled') return false;
    
    const startDate = new Date(courseDate.startDate);
    const now = new Date();
    const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Consider at risk if within 3 days of start date and below minimum enrollment
    return daysUntil <= 3 && courseDate.enrolledCount < courseDate.minimumRequired;
  }
  
  confirmCourseDate(id: string): void {
    this.adminService.confirmCourseDate(id).subscribe({
      next: () => {
        this.loadCourseDates();
      },
      error: (error) => {
        console.error('Error confirming course date', error);
      }
    });
  }
  
  completeCourseDate(id: string): void {
    this.adminService.completeCourseDate(id).subscribe({
      next: () => {
        this.loadCourseDates();
      },
      error: (error) => {
        console.error('Error completing course date', error);
      }
    });
  }
  
  openPostponeModal(courseDate: any): void {
    this.selectedCourseDate = courseDate;
    this.postponeDto = { 
      newDate: '',
      reason: 'Insufficient enrollment'
    };
    this.postponeModalVisible = true;
  }
  
  postponeCourseDate(): void {
    if (!this.selectedCourseDate) return;
    
    this.adminService.postponeCourseDate(
      this.selectedCourseDate._id, 
      new Date(this.postponeDto.newDate), 
      this.postponeDto.reason
    ).subscribe({
      next: () => {
        this.postponeModalVisible = false;
        this.loadCourseDates();
      },
      error: (error) => {
        console.error('Error postponing course date', error);
      }
    });
  }
  
  openCancelModal(courseDate: any): void {
    this.selectedCourseDate = courseDate;
    this.cancelDto = { reason: '' };
    this.cancelModalVisible = true;
  }
  
  cancelCourseDate(): void {
    if (!this.selectedCourseDate) return;
    
    this.adminService.cancelCourseDate(
      this.selectedCourseDate._id, 
      this.cancelDto.reason
    ).subscribe({
      next: () => {
        this.cancelModalVisible = false;
        this.loadCourseDates();
      },
      error: (error) => {
        console.error('Error canceling course date', error);
      }
    });
  }
  
  checkPostponementStatus(): void {
    this.adminService.checkPostponementStatus().subscribe({
      next: (result) => {
        alert(`Postponement check complete:
          Total processed: ${result.processed}
          Postponed: ${result.postponed}
          Confirmed: ${result.confirmed}`);
        this.loadCourseDates();
      },
      error: (error) => {
        console.error('Error checking postponement status', error);
      }
    });
  }
}