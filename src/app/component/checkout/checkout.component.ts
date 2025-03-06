// checkout.component.ts - Revised for courseId and date parameters
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../core/services/course.service';
import { UserService } from '../../core/services/user.service';
import { Course } from '../../core/models/course.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('accordionAnimation', [
      transition(':enter', [
        style({ 
          opacity: 0,
          height: 0,
          transform: 'translateY(-20px)',
          overflow: 'hidden'
        }),
        animate('400ms ease-out', style({ 
          opacity: 1,
          height: '*',
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        style({ 
          opacity: 1,
          height: '*',
          overflow: 'hidden'
        }),
        animate('300ms ease-in', style({ 
          opacity: 0,
          height: 0,
          transform: 'translateY(-20px)'
        }))
      ]),
   ] )
  ]
})
export class CheckoutComponent implements OnInit {
  course: Course | null = null;
  selectedDate: Date | null = null;
  userForm: FormGroup;
  companyForm: FormGroup;
  purchaseType: 'individual' | 'company' = 'individual';
  isExistingUser = false;
  loading = true;
  loadError = false;
  processingPayment = false;
  
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private userService = inject(UserService);
  
  constructor() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      jobRole: [''],
      companyName: ['']
    }, { 
      validators: this.passwordMatchValidator
    });
    
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      rfc: ['', [Validators.required, Validators.pattern(/^[A-Z&Ñ]{3,4}\d{6}[A-Z\d]{3}$/)]],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      additionalInfo: ['']
    });
  }

  ngOnInit(): void {
    this.loadCheckoutData();
    this.checkUserLoginStatus();
  }
  
  private loadCheckoutData(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    const dateParam = this.route.snapshot.queryParamMap.get('date');
    
    if (!courseId) {
      this.handleDataError('No se ha especificado un curso');
      return;
    }
    
    // Parse the date if provided
    if (dateParam) {
      try {
        this.selectedDate = new Date(dateParam);
        
        // Check for invalid date
        if (isNaN(this.selectedDate.getTime())) {
          this.selectedDate = null;
        }
      } catch (error) {
        this.selectedDate = null;
        console.error('Error parsing date', error);
      }
    }
    
   // Fetch course data
   this.courseService.getCourseById(courseId).subscribe({
    next: (course) => {
      // Check if the course is undefined or null
      if (!course) {
        this.loadFromMockData(courseId);
        return;
      }
      
      this.course = course;
      this.validateSelectedDate();
      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading course details', error);
      this.loadFromMockData(courseId);
    }
  });
}

