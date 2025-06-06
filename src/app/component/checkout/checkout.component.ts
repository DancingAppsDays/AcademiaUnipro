import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../core/services/course.service';
import { UserService } from '../../core/services/user.service';
import { Course } from '../../core/models/course.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StripePaymentComponent } from '../stripe-payment/stripe-payment.component';
import { StripeService } from '../../core/services/stripe.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    StripePaymentComponent
  ],
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
    ])
  ]
})
export class CheckoutComponent implements OnInit {
  course: Course | null = null;
  selectedDate: Date | null = null;
  userForm: FormGroup;
  companyForm: FormGroup;
  purchaseType: string = 'individual';
  isExistingUser = false;
  loading = true;
  loadError = false;
  processingPayment = false;
  showDateAlert = false;
  currentUserId: string = '';
  showCompanyForm = false;

  isPaymentValid = true; // Always start with valid payment for company form
  validationInProgress = false; // Don't show loading by default
  errorMessage = '';
  showErrorAlert = false;

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private userService = inject(UserService);
  private stripeService = inject(StripeService);

  constructor() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      fullName: ['', Validators.required],
      countryCode: [52, [Validators.required, Validators.min(1)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
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
      countryCode: [52, [Validators.required, Validators.min(1)]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      additionalInfo: ['']
    });
  }

