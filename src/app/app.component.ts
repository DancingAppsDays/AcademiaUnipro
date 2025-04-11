import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { slideInAnimation } from './route-animations';
import { UserNavComponent } from './component/shared/user-nav/user-nav.component';
import { UserService } from './core/services/user.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule,UserNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  

  title = 'AcademiaUnipro';
  isMobileMenuOpen = false;
  isLoggedIn = false;
  userName = '';
  
  private router = inject(Router);
  private userService = inject(UserService);
  
  ngOnInit() {
    // Navigate to home page by default
    if (this.router.url === '/') {
      this.router.navigate(['/home']);
    }
    
    // Subscribe to user changes to update the UI accordingly
    this.userService.getCurrentUser().subscribe((user: { fullName?: string } | null) => {
      this.isLoggedIn = !!user;
      this.userName = user?.fullName || '';
    });
    
    // Close mobile menu on window resize (if screen becomes larger)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
      }
    });
  }





  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  constructor() {
    this.router.navigate(['/home']);
    /*this.router.navigate(['/checkout/company-success'], {
      queryParams: {
        // email: this.userForm.get('email')?.value,
        // courseId: this.course?.id
      }
    });*/
  }


  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Prevent scrolling when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }
  
  logout() {
    this.userService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/home']);
}
}