// Separate method for loading from mock data
private loadFromMockData(courseId: string): void {
  console.log('Attempting to load from mock data');
  
  this.courseService.getMockCourses().subscribe({
    next: (courses) => {
      const mockCourse = courses.find(c => c.id === courseId);
      if (mockCourse) {
        this.course = mockCourse;
        this.validateSelectedDate();
        this.loading = false;
      } else {
        this.handleDataError('No se pudo encontrar el curso especificado');
      }
    },
    error: (fallbackError) => {
      this.handleDataError('Error al cargar los datos del curso');
    }
  });
}
  
  private validateSelectedDate(): void {
    if (!this.selectedDate || !this.course?.availableDates || this.course.availableDates.length === 0) {
      return;
    }
    
    // Check if selected date is in available dates
    const isDateAvailable = this.course.availableDates.some(date => {
      const availableDate = new Date(date);
      return availableDate.toDateString() === this.selectedDate?.toDateString();
    });
    
    if (!isDateAvailable) {
      console.warn('Selected date is not available, resetting');
      this.selectedDate = null;
    }
  }
  
  private handleDataError(message: string): void {
    this.loading = false;
    this.loadError = true;
    console.error(message);
  }
  
  private checkUserLoginStatus(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.isExistingUser = true;
        this.userForm.patchValue({
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          jobRole: user.jobRole || '',
          companyName: user.companyName || ''
        });
        
        // Disable password fields for logged-in users
        this.userForm.get('password')?.disable();
        this.userForm.get('confirmPassword')?.disable();
      }
    });
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
  switchToLogin() {
    this.router.navigate(['/login'], { 
      queryParams: { 
        redirect: `/checkout/${this.course?.id}`,
        date: this.selectedDate?.toISOString() 
      } 
    });
  }
  
  togglePurchaseType(type: 'individual' | 'company') {
    // Only proceed if changing to a different type
    if (this.purchaseType === type) {
      return;
    }
    
    // Store previous type for animation
    const previousType = this.purchaseType;
    
    // Update the purchase type
    this.purchaseType = type;
    
    // If switching to company, adjust validation
    if (type === 'company') {
      // Ensure company form is properly validated
      this.companyForm.get('companyName')?.updateValueAndValidity();
      this.companyForm.get('rfc')?.updateValueAndValidity();
      this.companyForm.get('contactName')?.updateValueAndValidity();
      this.companyForm.get('contactEmail')?.updateValueAndValidity();
      this.companyForm.get('contactPhone')?.updateValueAndValidity();
      
      // Log for debugging
      console.log('Switched to company purchase type');
    } else {
      // Ensure user form is properly validated
      if (!this.isExistingUser) {
        this.userForm.get('email')?.updateValueAndValidity();
        this.userForm.get('fullName')?.updateValueAndValidity();
        this.userForm.get('phone')?.updateValueAndValidity();
      }
      
      // Log for debugging
      console.log('Switched to individual purchase type');
    }
    
    // For animation purposes, you might want to trigger change detection manually
    // or ensure Angular runs animation by forcing a layout reflow
    setTimeout(() => {
      console.log(`Animation should run from ${previousType} to ${type}`);
    }, 0);
  }
  
  calculateTotal(): number {
    if (!this.course) return 0;
    
    if (this.purchaseType === 'individual') {
      return this.course.price;
    } else {
      const quantity = this.companyForm.get('quantity')?.value || 1;
      return this.course.price * quantity;
    }
  }
  
  processPayment() {
   /* if (this.purchaseType === 'individual' && !this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return;
    }
    
    if (this.purchaseType === 'company' && !this.companyForm.valid) {
      this.companyForm.markAllAsTouched();
      return;
    }*/
    
    if (!this.course || !this.selectedDate) {
      alert('Error: Información del curso o fecha no disponible');
      return;
    }
    
    this.processingPayment = true;
    
    if (this.purchaseType === 'individual') {
      // Process individual registration
      if (!this.isExistingUser) {
        // Register new user
        this.userService.registerUser(this.userForm.value).subscribe({
          next: (user) => {
            this.processPurchase(user.id);
          },
          error: (error) => {
            console.error('Registration failed', error);
            this.processingPayment = false;
            // Handle error (e.g., show error message)
          }
        });
      } else {

        console.log("User is existing");
        // Use existing user
        this.processPurchase();
      }
    } else {
      // Process company purchase (likely needs direct contact)
      //DEBUG
      this.router.navigate(['/checkout/company-success']);


      this.userService.submitCompanyPurchase({
        courseId: this.course?.id,
        courseName: this.course?.title,
        selectedDate: this.selectedDate,
        price: this.course?.price,
        totalAmount: this.calculateTotal(),
        ...this.companyForm.value
      }).subscribe({
        next: () => {
          // Navigate to success page for company purchases
          this.router.navigate(['/checkout/company-success']);
        },
        error: (error) => {
          console.error('Company purchase request failed', error);
          this.processingPayment = false;
          // Handle error
        }
      });
    }
  }
  
  private processPurchase(userId?: string) {
    console.log("process pruchase")
    //if (!this.course || !this.selectedDate) return;
    
    this.router.navigate(['/checkout/success'], { 
      queryParams: { 
        email: this.userForm.get('email')?.value,
        courseId: this.course?.id
      } 
    });
    if(true) return;

    this.userService.purchaseCourse({
      courseId: this.course?.id,
      courseName: this.course?.title,
      coursePrice: this.course?.price,
      selectedDate: this.selectedDate,
      userId: userId
    }).subscribe({
      next: (response) => {
        // Navigate to success page with email confirmation
        this.router.navigate(['/checkout/success'], { 
          queryParams: { 
            email: this.userForm.get('email')?.value,
            courseId: this.course?.id
          } 
        });
      },
      error: (error) => {
        console.error('Purchase failed', error);
        this.processingPayment = false;
        // Handle error
      }
    });
  }
  
  // Method to return to course details
  backToCourse() {
    if (this.course) {
      this.router.navigate(['/course', this.course.id]);
    } else {
      this.router.navigate(['/courses']);
    }
  }
}