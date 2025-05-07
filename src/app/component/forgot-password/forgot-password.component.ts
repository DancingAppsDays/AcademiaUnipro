// src/app/component/forgot-password/forgot-password.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  ngOnInit(): void {
    // Form is already initialized in constructor
  }
  
  get email() { 
    return this.forgotPasswordForm.get('email'); 
  }
  
  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    const emailValue = this.email?.value;
    
    if (!emailValue) {
      this.errorMessage = 'Por favor ingresa un correo electrónico válido.';
      this.loading = false;
      return;
    }
    
    this.authService.requestPasswordReset(emailValue)
      .subscribe({
        next: () => {
          this.loading = false;
          this.submitted = true;
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'No se pudo procesar tu solicitud. Por favor, intenta nuevamente más tarde.';
          console.error('Password reset request failed:', error);
        }
      });
  }
}