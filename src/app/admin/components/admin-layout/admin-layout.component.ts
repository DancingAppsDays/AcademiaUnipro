// src/app/admin/components/admin-layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent],
  template: `
    <div class="admin-layout">
      <app-admin-navbar></app-admin-navbar>
      
      <div class="content-container">
        <div class="sidebar">
          <div class="sidebar-header">
            <h3>Admin Menu</h3>
          </div>
          
          <nav class="sidebar-nav">
            <ul>
              <li>
                <a routerLink="/admin/dashboard" routerLinkActive="active">
                  <i class="bi bi-speedometer2"></i>
                  <span>Dashboard</span>
                </a>
              </li>
              
              <li class="nav-group">
                <div class="nav-group-header">
                  <i class="bi bi-calendar"></i>
                  <span>Course Management</span>
                </div>
                <ul class="nav-group-items">
                  <li>
                    <a routerLink="/admin/course-dates" routerLinkActive="active">
                      <i class="bi bi-calendar-event"></i>
                      <span>Course Dates</span>
                    </a>
                  </li>
                  <li>
                    <a routerLink="/admin/enrollments" routerLinkActive="active">
                      <i class="bi bi-people"></i>
                      <span>Enrollments</span>
                    </a>
                  </li>
                  <li>
                    <a routerLink="/admin/company-purchase-dashboard" routerLinkActive="active">
                      <i class="bi bi-people"></i>
                      <span>Business Purchases</span>
                      </a>
                  </li>
                </ul>
              </li>
              <!--
              <li>
                <a routerLink="/" target="_blank">
                  <i class="bi bi-box-arrow-up-right"></i>
                  <span>View Site</span>
                </a>
              </li>-->
            </ul>
          </nav>
        </div>
        
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    
    .content-container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    
    .sidebar {
      width: 250px;
      background-color: #333;
      color: white;
      display: flex;
      flex-direction: column;
    }
    
    .sidebar-header {
      padding: 15px;
      border-bottom: 1px solid #444;
    }
    
    .sidebar-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
    
    .sidebar-nav {
      padding: 15px 0;
      overflow-y: auto;
    }
    
    .sidebar-nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .sidebar-nav > ul > li {
      margin-bottom: 5px;
    }
    
    .sidebar-nav a {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .sidebar-nav a:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    .sidebar-nav a.active {
      background-color: #0066b3;
      color: white;
    }
    
    .sidebar-nav i {
      margin-right: 10px;
      width: 20px;
      text-align: center;
    }
    
    .nav-group-header {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      font-weight: 500;
      font-size: 14px;
      color: #999;
      text-transform: uppercase;
    }
    
    .nav-group-header i {
      margin-right: 10px;
      width: 20px;
      text-align: center;
    }
    
    .nav-group-items {
      padding-left: 20px;
    }
    
    .content {
      flex: 1;
      padding: 0;
      overflow-y: auto;
      background-color: #f5f5f5;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        width: 60px;
      }
      
      .sidebar-nav span,
      .nav-group-header span {
        display: none;
      }
      
      .nav-group-items {
        padding-left: 0;
      }
    }
  `]
})
export class AdminLayoutComponent {}