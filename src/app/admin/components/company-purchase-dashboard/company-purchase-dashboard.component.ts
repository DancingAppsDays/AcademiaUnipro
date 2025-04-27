// src/app/admin/components/company-purchase-dashboard/company-purchase-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CompanyPurchase {
  _id: string;
  companyName: string;
  rfc: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  course: any;
  courseTitle: string;
  selectedDate: Date;
  quantity: number;
  additionalInfo?: string;
  status: string;
  requestId: string;
  enrollmentIds: string[];
  adminNotes?: string;
  paymentMethod?: string;
  paymentReference?: string;
  paymentAmount?: number;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-company-purchase-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './company-purchase-dashboard.component.html',
  styleUrls: ['./company-purchase-dashboard.component.scss']
})
export class CompanyPurchaseDashboardComponent implements OnInit {
  purchases: CompanyPurchase[] = [];
  selectedPurchase: CompanyPurchase | null = null;
  loading = true;
  error: string | null = null;
  selectedStatus = 'all';
  
  statusForm: FormGroup;
  paymentForm: FormGroup;
  
  statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'contacted', label: 'Contactado' },
    { value: 'payment_pending', label: 'Pago Pendiente' },
    { value: 'paid', label: 'Pagado' },
    { value: 'completed', label: 'Completado' },
    { value: 'canceled', label: 'Cancelado' }
  ];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      notes: ['']
    });
    
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      paymentReference: ['', Validators.required],
      paymentAmount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.loading = true;
    let url = `${environment.apiUrl}/admin/company-purchases`;
    
    if (this.selectedStatus !== 'all') {
      url += `?status=${this.selectedStatus}`;
    }
    
    this.http.get<CompanyPurchase[]>(url)
      .subscribe({
        next: (data) => {
          this.purchases = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load company purchases: ' + (err.message || 'Unknown error');
          this.loading = false;
        }
      });
  }

  onStatusChange(event: Event): void {
    this.selectedStatus = (event.target as HTMLSelectElement).value;
    this.loadPurchases();
  }

  selectPurchase(purchase: CompanyPurchase): void {
    this.selectedPurchase = purchase;
    this.statusForm.patchValue({
      status: purchase.status,
      notes: ''
    });
    
    this.paymentForm.reset({
      paymentMethod: '',
      paymentReference: '',
      paymentAmount: purchase.paymentAmount || purchase.course?.price * purchase.quantity || 0
    });
  }

  updateStatus(): void {
    if (!this.selectedPurchase || !this.statusForm.valid) return;
    
    const url = `${environment.apiUrl}/admin/company-purchases/${this.selectedPurchase._id}/status`;
    const data = this.statusForm.value;
    
    this.http.post(url, data)
      .subscribe({
        next: (response) => {
          this.loadPurchases();
          // Update the selected purchase with the new data
          this.selectedPurchase = response as CompanyPurchase;
          alert('Status updated successfully');
        },
        error: (err) => {
          alert('Failed to update status: ' + (err.message || 'Unknown error'));
        }
      });
  }

  recordPayment(): void {
    if (!this.selectedPurchase || !this.paymentForm.valid) return;
    
    const url = `${environment.apiUrl}/admin/company-purchases/${this.selectedPurchase._id}/payment`;
    const data = this.paymentForm.value;
    
    this.http.post(url, data)
      .subscribe({
        next: (response) => {
          this.loadPurchases();
          // Update the selected purchase with the new data
          this.selectedPurchase = response as CompanyPurchase;
          alert('Payment recorded successfully');
        },
        error: (err) => {
          alert('Failed to record payment: ' + (err.message || 'Unknown error'));
        }
      });
  }

  manageEnrollments(purchaseId: string): void {
    // Navigate to enrollment management for this company purchase
    // Implementation depends on your routing setup
    alert('Navigate to enrollment management - Not implemented yet');
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString();
  }
}