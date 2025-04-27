// src/app/admin/components/admin-enrollments/admin-enrollments.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-enrollments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-enrollments">
      <div class="page-header">
        <h1>Enrollments Management</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="exportEnrollments()">
            <i class="bi bi-download"></i> Export Data
          </button>
        </div>
      </div>

      <div class="filters">
        <div class="row">
          <div class="col-md-3 mb-3">
            <label for="statusFilter">Status</label>
            <select id="statusFilter" class="form-select" [(ngModel)]="filterStatus" (change)="loadEnrollments()">
              <option [ngValue]="undefined">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
              <option value="postponed">Postponed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          
          <div class="col-md-5 mb-3">
            <label for="searchTerm">Search</label>
            <input type="text" id="searchTerm" class="form-control" 
                   [(ngModel)]="searchTerm" 
                   (input)="onSearchChange()"
                   placeholder="Search by name, email, or course...">
          </div>
          
          <div class="col-md-4 mb-3">
            <label for="dateFilter">Enrollment Date</label>
            <input type="date" id="dateFilter" class="form-control" 
                   [(ngModel)]="dateFilter" (change)="loadEnrollments()">
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!loading" class="enrollments-table">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Course</th>
              <th>Course Date</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Enrolled Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let enrollment of filteredEnrollments">
              <td>{{enrollment._id | slice:0:8}}</td>
              <td>
                <div class="student-info">
                  <strong>{{enrollment.user?.fullName}}</strong>
                  <small class="d-block text-muted">{{enrollment.user?.email}}</small>
                </div>
              </td>
              <td>{{enrollment.courseDate?.course?.title}}</td>
              <td>{{enrollment.courseDate?.startDate | date:'mediumDate'}}</td>
              <td>
                <span class="status-badge" [ngClass]="enrollment.status">
                  {{enrollment.status | uppercase}}
                </span>
              </td>
              <td>
                <span *ngIf="enrollment.payment">
                  {{enrollment.payment.amount | currency}}
                  <span class="badge" [ngClass]="{
                    'bg-success': enrollment.payment.status === 'completed',
                    'bg-warning': enrollment.payment.status === 'pending'
                  }">
                    {{enrollment.payment.status}}
                  </span>
                </span>
                <span *ngIf="!enrollment.payment" class="text-muted">N/A</span>
              </td>
              <td>{{enrollment.createdAt | date:'medium'}}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-primary" 
                          [routerLink]="['/admin/enrollments', enrollment._id]">
                    View
                  </button>
                  
                  <div class="dropdown">
                    <button class="btn btn-sm btn-secondary dropdown-toggle" 
                            type="button" 
                            (click)="toggleDropdown(enrollment._id)">
                      Actions
                    </button>
                    <ul class="dropdown-menu" [class.show]="openDropdowns[enrollment._id]">
                      <li *ngIf="enrollment.status === 'pending'">
                        <a class="dropdown-item" href="javascript:void(0)" 
                           (click)="confirmEnrollment(enrollment._id)">
                          <i class="bi bi-check-circle"></i> Confirm
                        </a>
                      </li>
                      <li *ngIf="enrollment.status !== 'canceled'">
                        <a class="dropdown-item" href="javascript:void(0)" 
                           (click)="openCancelModal(enrollment)">
                          <i class="bi bi-x-circle"></i> Cancel
                        </a>
                      </li>
                      <li *ngIf="enrollment.status === 'confirmed'">
                        <a class="dropdown-item" href="javascript:void(0)" 
                           (click)="markAsCompleted(enrollment._id)">
                          <i class="bi bi-check-all"></i> Mark Completed
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="javascript:void(0)" 
                           (click)="sendEmailReminder(enrollment)">
                          <i class="bi bi-envelope"></i> Send Reminder
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div *ngIf="filteredEnrollments.length === 0" class="alert alert-info">
          No enrollments found matching your criteria.
        </div>
      </div>

      <!-- Cancel Modal -->
      <div *ngIf="showCancelModal" class="modal show d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Cancel Enrollment</h5>
              <button type="button" class="btn-close" (click)="showCancelModal = false"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to cancel this enrollment?</p>
              <div class="mb-3">
                <label for="cancelReason" class="form-label">Reason</label>
                <textarea id="cancelReason" class="form-control" rows="3" 
                          [(ngModel)]="cancelReason"></textarea>
              </div>
              <div class="form-check" *ngIf="selectedEnrollment?.payment">
                <input type="checkbox" class="form-check-input" id="refundCheck" 
                       [(ngModel)]="issueRefund">
                <label class="form-check-label" for="refundCheck">
                  Issue refund for {{selectedEnrollment.payment.amount | currency}}
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="showCancelModal = false">Close</button>
              <button type="button" class="btn btn-danger" (click)="cancelEnrollment()">Cancel Enrollment</button>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="showCancelModal" class="modal-backdrop show"></div>
    </div>
  `,
  styles: [`
    .admin-enrollments {
      padding: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .filters {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 50px;
    }

    .enrollments-table {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .student-info {
      min-width: 150px;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: bold;
    }

    .status-badge.pending {
      background-color: #ffc107;
      color: #212529;
    }

    .status-badge.confirmed {
      background-color: #d1e7dd;
      color: #0f5132;
    }

    .status-badge.completed {
      background-color: #cff4fc;
      color: #055160;
    }

    .status-badge.canceled {
      background-color: #f8d7da;
      color: #842029;
    }

    .status-badge.postponed {
      background-color: #fff3cd;
      color: #664d03;
    }

    .status-badge.refunded {
      background-color: #e2e3e5;
      color: #41464b;
    }

    .dropdown {
      display: inline-block;
      position: relative;
    }

    .dropdown-menu {
      position: absolute;
      right: 0;
      z-index: 1000;
      display: none;
      min-width: 10rem;
      padding: 0.5rem 0;
      margin: 0;
      background-color: #fff;
      border: 1px solid rgba(0,0,0,.15);
      border-radius: 0.25rem;
      box-shadow: 0 0.5rem 1rem rgba(0,0,0,.175);
    }

    .dropdown-menu.show {
      display: block;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      color: #212529;
      text-decoration: none;
    }

    .dropdown-item:hover {
      background-color: #f8f9fa;
    }

    .dropdown-item i {
      margin-right: 0.5rem;
    }

    .modal {
      background-color: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class AdminEnrollmentsComponent implements OnInit {
  enrollments: any[] = [];
  filteredEnrollments: any[] = [];
  loading = true;
  filterStatus: string | undefined;
  searchTerm = '';
  dateFilter: string | undefined;
  openDropdowns: { [key: string]: boolean } = {};
  
  showCancelModal = false;
  selectedEnrollment: any;
  cancelReason = '';
  issueRefund = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.loading = true;
    this.adminService.getEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
        this.filterEnrollments();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading enrollments', error);
        this.loading = false;
      }
    });
  }

  filterEnrollments(): void {
    let filtered = [...this.enrollments];

    // Apply status filter
    if (this.filterStatus) {
      filtered = filtered.filter(e => e.status === this.filterStatus);
    }

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.user?.fullName?.toLowerCase().includes(term) ||
        e.user?.email?.toLowerCase().includes(term) ||
        e.courseDate?.course?.title?.toLowerCase().includes(term)
      );
    }

    // Apply date filter
    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter);
      filtered = filtered.filter(e => {
        const enrollDate = new Date(e.createdAt);
        return enrollDate.toDateString() === filterDate.toDateString();
      });
    }

    this.filteredEnrollments = filtered;
  }

  onSearchChange(): void {
    this.filterEnrollments();
  }

  toggleDropdown(enrollmentId: string): void {
    // Close all other dropdowns
    Object.keys(this.openDropdowns).forEach(key => {
      if (key !== enrollmentId) {
        this.openDropdowns[key] = false;
      }
    });
    
    // Toggle the current dropdown
    this.openDropdowns[enrollmentId] = !this.openDropdowns[enrollmentId];
  }

  confirmEnrollment(id: string): void {
    // Implement confirmation logic
    console.log('Confirming enrollment', id);
    this.openDropdowns[id] = false;
  }

  openCancelModal(enrollment: any): void {
    this.selectedEnrollment = enrollment;
    this.showCancelModal = true;
    this.cancelReason = '';
    this.issueRefund = false;
    this.openDropdowns[enrollment._id] = false;
  }

  cancelEnrollment(): void {
    if (!this.selectedEnrollment) return;
    
    // Implement cancellation logic
    console.log('Canceling enrollment', this.selectedEnrollment._id, {
      reason: this.cancelReason,
      issueRefund: this.issueRefund
    });
    
    this.showCancelModal = false;
  }

  markAsCompleted(id: string): void {
    // Implement completion logic
    console.log('Marking enrollment as completed', id);
    this.openDropdowns[id] = false;
  }

  sendEmailReminder(enrollment: any): void {
    // Implement reminder logic
    console.log('Sending reminder for enrollment', enrollment._id);
    this.openDropdowns[enrollment._id] = false;
  }

  exportEnrollments(): void {
    // Implement export logic
    console.log('Exporting enrollments data');
  }
}