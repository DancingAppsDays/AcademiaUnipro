// src/app/component/shared/user-nav/user-nav.component.ts
import { Component, OnInit, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-user-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="user-nav-container">
      <!-- Hamburger menu for mobile - always visible on mobile -->
      <div class="hamburger-menu d-block d-md-none" (click)="toggleMobileMenu($event)">
        <i class="bi bi-list"></i>
      </div>
      
      <!-- User avatar/icon that toggles the menu -->
      <div class="user-nav-trigger" (click)="toggleMenu($event)">
        <!-- Show avatar with initials for logged in users -->
        <div *ngIf="currentUser" class="user-avatar">
          <div class="initials">{{ getUserInitials() }}</div>
        </div>
        
        <!-- Show a profile image for non-logged in users -->
        <div *ngIf="!currentUser" class="user-icon">
          <img src="assets/images/profile-placeholder.png" alt="Guest Profile" class="profile-img">
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
                    <li *ngIf="currentUser?.roles?.includes('admin')">
            <a routerLink="/admin/dashboard">
              <i class="bi bi-gear"></i>
              <span>Admin Dashboard</span>
            </a>
          </li>
            <li>
              <a routerLink="/dashboard" (click)="closeMenu()">
                <i class="bi bi-speedometer2"></i>
                <span>Mi Dashboard</span>
              </a>
            </li>
            <li>
              <!-- //TODO Review logic-->
            <a routerLink="/dashboard/courses" (click)="closeMenu()">
                <i class="bi bi-mortarboard"></i>
                <span>Mis Cursos</span>
                <span class="badge" *ngIf="upcomingCourseCount > 0">{{ upcomingCourseCount }}</span>
              </a>
            </li>
           <!-- 
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
            </li>-->
          </ul>
          
          <div class="dropdown-divider"></div>
          
          <ul class="dropdown-menu-items">
           <!-- <li>
              <a routerLink="/courses" (click)="closeMenu()">
                <i class="bi bi-grid"></i>
                <span>Catálogo de Cursos</span>
              </a>
            </li>-->
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
            <img src="assets/images/profile-placeholder.png" alt="Guest Profile" class="guest-img">
            <span>Bienvenido, Invitado</span>
          </div>
          
          <div class="auth-buttons">
            <a routerLink="/login" class="btn btn-primary" (click)="closeMenu()">
              Iniciar Sesión
            </a>
            <a href="javascript:void(0)" class="btn btn-outline-primary" (click)="navigateToRegister()">
              Registrarse
            </a>
          </div>
          
          <div class="dropdown-divider"></div>
          
          <ul class="dropdown-menu-items">
            <li>
              <a routerLink="/" (click)="closeMenu()">
                <i class="bi bi-grid"></i>
                <span>Explorar Cursos</span>
              </a>
            </li>
           
            <li>
                     <a href="#" (click)="scrollToFooter($event)">
                    <i class="bi bi-envelope"></i>
                    <span>Contacto</span>
                  </a>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="isMobileMenuOpen" @slideIn>
        <div class="mobile-menu-header">
          <h3>Menú</h3>
          <button class="close-btn" (click)="closeMobileMenu()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div class="dropdown-divider"></div>
        
        <!-- User profile section at top of mobile menu when logged in -->
        <div *ngIf="currentUser" class="mobile-user-profile">
          <div class="user-info mb-3">
            <div class="user-avatar large">
              <div class="initials">{{ getUserInitials() }}</div>
            </div>
            <div class="user-name-email">
              <span class="user-name">{{ currentUser.fullName }}</span>
              <span class="user-email">{{ currentUser.email }}</span>
            </div>
          </div>
        </div>
        
        <!-- User-specific links when logged in -->
        <ul *ngIf="currentUser" class="mobile-menu-items user-specific">
                <li *ngIf="currentUser?.roles?.includes('admin')">
          <a routerLink="/admin/dashboard">
            <i class="bi bi-gear"></i>
            <span>Admin Dashboard</span>
          </a>
        </li>
          <li>
            <a routerLink="/dashboard" (click)="closeMobileMenu()">
              <i class="bi bi-speedometer2"></i>
              <span>Mi Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/dashboard/courses" (click)="closeMobileMenu()">
              <i class="bi bi-mortarboard"></i>
              <span>Mis Cursos</span>
              <span class="badge" *ngIf="upcomingCourseCount > 0">{{ upcomingCourseCount }}</span>
            </a>
          </li>
          <li>
            <a routerLink="/dashboard/profile" (click)="closeMobileMenu()">
              <i class="bi bi-person"></i>
              <span>Mi Perfil</span>
            </a>
          </li>
          <li>
            <a routerLink="/dashboard/certificates" (click)="closeMobileMenu()">
              <i class="bi bi-award"></i>
              <span>Certificados</span>
            </a>
          </li>
        </ul>
        
        <div *ngIf="currentUser" class="dropdown-divider"></div>
        
        <!-- Common links for all users -->
        <ul class="mobile-menu-items">
          <li>
            <a routerLink="/" (click)="closeMobileMenu()">
              <i class="bi bi-grid"></i>
              <span>{{ currentUser ? 'Catálogo de Cursos' : 'Explorar Cursos' }}</span>
            </a>
          </li>
          <!--<li>
            <a routerLink="/about" (click)="closeMobileMenu()">
              <i class="bi bi-info-circle"></i>
              <span>Acerca de Nosotros</span>
            </a>
          </li>-->
          <li>
          <a href="#" (click)="scrollToFooterMobile($event)">
              <i class="bi bi-envelope"></i>
              <span>Contacto</span>
            </a>
          </li>
        </ul>
        
        <div class="dropdown-divider"></div>
        
        <!-- Auth buttons for non-logged in users -->
        <div class="mobile-auth-buttons" *ngIf="!currentUser">
          <a routerLink="/login" class="btn btn-primary btn-block" (click)="closeMobileMenu()">
            <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
          </a>
          <a href="javascript:void(0)" class="btn btn-outline-primary btn-block mt-2" (click)="navigateToRegister(); closeMobileMenu()">
            <i class="bi bi-person-plus"></i> Registrarse
          </a>
        </div>
        
        <!-- Logout button for logged in users -->
        <div class="mobile-auth-buttons" *ngIf="currentUser">
          <a href="javascript:void(0)" class="btn btn-outline-danger btn-block" (click)="logoutMobile()">
            <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
          </a>
        </div>
      </div>
      
      <!-- Backdrop for mobile menu -->
      <div class="mobile-backdrop" *ngIf="isMobileMenuOpen" (click)="closeMobileMenu()"></div>
    </div>
  `,
  styles: [`
    .user-nav-container {
      position: relative;
      font-family: 'Montserrat', sans-serif;
      display: flex;
      align-items: center;
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
        overflow: hidden;
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
        border: 1px solid #ddd;
        
        .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .bi-chevron-down {
        font-size: 0.8rem;
        transition: transform 0.2s ease;
        
        &.open {
          transform: rotate(180deg);
        }
      }
    }
    
    /* Hamburger menu styles */
    .hamburger-menu {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin-right: 10px;
      cursor: pointer;
      
      i {
        font-size: 1.8rem;
        color: #0066b3;
      }
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 50%;
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
          
          .guest-img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            margin-right: 1rem;
            border: 1px solid #ddd;
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
    
    .dropdown-menu-items, .mobile-menu-items {
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
    
    /* Mobile menu styles */
    .mobile-menu {
      position: fixed;
      top: 0;
      left: -280px;
      width: 280px;
      height: 100vh;
      background-color: white;
      z-index: 1001;
      padding: 1rem;
      box-shadow: 2px 0 15px rgba(0, 0, 0, 0.15);
      overflow-y: auto;
      transition: left 0.3s ease;
      
      &.open {
        left: 0;
      }
      
      .mobile-menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        
        h3 {
          margin: 0;
          color: #0066b3;
          font-weight: 700;
          font-size: 1.5rem;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: #0066b3;
          font-size: 1.5rem;
          cursor: pointer;
          
          &:hover {
            color: #004c86;
          }
        }
      }
      
      .mobile-user-profile {
        padding: 0.5rem;
        
        .user-info {
          display: flex;
          align-items: center;
          
          .user-avatar.large {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #0066b3;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
            
            .initials {
              font-size: 1.2rem;
              text-transform: uppercase;
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
      
      .mobile-auth-buttons {
        padding: 1rem 0;
        
        .btn-block {
          display: block;
          width: 100%;
          text-align: center;
        }
      }
    }
    
    .mobile-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
    
    // Style for mobile
    @media (max-width: 767px) {
      .user-dropdown {
        position: fixed;
        top: 60px; // Adjust based on your header height
        right: 0;
        width: 250px;
        max-width: 80vw;
        height: auto;
        max-height: calc(100vh - 60px);
        overflow-y: auto;
        border-radius: 8px 0 0 8px;
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
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class UserNavComponent implements OnInit {
  currentUser: User | null = null;
  isMenuOpen = false;
  isMobileMenuOpen = false;
  upcomingCourseCount = 0;
  
  private userService = inject(UserService);
  private elementRef = inject(ElementRef);
  private router = inject(Router);

  ngOnInit(): void {
    // Subscribe to user changes
    this.userService.getCurrentUser().subscribe(user => {
      //console.log('UserNavComponent received user:', user);

      this.currentUser = user;
      
      //TODO In a real app, you'd also fetch the user's upcoming course count
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
    // Close mobile menu if it's open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }
  
  toggleMobileMenu(event: Event): void {
    event.stopPropagation();
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close user dropdown if it's open
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
  }
  
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
  
  logout(): void {
    this.userService.logout();
    this.closeMenu();
  }
  
  logoutMobile(): void {
    this.userService.logout();
    this.closeMobileMenu();
  }

  navigateToRegister(): void {
    this.closeMenu();
    this.router.navigate(['/register']);
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
      this.closeMobileMenu();
    }
  }

  scrollToFooter(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  
  // Close the dropdown menu
  this.closeMenu();
  
  // Get the footer element
  const footer = document.querySelector('.main-footer');
  
  if (footer) {
    // Scroll to the footer with smooth behavior
    footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Method to scroll to footer from mobile menu
scrollToFooterMobile(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  
  // Close the mobile menu
  this.closeMobileMenu();
  
  // Get the footer element
  const footer = document.querySelector('.main-footer');
  
  if (footer) {
    // Scroll to the footer with smooth behavior
    footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
}