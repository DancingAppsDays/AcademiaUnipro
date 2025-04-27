// src/app/admin/components/admin-navbar/admin-navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="admin-navbar">
      <div class="brand">
        <a routerLink="/admin">
          <img src="assets/images/uniprotec-logo.png" alt="Uniprotec Admin" class="logo">
          <span class="brand-text">Admin Panel</span>
        </a>
      </div>
      
      <ul class="nav-links">
        <li>
          <a routerLink="/admin/dashboard" routerLinkActive="active">
            <i class="bi bi-speedometer2"></i> Dashboard
          </a>
        </li>
        <li>
          <a routerLink="/admin/course-dates" routerLinkActive="active">
            <i class="bi bi-calendar-event"></i> Course Dates
          </a>
        </li>
        <li>
          <a routerLink="/admin/enrollments" routerLinkActive="active">
            <i class="bi bi-people"></i> Enrollments
          </a>
        </li>
         <li>
                    <a routerLink="/admin/company-purchase-dashboard" routerLinkActive="active">
                      <i class="bi  bi-suitcase"></i>
                      <span>Business Purchases</span>
                      </a>
                  </li>
       <!-- <li>
          <a routerLink="/" target="_blank">
            <i class="bi bi-box-arrow-up-right"></i> View Site
          </a>
        </li>-->
      </ul>
      
      <div class="user-menu">
        <div class="user-info" (click)="toggleUserDropdown()">
          <div class="user-avatar">
            <span class="initials">{{getInitials()}}</span>
          </div>
          <span class="username">{{user?.fullName || 'Admin'}}</span>
          <i class="bi bi-chevron-down"></i>
        </div>
        
        <div class="dropdown-menu" *ngIf="showUserDropdown">
          <a routerLink="/profile">
            <i class="bi bi-person"></i> Profile
          </a>
          <a href="javascript:void(0)" (click)="logout()">
            <i class="bi bi-box-arrow-right"></i> Logout
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .admin-navbar {
      display: flex;
      align-items: center;
      background-color: #0066b3;
      color: white;
      padding: 0 20px;
      height: 60px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .brand {
      display: flex;
      align-items: center;
      padding-right: 20px;
    }
    
    .brand a {
      display: flex;
      align-items: center;
      color: white;
      text-decoration: none;
    }
    
    .logo {
      height: 30px;
      margin-right: 10px;
    }
    
    .brand-text {
      font-weight: bold;
      font-size: 18px;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      flex: 1;
    }
    
    .nav-links li {
      margin-right: 5px;
    }
    
    .nav-links a {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      padding: 0 15px;
      height: 60px;
      transition: background-color 0.2s;
    }
    
    .nav-links a:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    .nav-links a.active {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 500;
    }
    
    .nav-links i {
      margin-right: 8px;
    }
    
    .user-menu {
      position: relative;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0 10px;
      height: 60px;
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }
    
    .initials {
      font-weight: bold;
      font-size: 14px;
    }
    
    .username {
      margin-right: 5px;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 60px;
      right: 0;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      width: 200px;
      z-index: 1000;
    }
    
    .dropdown-menu a {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      color: #333;
      text-decoration: none;
    }
    
    .dropdown-menu a:hover {
      background-color: #f5f5f5;
    }
    
    .dropdown-menu i {
      margin-right: 10px;
      color: #666;
    }
  `]
})
export class AdminNavbarComponent implements OnInit {
  user: any = null;
  showUserDropdown = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  getInitials(): string {
    if (!this.user || !this.user.fullName) {
      return 'A';
    }
    
    const nameParts = this.user.fullName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}