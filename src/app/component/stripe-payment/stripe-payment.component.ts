// src/app/component/stripe-payment/stripe-payment.component.ts
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  loadStripe, 
  Stripe, 
  StripeElements,
  StripeCardElement,
  StripeElementsOptions
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
        <div class="card-element-container">
          <label for="card-element">Credit or debit card</label>
          <!-- Stripe Elements will mount here -->
          <div id="card-element" class="form-control card-element"></div>
          <div id="card-errors" class="card-errors" role="alert">{{errorMessage}}</div>
        </div>
        
        <button 
          type="button" 
          class="btn btn-primary payment-button" 
          [disabled]="loading || !stripe || !elements"
          (click)="processPayment()">
          <div *ngIf="loading" class="spinner-border spinner-border-sm me-2"></div>
          <span>Pay {{ amount | currency:'MXN':'symbol':'1.0-0' }}</span>
        </button>
      </form>
      
      <div class="payment-cards">
        <img src="assets/images/payment/visa.png" alt="Visa">
        <img src="assets/images/payment/mastercard.png" alt="Mastercard">
        <img src="assets/images/payment/amex.png" alt="American Express">
      </div>
    </div>
  `,
  styles: [`
    .stripe-payment-container {
      font-family: 'Montserrat', sans-serif;
      padding: 1rem;
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
    
    .card-element-container {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }
    
    .card-element {
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 1rem;
      background: #f9f9f9;
    }
    
    .card-errors {
      color: #dc3545;
      font-size: 0.9rem;
      margin-top: 0.5rem;
      min-height: 20px;
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
  @Input() courseTitle: string = '';
  @Input() customerEmail: string = '';
  @Input() selectedDate: string = '';
  @Output() paymentSuccess = new EventEmitter<{ paymentId: string }>();
  @Output() paymentError = new EventEmitter<string>();

  paymentForm: FormGroup;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  clientSecret: string = '';
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService
  ) {
    this.paymentForm = this.fb.group({});
  }

  ngOnInit() {
    this.initializeStripe();
  }

  ngOnDestroy() {
    // Clean up Stripe elements if needed
    if (this.card) {
      this.card.destroy();
    }
  }

  private async initializeStripe() {
    try {
      // Load Stripe.js
      this.stripe = await loadStripe(environment.stripePublishableKey);
      
      if (!this.stripe) {
        throw new Error('Failed to load Stripe.js');
      }
      
      // Create a payment intent
      this.loading = true;
      this.createPaymentIntent();
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      this.errorMessage = 'Could not load payment processor. Please try again later.';
      this.loading = false;
    }
  }

  private createPaymentIntent() {
    const paymentData = {
      courseId: this.courseId,
      courseTitle: this.courseTitle || 'Course Purchase',
      price: this.amount,
      quantity: 1,
      customerEmail: this.customerEmail,
      selectedDate: this.selectedDate || new Date().toISOString(),
      userId: localStorage.getItem('userId') || ''
    };

    this.stripeService.createPaymentIntent(paymentData).subscribe({
      next: (response) => {
        if (response.clientSecret) {
          this.clientSecret = response.clientSecret;
          this.initializeCardElement();
        } else {
          console.error('No client secret provided');
          this.errorMessage = 'Failed to initialize payment. Please try again.';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Failed to create payment intent:', error);
        this.errorMessage = 'Failed to initialize payment. Please try again.';
        this.loading = false;
      }
    });
  }

  private initializeCardElement() {
    if (!this.stripe) {
      this.loading = false;
      return;
    }

    // Create Stripe Elements instance
    const options: StripeElementsOptions = {
      clientSecret: this.clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0066b3',
          colorBackground: '#ffffff',
          colorText: '#333333',
          colorDanger: '#dc3545',
          fontFamily: 'Montserrat, sans-serif',
          borderRadius: '4px',
        }
      }
    };

    this.elements = this.stripe.elements(options);

    // Create a card Element and mount it
    this.card = this.elements.create('card', {
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
    
    this.card.mount('#card-element');
    
    // Handle validation errors
    this.card.on('change', (event) => {
      if (event.error) {
        this.errorMessage = event.error.message;
      } else {
        this.errorMessage = '';
      }
    });
    
    this.loading = false;
  }

  async processPayment() {
    if (!this.stripe || !this.elements || !this.card) {
      this.errorMessage = 'Payment system not initialized. Please try again.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      // Confirm the payment
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            email: this.customerEmail || undefined
          }
        }
      });

      if (error) {
        throw new Error(error.message || 'An error occurred during payment processing');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        this.paymentSuccess.emit({ 
          paymentId: paymentIntent.id
        });
      } else {
        throw new Error('Payment status is not successful. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      this.errorMessage = error.message || 'Failed to process payment. Please try again.';
      this.paymentError.emit(this.errorMessage);
    } finally {
      this.loading = false;
    }
  }
}