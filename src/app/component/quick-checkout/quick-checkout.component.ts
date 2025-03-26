import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-quick-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './quick-checkout.component.html',
  styleUrls: ['./quick-checkout.component.scss'],
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
    trigger('shakeAnimation', [
      transition('* => shake', [
        style({ transform: 'translateX(0)' }),
        animate('100ms', style({ transform: 'translateX(-10px)' })),
        animate('100ms', style({ transform: 'translateX(10px)' })),
        animate('100ms', style({ transform: 'translateX(-10px)' })),
        animate('100ms', style({ transform: 'translateX(10px)' })),
        animate('100ms', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class QuickCheckoutComponent implements OnInit {
  course: Course | null = null;
  selectedDate: Date | null = null;
  customerForm: FormGroup;
  corporateForm: FormGroup;
  purchaseType: 'individual' | 'corporate' = 'individual';
  loading = true;
  loadError = false;
  processingPayment = false;
  success = false;

  // Error handling
  errorMessage: string | null = null;
  showErrorAlert = false;
  errorTimeout: any;
  shakeState: string | null = null;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private http = inject(HttpClient);

  constructor() {
    this.customerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      acceptTerms: [false, Validators.requiredTrue]
    });

    this.corporateForm = this.fb.group({
      companyName: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      additionalInfo: ['']
    });
  }

  ngOnInit(): void {
    this.loadCheckoutData();
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
    this.showError(message);
  }

  togglePurchaseType(type: 'individual' | 'corporate'): void {
    this.purchaseType = type;
  }

  calculateTotal(): number {
    if (!this.course) return 0;

    if (this.purchaseType === 'individual') {
      return this.course.price;
    } else {
      const quantity = this.corporateForm.get('quantity')?.value || 1;
      return this.course.price * quantity;
    }
  }

  processPayment(): void {
    // Validate form based on purchase type
    if (this.purchaseType === 'individual' && !this.customerForm.valid) {
      this.customerForm.markAllAsTouched();
      this.shakeState = 'shake';
      this.showError('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (this.purchaseType === 'corporate' && !this.corporateForm.valid) {
      this.corporateForm.markAllAsTouched();
      this.shakeState = 'shake';
      this.showError('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (!this.course || !this.selectedDate) {
      this.showError('Error: Información del curso o fecha no disponible');
      return;
    }

    this.processingPayment = true;
    this.errorMessage = null;

    // Prepare data based on purchase type
    const paymentData = this.purchaseType === 'individual'
      ? this.prepareIndividualData()
      : this.prepareCorporateData();





      
    // Log the data being sent
    console.log('Sending checkout data to backend:', JSON.stringify(paymentData, null, 2));
    
    this.router.navigate(['/checkout/success'], {
      queryParams: {
        email: this.customerForm.get('email')?.value,
        courseId: this.course?.id
      }
    });

    // Send to external backend
    this.sendToExternalBackend(paymentData);
  }

  private prepareIndividualData(): any {
    return {
      type: 'individual',
      courseId: this.course?.id,
      courseTitle: this.course?.title,
      coursePrice: this.course?.price,
      selectedDate: this.selectedDate,
      fullName: this.customerForm.get('fullName')?.value,
      email: this.customerForm.get('email')?.value,
      phone: this.customerForm.get('phone')?.value,
      acceptedTerms: true,
      submittedAt: new Date().toISOString()
    };
  }

  private prepareCorporateData(): any {
    return {
      type: 'corporate',
      courseId: this.course?.id,
      courseTitle: this.course?.title,
      coursePrice: this.course?.price,
      totalAmount: this.calculateTotal(),
      selectedDate: this.selectedDate,
      companyName: this.corporateForm.get('companyName')?.value,
      contactName: this.corporateForm.get('contactName')?.value,
      contactEmail: this.corporateForm.get('contactEmail')?.value,
      contactPhone: this.corporateForm.get('contactPhone')?.value,
      quantity: this.corporateForm.get('quantity')?.value,
      additionalInfo: this.corporateForm.get('additionalInfo')?.value,
      submittedAt: new Date().toISOString()
    };
  }

  private sendToExternalBackend(data: any): void {
    // Replace with your external backend URL
    const apiUrl = 'https://api.example.com/course-registrations';

    this.http.post(apiUrl, data)
      .pipe(
        // Add timeout to handle when server doesn't respond
        timeout(30000),
        // Handle errors
        catchError((error: HttpErrorResponse) => {
          console.error('Registration failed:', error);

          let errorMsg = 'Error al procesar la solicitud. ';

          if (error.status === 0) {
            errorMsg += 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
          } else if (error.status === 408) {//|| error.name === 'TimeoutError') {
            errorMsg += 'La solicitud ha excedido el tiempo de espera. Intente nuevamente.';
          } else if (error.status === 400) {
            errorMsg += 'Datos inválidos. Por favor verifique la información proporcionada.';
          } else if (error.status === 500) {
            errorMsg += 'Error interno del servidor. Intente más tarde.';
          } else {
            errorMsg += 'Código de error: ' + error.status;
          }

          this.showError(errorMsg);
          return throwError(() => new Error(errorMsg));
        }),
        // Always run this code when the observable completes or errors
        finalize(() => {
          this.processingPayment = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('Registration successful, server response:', response);

          // Check for explicit success confirmation in response
          if (response && response.success === true) {
            this.handleSuccessfulRegistration(data);
          } else {
            console.warn('Backend response did not explicitly confirm success');
            // Check if the response contains any data that suggests success
            if (response && (response.id || response.purchaseId || response.registrationId)) {
              console.log('Found ID in response, treating as success');
              this.handleSuccessfulRegistration(data, response.id || response.purchaseId || response.registrationId);
            } else {
              this.showError('No se pudo confirmar la compra. Por favor, contáctenos para verificar el estado de su solicitud.');
            }
          }
        },
        error: (error) => {
          // Error handling is done in the catchError operator
          console.error('Error callback reached:', error);

          // DEVELOPMENT ONLY: For testing without a real backend, comment the above and uncomment below
          /*
          console.log('DEVELOPMENT MODE: Simulating successful registration despite error');
          this.handleSuccessfulRegistration(data, 'DEV-' + Math.floor(Math.random() * 10000));
          */
        }
      });
  }

  private handleSuccessfulRegistration(data: any, purchaseId?: string): void {
    this.success = true;

    // Navigate to appropriate success page based on purchase type
    if (this.purchaseType === 'individual') {
      this.router.navigate(['/checkout/success'], {
        queryParams: {
          email: data.email,
          courseId: this.course?.id,
          date: this.selectedDate?.toISOString(),
          purchaseId: purchaseId || 'PENDING'
        }
      });
    } else {
      this.router.navigate(['/checkout/company-success'], {
        queryParams: {
          companyName: data.companyName,
          contactEmail: data.contactEmail,
          courseId: this.course?.id,
          date: this.selectedDate?.toISOString(),
          quantity: data.quantity,
          requestId: purchaseId || 'PENDING'
        }
      });
    }
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.showErrorAlert = true;

    // Clear any existing timeout
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    // Hide the error after 5 seconds
    this.errorTimeout = setTimeout(() => {
      this.showErrorAlert = false;
    }, 5000);

    // Reset shake animation after completion
    setTimeout(() => {
      this.shakeState = null;
    }, 500);
  }

  // Method to return to course details
  backToCourse(): void {
    if (this.course) {
      this.router.navigate(['/course', this.course.id]);
    } else {
      this.router.navigate(['/courses']);
    }
  }
}