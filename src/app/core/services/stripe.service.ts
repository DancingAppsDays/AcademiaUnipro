import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';

export interface StripeCheckoutSessionRequest {
  courseId: string;
  courseTitle: string;
  price: number;
  quantity: number;
  customerEmail?: string;
  customerName?: string;
  selectedDate?: Date | string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutResponse {
  sessionId: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private http = inject(HttpClient);
  private stripePromise: Promise<Stripe | null>;
  private apiBaseUrl = environment.apiUrl || 'https://api.example.com';
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Expose loading state as an observable
  public loading$ = this.loadingSubject.asObservable();

  constructor() {
    // Initialize Stripe with your publishable key
    // IMPORTANT: Replace with your actual Stripe publishable key
    this.stripePromise = loadStripe(environment.stripePublishableKey || 'pk_test_your_key');
  }

  /**
   * Creates a Stripe Checkout session and redirects to the Stripe Checkout page
   * @param checkoutData Information about the course being purchased
   * @returns Observable that resolves when redirect happens or errors
   */
  public createCheckoutSession(checkoutData: StripeCheckoutSessionRequest): Observable<StripeCheckoutResponse> {
    this.loadingSubject.next(true);

    // Endpoint to create a Stripe checkout session
    const endpoint = `${this.apiBaseUrl}/payments/create-checkout-session`;

    return this.http.post<StripeCheckoutResponse>(endpoint, checkoutData).pipe(
      tap(response => {
        console.log('Stripe checkout session created:', response);
      }),
      catchError(error => {
        console.error('Error creating Stripe checkout session:', error);
        this.loadingSubject.next(false);
        throw error;
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Creates checkout session and redirects to Stripe Checkout
   * @param checkoutData Information about the course being purchased
   * @returns Observable that resolves when redirect happens or errors
   */
  public redirectToCheckout(checkoutData: StripeCheckoutSessionRequest): Observable<{ success: boolean; error?: any }> {
    return this.createCheckoutSession(checkoutData).pipe(
      switchMap(response => {
        // If the backend returns a direct URL, use that
        if (response.url) {
          window.location.href = response.url;
          return of({ success: true });
        }

        // Otherwise use Stripe.js to redirect
        return from(this.stripePromise).pipe(
          switchMap(stripe => {
            if (!stripe) {
              throw new Error('Stripe failed to load');
            }

            return from(stripe.redirectToCheckout({
              sessionId: response.sessionId
            }));
          }),
          map(result => {
            if (result.error) {
              return {
                success: false,
                error: result.error
              };
            }
            return { success: true };
          })
        );
      }),
      catchError(error => {
        console.error('Stripe checkout redirection failed:', error);
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Verifies a payment status after redirection from Stripe
   * @param sessionId The session ID returned in the URL as query parameter
   * @returns Observable with payment verification result
   */
  public verifyPayment(sessionId: string): Observable<{ success: boolean; orderId?: string }> {
    const endpoint = `${this.apiBaseUrl}/payments/verify-session/${sessionId}`;
    return this.http.get<{ success: boolean; orderId?: string }>(endpoint);
  }

  /**
   * Get a list of payment methods for the current customer
   * (Requires customer to be logged in and associated with a Stripe customer ID)
   * @returns Observable with list of payment methods
   */
  public getCustomerPaymentMethods(): Observable<any[]> {
    const endpoint = `${this.apiBaseUrl}/payments/payment-methods`;
    return this.http.get<any[]>(endpoint).pipe(
      catchError(error => {
        console.error('Error fetching payment methods:', error);
        return of([]);
      })
    );
  }
}