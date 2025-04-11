// src/app/component/shared/user-nav/user-nav.component.ts
import { Component, OnInit, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-user-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="user-nav-container">
      <!-- User avatar/icon that toggles the menu -->
      <div class="user-nav-trigger" (click)="toggleMenu($event)">
        <div *ngIf="currentUser" class="user-avatar">
          <div class="initials">{{ getUserInitials() }}</div>
        </div>
        <div *ngIf="!currentUser" class="user-icon">
          <i class="bi bi-person-circle"></i>
        </div>
        <i class="bi bi-chevron-down" [class.open]="isMenuOpen"></i>
      </div>
      
      <!-- Dropdown Menu -->
      <div class="user-dropdown" 
           *ngIf="isMenuOpen" 
           @slideDown 
           (click)="$event.stopPropagation()">
        
        <!-- Logged In User -->
        <div *ngIf="currentUser" class="dropdown-content logged-in">
          <div class="user-info">
            <div class="user-avatar large">
              <div class="initials">{{ getUserInitials() }}</div>
            </div>
            <div class="user-name-email">
              <span class="user-name">{{ currentUser.fullName }}</span>
              <span class="user-email">{{ currentUser.email }}</span>
            </div>
          </div>
          
          <div class="dropdown-divider"></div>
          
          <ul class="dropdown-menu-items">
            <li>
              <a routerLink="/dashboard" (click)="closeMenu()">
                <i class="bi bi-speedometer2"></i>
                <span>Mi Dashboard</span>
              </a>
            </li>
            <li>
              <a routerLink="/dashboard/courses" (click)="closeMenu()">
                <i class="bi bi-mortarboard"></i>
                <span>Mis Cursos</span>
                <span class="badge" *ngIf="upcomingCourseCount > 0">{{ upcomingCourseCount }}</span>
              </a>
            </li>
            <li>
              <a routerLink="/dashboard/profile" (click)="closeMenu()">
                <i class="bi bi-person"></i>
                <span>Mi Perfil</span>
              </a>
            </li>
            <li>
              <a routerLink="/dashboard/certificates" (click)="closeMenu()">
                <i class="bi bi-award"></i>
                <span>Certificados</span>
              </a>
            </li>
          </ul>
          
          <div class="dropdown-divider"></div>
          
          <ul class="dropdown-menu-items">
            <li>
              <a routerLink="/courses" (click)="closeMenu()">
                <i class="bi bi-grid"></i>
                <span>Catálogo de Cursos</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" (click)="logout()">
                <i class="bi bi-box-arrow-right"></i>
                <span>Cerrar Sesión</span>
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Not Logged In -->
        <div *ngIf="!currentUser" class="dropdown-content logged-out">
          <div class="guest-header">
            <i class="bi bi-person-circle"></i>
            <span>Bienvenido, Invitado</span>
          </div>
          
          <div class="auth-buttons">
            <a routerLink="/login" class="btn btn-primary" (click)="closeMenu()">
              Iniciar Sesión
            </a>
            <a routerLink="/register" class="btn btn-outline-primary" (click)="closeMenu()">
              Registrarse
            </a>
          </div>
          
          <div class="dropdown-divider"></div>
          
          <ul class="dropdown-menu-items">
            <li>
              <a routerLink="/courses" (click)="closeMenu()">
                <i class="bi bi-grid"></i>
                <span>Explorar Cursos</span>
              </a>
            </li>
            <li>
              <a routerLink="/about" (click)="closeMenu()">
                <i class="bi bi-info-circle"></i>
                <span>Acerca de Nosotros</span>
              </a>
            </li>
            <li>
              <a routerLink="/contact" (click)="closeMenu()">
                <i class="bi bi-envelope"></i>
                <span>Contacto</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-nav-container {
      position: relative;
      font-family: 'Montserrat', sans-serif;
    }
    
    .user-nav-trigger {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50px;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      .user-avatar, .user-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.5rem;
      }
      
      .user-avatar {
        background-color: #0066b3;
        color: white;
        font-weight: 700;
        
        .initials {
          font-size: 1rem;
          text-transform: uppercase;
        }
      }
      
      .user-icon {
        color: #0066b3;
        font-size: 1.5rem;
      }
      
      .bi-chevron-down {
        font-size: 0.8rem;
        transition: transform 0.2s ease;
        
        &.open {
          transform: rotate(180deg);
        }
      }
    }
    
    .user-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      min-width: 300px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      
      &:before {
        content: '';
        position: absolute;
        top: -8px;
        right: 20px;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid white;
      }
    }
    
    .dropdown-content {
      padding: 1rem;
      
      &.logged-in {
        .user-info {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          
          .user-avatar.large {
            width: 50px;
            height: 50px;
            margin-right: 1rem;
            
            .initials {
              font-size: 1.2rem;
            }
          }
          
          .user-name-email {
            display: flex;
            flex-direction: column;
            
            .user-name {
              font-weight: 700;
              color: #333;
              font-size: 1.1rem;
              margin-bottom: 0.2rem;
            }
            
            .user-email {
              color: #666;
              font-size: 0.9rem;
            }
          }
        }
      }
      
      &.logged-out {
        .guest-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          
          i {
            font-size: 2rem;
            color: #0066b3;
            margin-right: 1rem;
          }
          
          span {
            font-weight: 500;
            color: #333;
          }
        }
        
        .auth-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          
          .btn {
            flex: 1;
            padding: 0.5rem;
            font-size: 0.9rem;
          }
        }
      }
    }
    
    .dropdown-divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 0.5rem 0;
    }
    
    .dropdown-menu-items {
      list-style-type: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 0.2rem;
        
        a {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: #333;
          text-decoration: none;
          border-radius: 6px;
          transition: background-color 0.2s ease;
          
          &:hover {
            background-color: rgba(0, 102, 179, 0.1);
            color: #0066b3;
          }
          
          i {
            margin-right: 0.5rem;
            font-size: 1.1rem;
            color: #0066b3;
          }
          
          .badge {
            margin-left: auto;
            background-color: #0066b3;
            color: white;
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
            border-radius: 50px;
          }
        }
      }
    }
    
    // Style for mobile
    @media (max-width: 767px) {
      .user-dropdown {
        position: fixed;
        top: 60px; // Adjust based on your header height
        right: 0;
        width: 250px;
        max-width: 80vw;
        height: calc(100vh - 60px); // Full height minus header
        overflow-y: auto;
        border-radius: 0;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        
        &:before {
          display: none;
        }
      }
    }
  `],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ])
  ]
})
export class UserNavComponent implements OnInit {
  currentUser: User | null = null;
  isMenuOpen = false;
  upcomingCourseCount = 0;
  
  private userService = inject(UserService);
  private elementRef = inject(ElementRef);
  
  ngOnInit(): void {
    // Subscribe to user changes
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      
      // In a real app, you'd also fetch the user's upcoming course count
      if (user) {
        this.upcomingCourseCount = 2; // Mock count
      }
    });
    
    // Listen for clicks outside to close the menu
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }
  
  // Clean up the document click listener when component is destroyed
  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }
  
  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
  }
  
  logout(): void {
    this.userService.logout();
    this.closeMenu();
  }
  
  getUserInitials(): string {
    if (!this.currentUser || !this.currentUser.fullName) {
      return '?';
    }
    
    const nameParts = this.currentUser.fullName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    
    return nameParts[0][0].toUpperCase();
  }
  
  private onDocumentClick(event: MouseEvent): void {
    // Close the menu if the click is outside the component
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
}