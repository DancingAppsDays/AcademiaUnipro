// src/app/admin/components/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div *ngIf="loading" class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div *ngIf="!loading" class="dashboard-stats">
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-title">Total Courses</div>
            <div class="stat-value">{{stats.totalCourses}}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-title">Upcoming Course Dates</div>
            <div class="stat-value">{{stats.upcomingCourseDates}}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-title">At-Risk Courses</div>
            <div class="stat-value">{{stats.atRiskCourses}}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-title">Total Enrollments</div>
            <div class="stat-value">{{stats.totalEnrollments}}</div>
          </div>
        </div>
        
        <div class="dashboard-sections">
          <div class="section">
            <h2>Recent Courses</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let course of stats.recentCourses">
                  <td>{{course.title}}</td>
                  <td>{{course.category}}</td>
                  <td>{{course.price | currency}}</td>
                  <td>
                    <button class="btn btn-sm btn-primary" [routerLink]="['/admin/courses', course.id]">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2>Next Courses to Start</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Enrolled</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let courseDate of stats.nextCoursesToStart">
                  <td>{{courseDate.course.title}}</td>
                  <td>{{courseDate.startDate | date:'medium'}}</td>
                  <td>{{courseDate.enrolledCount}}/{{courseDate.capacity}}</td>
                  <td>{{courseDate.status}}</td>
                  <td>
                    <button class="btn btn-sm btn-primary" [routerLink]="['/admin/course-dates', courseDate._id]">Manage</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2>Courses at Risk</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Enrolled</th>
                  <th>Required</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let courseDate of stats.coursesAtRisk">
                  <td>{{courseDate.course.title}}</td>
                  <td>{{courseDate.startDate | date:'medium'}}</td>
                  <td>{{courseDate.enrolledCount}}</td>
                  <td>{{courseDate.minimumRequired}}</td>
                  <td>
                    <button class="btn btn-sm btn-warning" [routerLink]="['/admin/course-dates', courseDate._id]">Manage</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 20px;
    }
    
    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 50px 0;
    }
    
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .stat-title {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #0066b3;
    }
    
    .dashboard-sections {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .section {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    h1 {
      margin-bottom: 20px;
      color: #0066b3;
    }
    
    h2 {
      margin-bottom: 15px;
      font-size: 18px;
      color: #333;
    }
    
    .table {
      width: 100%;
    }
    
    @media (min-width: 768px) {
      .dashboard-sections {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  stats: any = {
    totalCourses: 0,
    upcomingCourseDates: 0,
    atRiskCourses: 0,
    totalEnrollments: 0,
    recentCourses: [],
    nextCoursesToStart: [],
    coursesAtRisk: []
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats', error);
        this.loading = false;
      }
    });
  }
}