  ngOnInit(): void {
    this.loadCheckoutData();

    // For company forms, always allow payment
    this.isPaymentValid = true;
    this.validationInProgress = false;
    this.errorMessage = '';
    this.showErrorAlert = false;

    //this.currentUser = this.userService.getCurrentUserSync();
    // Check for user login status
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        //console.log('Checkout: Using logged in user:', user);
        this.currentUserId = user._id;
        this.isExistingUser = true;
        this.userForm.patchValue({
          email: user.email,
          fullName: user.fullName,
          phone: user.phone || '',
          companyName: user.companyName || ''
        });
        this.userForm.get('password')?.disable();
        this.userForm.get('confirmPassword')?.disable();
      } else {

        // For demo purposes only - in production, this would redirect to login
        this.isExistingUser = false;


        // Redirect to login if not logged in
        this.router.navigate(['/login'], {
          queryParams: {
            redirect: `/checkout/${this.route.snapshot.paramMap.get('courseId')}`,
            date: this.route.snapshot.queryParamMap.get('date')
          }
        });
        return;
      }
    });
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

        // Only validate payment for individual purchases
        if (this.purchaseType == 'individual') {
          this.validatePaymentEligibility();
        }
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
        const mockCourse = courses.find(c => c._id === courseId);
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
          phone: user.phone
        });

        // Add userId to the form for later use
        this.userForm.addControl('userId', this.fb.control(user._id));

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
    const courseId = this.route.snapshot.paramMap.get('courseId');
    const redirectUrl = `/checkout/${courseId}`;
    const queryParams: any = {};
    if (this.selectedDate) {
      queryParams.date = this.selectedDate.toISOString();
    }

    console.log(`Redirecting to login with redirect=${redirectUrl} and params:`, queryParams);

    this.router.navigate(['/login'], {
      queryParams: {
        redirect: redirectUrl,
        ...queryParams
      }
    });
  }

  togglePurchaseType(type: string) {
    // Only proceed if changing to a different type
    // if (this.purchaseType === type) {
    //   return;
    // }
    console.log('Toggling purchase type:', type);
    // Update the purchase type
    this.purchaseType = type;
    this.showCompanyForm = (type === 'company');
    // Important: Always make sure the company form is visible and valid
    if (type === 'company') {
      // Make sure validation doesn't block company form
      this.showCompanyForm = true;
      this.isPaymentValid = true;
      this.showErrorAlert = false;
      this.validationInProgress = false;

      // Ensure company form is properly validated
      this.companyForm.get('companyName')?.updateValueAndValidity();
      this.companyForm.get('rfc')?.updateValueAndValidity();
      this.companyForm.get('contactName')?.updateValueAndValidity();
      this.companyForm.get('contactEmail')?.updateValueAndValidity();
      this.companyForm.get('contactPhone')?.updateValueAndValidity();

      console.log('Switched to company purchase type');
    } else {
      // Revalidate for individual purchases
      this.validatePaymentEligibility();

      // Ensure user form is properly validated
      if (!this.isExistingUser) {
        this.userForm.get('email')?.updateValueAndValidity();
        this.userForm.get('fullName')?.updateValueAndValidity();
        this.userForm.get('phone')?.updateValueAndValidity();
      }

      console.log('Switched to individual purchase type');
    }
  }

  calculateTotal(): number {
    if (!this.course) return 0;

    if (this.purchaseType == 'individual') {
      return this.course.price;
    } else {
      const quantity = this.companyForm.get('quantity')?.value || 1;
      return this.course.price * quantity;
    }
  }


  processPayment() {
    console.log('About to processpayment...');
    if (!this.selectedDate) {
      this.showDateAlert = true;
      return;
    }

    if (this.purchaseType == 'individual' && !this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.processingPayment = true;

    if (this.purchaseType == 'company') {
      // Skip ALL validation for company
      this.processCompanyRequest();
    } else {
      //if (this.purchaseType === 'individual')

      const courseDateId = this.getCourseDateIdForSelectedDate();
      if (!courseDateId) {
        this.handlePaymentError('Invalid course date selected');
        return;
      }

      // Only validate for individual payments
      this.validatenotpreviousenrollment();

      this.processIndividualPayment();
    }
  }

  private validatePaymentEligibility(): void {
    // Skip validation for company purchase type
    if (this.purchaseType == 'company') {
      this.isPaymentValid = true;
      this.validationInProgress = false;
      return;
    }

    if (!this.selectedDate || !this.course) {
      this.validationInProgress = false;
      this.showDateAlert = true;
      return;
    }

    // Get current user ID from your UserService
    const userId = this.userService.getCurrentUserSync()?._id || '';

    this.validationInProgress = true;

    this.stripeService.validatePayment({
      courseId: this.course._id,
      selectedDate: this.selectedDate?.toISOString(),
      userId: userId,
      quantity: 1 // for now this.purchaseType === 'individual' ? this.companyForm.get('quantity')?.value || 1 : 1
    }).subscribe({
      next: (response) => {
        this.validationInProgress = false;

        // For company purchases, always valid
        if (this.purchaseType == 'company') {
          this.isPaymentValid = true;
          return;
        }

        // For individual purchases, use validation result
        if (response.valid) {
          this.isPaymentValid = true;
          this.showErrorAlert = false;
        } else {
          this.isPaymentValid = false;
          this.errorMessage = response.message || 'No se puede proceder con el pago';
          this.showErrorAlert = true;
        }
      },
      error: (error) => {
        this.validationInProgress = false;

        // For company purchases, always valid even on error
        if (this.purchaseType == 'company') {
          this.isPaymentValid = true;
          return;
        }

        // For individual, show error
        this.isPaymentValid = false;
        this.errorMessage = 'No se pudo validar la disponibilidad del curso';
        this.showErrorAlert = true;
        console.error('Payment validation error:', error);
      }
    });
  }


  private validatenotpreviousenrollment() {
    // Skip for company purchases
    if (this.purchaseType == 'company') {
      this.processCompanyRequest();
      return;
    }

    console.log('Validating user purchase eligibility...');
    this.http.post<{ valid: boolean; message?: string }>(`${environment.apiUrl}/payments/validate-payment`, {
      courseId: this.course?._id,
      selectedDate: this.selectedDate?.toISOString(),
      userId: this.currentUserId
    }).subscribe({
      next: (response) => {
        if (response.valid) {
          console.log('User is eligible for purchase:', response);
          console.log('User is eligible for purchase:', response.message);
          // Proceed with payment
          this.processIndividualPayment();
        } else {
          // Show error message
          this.processingPayment = false;
          this.handlePaymentError(response.message || 'Cannot purchase this course');
        }
      },
      error: (error) => {
        console.error('Validation error:', error);
        this.processingPayment = false;
        this.handlePaymentError('Failed to validate purchase eligibility');
      }
    });
  }

  private processIndividualPayment() {
    console.log('About to processpaymentiddividual...');
    const checkoutData = {
      courseId: this.course?._id || '',
      courseTitle: this.course?.title || 'Course Purchase',
      price: this.course?.price || 0,
      quantity: 1,
      customerEmail: this.userForm.get('email')?.value || '',
      customerPhone: this.userForm.get('phone')?.value,
      selectedDate: this.selectedDate?.toISOString(),
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/courses/${this.course?._id}`
    };

    this.stripeService.redirectToCheckout(checkoutData).subscribe({
      next: (result) => {
        if (result.success) {
          console.log('Redirecting to Stripe checkout...');
        } else {
          console.error('Error redirecting to checkout:', result.error);
          this.processingPayment = false;
        }
      },
      error: (error) => {
        console.error('Payment error:', error);
        this.processingPayment = false;
      }
    });
  }

  handlePaymentSuccess(result: { paymentId: string }) {
    console.log('Payment successful', result);

    // Navigate to success page
    this.router.navigate(['/checkout/success'], {
      queryParams: {
        courseId: this.course?._id,
        email: this.userForm.get('email')?.value,
        date: this.selectedDate?.toISOString(),
        paymentId: result.paymentId
      }
    });
  }

  private getCourseDateIdForSelectedDate(): string | null {
    if (!this.course?.courseInstances || !this.selectedDate) {
      return null;
    }

    const selectedDateStr = this.selectedDate.toISOString().split('T')[0];

    const matchingInstance = this.course.courseInstances.find(instance => {
      const instanceDate = new Date(instance.startDate);
      return instanceDate.toISOString().split('T')[0] === selectedDateStr;
    });

    return matchingInstance?._id || null;
  }

  handlePaymentError(error: string) {
    this.processingPayment = false;

    // Display error message to user
    this.errorMessage = error;
    this.showErrorAlert = true;

    // Scroll to error message
    setTimeout(() => {
      const errorElement = document.getElementById('payment-error');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  processCompanyRequest() {
    if (!this.selectedDate) {
      this.showDateAlert = true;
      return;
    }

    if (!this.companyForm.valid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.processingPayment = true;

    const requestData = {
      companyName: this.companyForm.get('companyName')?.value,
      rfc: this.companyForm.get('rfc')?.value,
      contactName: this.companyForm.get('contactName')?.value,
      contactEmail: this.companyForm.get('contactEmail')?.value,
      contactPhone: `${this.companyForm.get('countryCode')?.value}${this.companyForm.get('contactPhone')?.value}`,
      quantity: this.companyForm.get('quantity')?.value || 1,
      additionalInfo: this.companyForm.get('additionalInfo')?.value,
      courseId: this.course?._id,
      courseTitle: this.course?.title,
      selectedDate: this.selectedDate?.toISOString()
    };

    this.http.post(`${environment.apiUrl}/company-purchase`, requestData)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/checkout/company-success'], {
            queryParams: {
              companyName: this.companyForm.get('companyName')?.value,
              contactEmail: this.companyForm.get('contactEmail')?.value,
              courseId: this.course?._id,
              date: this.selectedDate?.toISOString(),
              quantity: this.companyForm.get('quantity')?.value,
              requestId: 'COMP-' + Math.floor(Math.random() * 10000)
            }
          });
          this.processingPayment = false;
        },
        error: (error) => {
          console.error('Error submitting company request', error);
          this.processingPayment = false;
          // Show error message
        }
      });
  }

  // Method to return to course details
  backToCourse() {
    if (this.course) {
      this.router.navigate(['/course', this.course._id]);
    } else {
      this.router.navigate(['/courses']);
    }
  }
}