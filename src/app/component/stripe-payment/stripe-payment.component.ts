import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  loadStripe, 
  Stripe, 
  StripeElements,
  StripeElementsOptions,
  Appearance
} from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { StripeService } from '../../core/services/stripe.service';

@Component({
  selector: 'app-stripe-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="stripe-payment-container">
      <div class="payment-header">
        <h2>PAYMENT</h2>
        <p class="security-message">ALL TRANSACTIONS ARE SECURE AND ENCRYPTED</p>
      </div>
      
      <form [formGroup]="paymentForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" class="form-control" formControlName="email">
        </div>
        
        <!-- Stripe Elements will be injected here -->
        <div id="payment-element" class="form-control payment-element"></div>
        
        <div *ngIf="errorMessage" class="payment-error">
          {{ errorMessage }}
        </div>
        
        <button 
          type="button" 
          class="btn btn-primary payment-button" 
          [disabled]="loading || !paymentForm.valid"
          (click)="processPayment()">
          <div *ngIf="loading" class="spinner-border spinner-border-sm me-2"></div>
          <span>Pay {{ amount | currency:'MXN':'symbol':'1.0-0' }}</span>
        </button>
      </form>
      
      <div class="payment-cards">
        <img src="assets/images/payment/visa.png" alt="Visa">
        <img src="assets/images/payment/mastercard.png" alt="Mastercard">
        <img src="assets/images/payment/amex.png" alt="American Express">
        <img src="assets/images/payment/jcb.png" alt="JCB">
      </div>
    </div>
  `,
  styles: [`
    .stripe-payment-container {
      padding: 1rem;
      font-family: 'Montserrat', sans-serif;
    }
    
    .payment-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    h2 {
      font-weight: 700;
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
      color: #333;
    }
    
    .security-message {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }
    
    .form-control {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
    }
    
    .payment-element {
      min-height: 150px;
      margin-bottom: 1.5rem;
      padding: 0;
      background: #f9f9f9;
    }
    
    .payment-error {
      color: #dc3545;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    
    .payment-button {
      width: 100%;
      padding: 0.8rem;
      background-color: #0066b3;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .payment-button:hover:not(:disabled) {
      background-color: #004c86;
    }
    
    .payment-button:disabled {
      background-color: #6ca6d9;
      cursor: not-allowed;
    }
    
    .payment-cards {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 1.5rem;
    }
    
    .payment-cards img {
      height: 25px;
    }
  `]
})
export class StripePaymentComponent implements OnInit, OnDestroy {
  @Input() amount: number = 0;
  @Input() courseId: string = '';
  @Input() customerEmail: string = '';
  @Output() paymentSuccess = new EventEmitter<{ paymentId: string }>();
  @Output() paymentError = new EventEmitter<string>();

  paymentForm: FormGroup;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  clientSecret: string = '';
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService
  ) {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    // Initialize email with the input value if available
    if (this.customerEmail) {
      this.paymentForm.patchValue({ email: this.customerEmail });
    }
    
    // Initialize Stripe
    this.initializeStripe();
  }

  ngOnDestroy() {
    // Clean up Stripe elements if needed
  }

  private async initializeStripe() {
    try {
      // Load Stripe.js
      this.stripe = await loadStripe(environment.stripePublishableKey || 'pk_test_demo');
      
      if (!this.stripe) {
        throw new Error('Failed to load Stripe.js');
      }
      
      // Create a payment intent
      this.loading = true;
      this.preparePayment();
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      this.errorMessage = 'Could not load payment processor. Please try again later.';
      this.loading = false;
    }
  }

  private preparePayment() {
    // Use the StripeService to create a payment intent
    const checkoutData = {
      courseId: this.courseId,
      courseTitle: 'Course Purchase', // Ideally this would come from the parent component
      price: this.amount,
      quantity: 1,
      customerEmail: this.customerEmail,
      selectedDate: new Date().toISOString(),
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout/${this.courseId}`
    };


    // Call the backend to create a checkout session
    this.stripeService.createCheckoutSession(checkoutData).subscribe({
      next: (response) => {
        if (response.url) {
          // Redirect to Stripe's checkout page
          window.location.href = response.url;
        } else {
          console.error('No checkout URL provided');
          this.errorMessage = 'Failed to initialize payment. Please try again.';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Failed to create checkout session:', error);
        this.errorMessage = 'Failed to initialize payment. Please try again.';
        this.loading = false;
      }
    });

    
  
    //This is for embeedded payment intent with client secret

    // this.stripeService.createCheckoutSession(checkoutData).subscribe({
    //   next: (response) => {
    //     if (response.sessionId) {
    //       this.clientSecret = response.sessionId;
    //       this.initializeElements();
    //     } else {
    //       // For demo purposes, generate a fake client secret
    //       //this.clientSecret = 'pi_demo_' + Math.random().toString(36).substring(2, 15);
    //       this.clientSecret =  environment.stripePublishableKey;//`pk_test_${Math.random().toString(36).substring(2, 15)}_secret_${Math.random().toString(36).substring(2, 15)}`;
    //       this.initializeElements();
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Failed to create payment intent:', error);
    //     this.errorMessage = 'Failed to initialize payment. Please try again.';
    //     this.loading = false;
    //   }
    // });




  }

  private initializeElements() {
    if (!this.stripe || !this.clientSecret) {
      this.loading = false;
      return;
    }

    // Create Stripe Elements
    const appearance: Appearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0066b3',
        colorBackground: '#ffffff',
        colorText: '#333333',
        colorDanger: '#dc3545',
        fontFamily: 'Montserrat, sans-serif',
        borderRadius: '4px',
      }
    };

    // Initialize Elements with the appearance and client secret
    const options: StripeElementsOptions = {
      appearance,
      clientSecret: this.clientSecret
    };
    
    this.elements = this.stripe.elements(options);

    // Create and mount the Payment Element
    const paymentElementOptions = {
      layout: {
        type: 'tabs' as const,
        defaultCollapsed: false,
      }
    };

    // Use 'card' element instead of 'payment' for better compatibility
    const cardElement = this.elements.create('card', {
      style: {
        base: {
          color: '#32325d',
          fontFamily: 'Montserrat, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    });
    
    cardElement.mount('#payment-element');
    
    // Handle validation errors
    cardElement.on('change', (event) => {
      this.errorMessage = event.error ? event.error.message : '';
    });
    
    this.loading = false;
  }

  async processPayment() {
    if (!this.stripe || !this.elements) {
      this.errorMessage = 'Payment system not initialized. Please try again.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      // For demo purposes, we'll simulate a successful payment
      // In production, you would use this:
      /*
      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          receipt_email: this.paymentForm.get('email')?.value,
        }
      });

      if (error) {
        throw new Error(error.message || 'An error occurred during payment processing');
      }
      */

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      this.paymentSuccess.emit({ 
        paymentId: 'pi_' + Math.random().toString(36).substring(2, 15) 
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      this.errorMessage = error.message || 'Failed to process payment. Please try again.';
      this.paymentError.emit(this.errorMessage);
    } finally {
      this.loading = false;
    }
  }
}