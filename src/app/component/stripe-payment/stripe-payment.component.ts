// src/app/component/stripe-payment/stripe-payment.component.ts
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { 
  loadStripe, 
  Stripe, 
  StripeElements,
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
        <h2>PAGO SEGURO</h2>
        <p class="security-message">TODAS LAS TRANSACCIONES SON SEGURAS Y ENCRIPTADAS</p>
      </div>
      
      <form [formGroup]="paymentForm">
        <div class="card-element-container">
          <label>Información de tarjeta</label>
          
          <div class="card-row">
            <div class="card-field card-number">
              <label for="card-number-element">Número de tarjeta</label>
              <div id="card-number-element" class="form-control card-element"></div>
            </div>
          </div>
          
          <div class="card-row">
            <div class="card-field card-expiry">
              <label for="card-expiry-element">Fecha de expiración</label>
              <div id="card-expiry-element" class="form-control card-element"></div>
            </div>
            
            <div class="card-field card-cvc">
              <label for="card-cvc-element">CVC</label>
              <div id="card-cvc-element" class="form-control card-element"></div>
            </div>
          </div>
          
          <div id="card-errors" class="card-errors" role="alert">{{errorMessage}}</div>
        </div>
        
        <button 
          type="button" 
          class="btn btn-primary payment-button" 
          [disabled]="loading || !stripe || !elements"
          (click)="processPayment()">
          <div *ngIf="loading" class="spinner-border spinner-border-sm me-2"></div>
          <span>Pagar {{ amount | currency:'MXN':'symbol':'1.0-0' }}</span>
        </button>
      </form>
      
      <div class="payment-security-info">
        <div class="security-badge">
          <i class="bi bi-shield-check"></i>
          <span>Pago 100% seguro</span>
        </div>
        <div class="security-badge">
          <i class="bi bi-lock"></i>
          <span>Cifrado SSL</span>
        </div>
      </div>
      
      <div class="payment-cards">
        <img src="assets/images/visa-mastercard-logos.png" alt="Visa">
      
      </div>
    </div>
  `,
  styles: [`
    .stripe-payment-container {
      font-family: 'Montserrat', sans-serif;
      padding: 1.5rem;
      background-color: #f9f9f9;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    
    .payment-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    h2 {
      font-weight: 700;
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
      color: #0066b3;
    }
    
    .security-message {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    .card-element-container {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.8rem;
      font-weight: 600;
      color: #333;
      font-size: 1rem;
    }
    
    .card-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .card-field {
      flex: 1;
      
      label {
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }
    }
    
    .card-number {
      flex: 1;
    }
    
    .card-expiry {
      flex: 0.6;
    }
    
    .card-cvc {
      flex: 0.4;
    }
    
    .card-element {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      font-size: 16px;
      height: 45px;
      width: 100%;
    }
    
    .card-errors {
      color: #dc3545;
      font-size: 0.9rem;
      margin-top: 0.8rem;
      min-height: 20px;
      font-weight: 500;
    }
    
    .payment-button {
      width: 100%;
      padding: 1rem;
      background-color: #0066b3;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-top:.5rem;
    }
    
    .payment-button:hover:not(:disabled) {
      background-color: #004c86;
    }
    
    .payment-button:disabled {
      background-color: #6ca6d9;
      cursor: not-allowed;
    }
    
    .payment-security-info {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    
    .security-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #0066b3;
      font-size: 0.9rem;
      font-weight: 500;
      
      i {
        font-size: 1.1rem;
      }
    }
    
    .payment-cards {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 1.5rem;
    }
    
    .payment-cards img {
      height: 30px;
    }
    
    @media (max-width: 576px) {
      .card-row {
        flex-direction: column;
        gap: 0.75rem;
      }
    }
  `]
})
export class StripePaymentComponent implements OnInit, OnDestroy {
  @Input() amount: number = 0;
  @Input() courseId: string = '';
  @Input() courseTitle: string = '';
  @Input() customerEmail: string = '';
  @Input() selectedDate: string = '';
  @Input() userId: string = ''; 

  @Output() paymentSuccess = new EventEmitter<{ paymentId: string }>();
  @Output() paymentError = new EventEmitter<string>();

  paymentForm: FormGroup;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElements: {
    number: any;
    expiry: any;
    cvc: any;
  } | null = null;
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
    if (this.cardElements) {
      this.cardElements.number.destroy();
      this.cardElements.expiry.destroy();
      this.cardElements.cvc.destroy();
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
      this.errorMessage = 'No se pudo cargar el procesador de pagos. Por favor intente más tarde.';
      this.loading = false;
    }
  }

  private createPaymentIntent() {
    const paymentData = {
      courseId: this.courseId,
      courseTitle: this.courseTitle || 'Compra de Curso',
      price: this.amount,
      quantity: 1,
      customerEmail: this.customerEmail,
      selectedDate: this.selectedDate || new Date().toISOString(),
      userId: this.userId
    };

    this.stripeService.createPaymentIntent(paymentData).subscribe({
      next: (response) => {
        if (response.clientSecret) {
          this.clientSecret = response.clientSecret;
          this.initializeCardElement();
        } else {
          console.error('No client secret provided');
          this.errorMessage = 'Error al inicializar el pago. Por favor intente nuevamente.';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Failed to create payment intent:', error);
        this.errorMessage = 'Error al inicializar el pago. Por favor intente nuevamente.';
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
          borderRadius: '8px',
          fontSizeBase: '16px',
          spacingUnit: '4px',
          fontWeightNormal: '500'
        },
        rules: {
          '.Label': {
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px'
          },
          '.Input': {
            padding: '16px',
            fontSize: '16px'
          },
          '.Error': {
            fontSize: '14px',
            color: '#dc3545',
            marginTop: '8px'
          }
        }
      }
    };

    this.elements = this.stripe.elements(options);

    // Create separate card elements instead of a single card element
    const cardNumberElement = this.elements.create('cardNumber', {
      style: {
        base: {
          color: '#32325d',
          fontFamily: 'Montserrat, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          },
          iconColor: '#0066b3'
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    });
    
    const cardExpiryElement = this.elements.create('cardExpiry', {
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
          color: '#fa755a'
        }
      }
    });
    
    const cardCvcElement = this.elements.create('cardCvc', {
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
          color: '#fa755a'
        }
      }
    });
    
    // Mount each element to its respective container
    cardNumberElement.mount('#card-number-element');
    cardExpiryElement.mount('#card-expiry-element');
    cardCvcElement.mount('#card-cvc-element');
    
    // Store elements for later use
    this.cardElements = {
      number: cardNumberElement,
      expiry: cardExpiryElement,
      cvc: cardCvcElement
    };
    
    // Handle validation errors for each element
    const handleCardChange = (event: any) => {
      if (event.error) {
        this.errorMessage = event.error.message;
      } else {
        this.errorMessage = '';
      }
    };
    
    cardNumberElement.on('change', handleCardChange);
    cardExpiryElement.on('change', handleCardChange);
    cardCvcElement.on('change', handleCardChange);
    
    this.loading = false;
  }

  async processPayment() {
    if (!this.stripe || !this.elements || !this.cardElements) {
      this.errorMessage = 'Sistema de pago no inicializado. Por favor intente nuevamente.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      // Create payment method using card number element
      const result = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElements.number,
        billing_details: {
          email: this.customerEmail || undefined
        }
      });
      
      if (result.error) {
        throw new Error(result.error.message || 'Error al procesar la tarjeta');
      }
      
      // Confirm the payment with the payment method
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: result.paymentMethod.id
      });

      if (error) {
        throw new Error(error.message || 'Ocurrió un error durante el procesamiento del pago');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        this.paymentSuccess.emit({ 
          paymentId: paymentIntent.id
        });
      } else {
        throw new Error('El estado del pago no es exitoso. Por favor intente nuevamente.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      this.errorMessage = error.message || 'Error al procesar el pago. Por favor intente nuevamente.';
      this.paymentError.emit(this.errorMessage);
    } finally {
      this.loading = false;
    }
  }
}