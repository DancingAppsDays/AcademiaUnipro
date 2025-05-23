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
  metadata?: any;
}

interface CourseDate {
  _id: string;
  startDate: Date;
  capacity: number;
  enrolledCount: number;
  availableSeats: number;
}

interface EnrollmentInfo {
  _id: string;
  userName: string;
  email: string;
  status: string;
  createdAt: Date;
}

@Component({
  selector: 'app-company-purchase-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
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
  quantityForm: FormGroup;
  enrollmentForm: FormGroup;

  // Course capacity and enrollment management
  courseDateInfo: CourseDate | null = null;
  enrollments: EnrollmentInfo[] = [];
  enrollmentLoading = false;
  enrolledCount = 0;
  availableSlots = 0;
  
  statusOptions = [
    { value: 'pending', label: 'Pendiente', description: 'Solicitud recibida, pendiente de revisión' },
    { value: 'contacted', label: 'Contactado', description: 'Se ha contactado a la empresa' },
    { value: 'payment_pending', label: 'Pago Pendiente', description: 'Esperando confirmación de pago' },
    { value: 'paid', label: 'Pagado', description: 'Pago recibido, asientos reservados' },
    { value: 'completed', label: 'Completado', description: 'Todas las inscripciones completadas' },
    { value: 'canceled', label: 'Cancelado', description: 'Solicitud cancelada' }
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

    this.quantityForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    
    this.enrollmentForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userId: ['']
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

  async selectPurchase(purchase: CompanyPurchase): Promise<void> {
    this.selectedPurchase = purchase;
    
    // Load course date information
    await this.loadCourseDateInfo(purchase);
    
    // Load enrollments if purchase is paid or completed
    if (purchase.status === 'paid' || purchase.status === 'completed') {
      await this.loadEnrollments(purchase._id);
    }
    
    // Fill in the forms with current values
    this.statusForm.patchValue({
      status: purchase.status,
      notes: ''
    });
    
    this.paymentForm.reset({
      paymentMethod: purchase.paymentMethod || '',
      paymentReference: purchase.paymentReference || '',
      paymentAmount: purchase.paymentAmount || (purchase.course?.price * purchase.quantity) || 0
    });
    
    this.quantityForm.patchValue({
      quantity: purchase.quantity
    });
    
    this.updateEnrollmentCounts();
  }

  updateStatus(): void {
    if (!this.selectedPurchase || !this.statusForm.valid) return;
    
    const url = `${environment.apiUrl}/admin/company-purchases/${this.selectedPurchase._id}/status`;
    const data = this.statusForm.value;
    
    // Special confirmation for paid status
    if (data.status === 'paid' && this.selectedPurchase.status !== 'paid') {
      const availableSeats = this.courseDateInfo?.availableSeats || 0;
      if (this.selectedPurchase.quantity > availableSeats) {
        alert(`¡Atención! Solo quedan ${availableSeats} asientos disponibles, pero se solicitan ${this.selectedPurchase.quantity}. No se puede proceder con el pago.`);
        return;
      }
      
      if (!confirm(`Al marcar como "Pagado", se reservarán ${this.selectedPurchase.quantity} asientos en el curso seleccionado. ¿Desea continuar?`)) {
        return;
      }
    }
    
    this.http.post(url, data).subscribe({
      next: (response: any) => {
        this.loadPurchases();
        this.selectedPurchase = response as CompanyPurchase;
        alert(`Estado actualizado correctamente a "${this.getStatusLabel(data.status)}"`);
        
        // Refresh course date info to show updated capacity
        if (data.status === 'paid') {
          this.loadCourseDateInfo(this.selectedPurchase);
        }
      },
      error: (err) => {
        alert('Error al actualizar el estado: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }

  recordPayment(): void {
    if (!this.selectedPurchase || !this.paymentForm.valid) return;
    
    const url = `${environment.apiUrl}/admin/company-purchases/${this.selectedPurchase._id}/payment`;
    const data = this.paymentForm.value;
    
    // Add confirmation since this will mark as paid and reserve seats
    if (!confirm(`Al registrar el pago, la solicitud se marcará como "Pagada" y se reservarán ${this.selectedPurchase.quantity} asientos en el curso seleccionado. ¿Desea continuar?`)) {
      return;
    }
    
    this.http.post(url, data)
      .subscribe({
        next: (response: any) => {
          this.loadPurchases();
          this.selectedPurchase = response as CompanyPurchase;
          alert('Pago registrado correctamente y asientos reservados');
        },
        error: (err) => {
          alert('Error al registrar el pago: ' + (err.message || 'Error desconocido'));
        }
      });
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString();
  }
  
  // Helper methods for status display
  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  }
  
  getStatusIndex(status: string): number {
    return this.statusOptions.findIndex(opt => opt.value === status);
  }

  // New methods for enhanced functionality
  private async loadCourseDateInfo(purchase: CompanyPurchase): Promise<void> {
    try {
      const courseDatesUrl = `${environment.apiUrl}/course-dates/course/${purchase.course._id || purchase.course}`;
      const courseDates = await this.http.get<any[]>(courseDatesUrl).toPromise();
      
      if (courseDates) {
        const selectedDate = new Date(purchase.selectedDate);
        const matchingDate = courseDates.find(cd => {
          const courseDate = new Date(cd.startDate);
          return courseDate.toDateString() === selectedDate.toDateString();
        });
        
        if (matchingDate) {
          this.courseDateInfo = {
            _id: matchingDate._id,
            startDate: matchingDate.startDate,
            capacity: matchingDate.capacity,
            enrolledCount: matchingDate.enrolledCount,
            availableSeats: matchingDate.capacity - matchingDate.enrolledCount
          };
        }
      }
    } catch (error) {
      console.error('Error loading course date info:', error);
    }
  }

  private async loadEnrollments(purchaseId: string): Promise<void> {
    this.enrollmentLoading = true;
    try {
      const url = `${environment.apiUrl}/admin/company-purchases/${purchaseId}/enrollments`;
      const enrollments = await this.http.get<any[]>(url).toPromise();
      
      if (enrollments) {
        this.enrollments = enrollments.map(e => ({
          _id: e._id,
          userName: e.user?.fullName || 'N/A',
          email: e.user?.email || 'N/A',
          status: e.status,
          createdAt: e.createdAt
        }));
      }
    } catch (error) {
      console.error('Error loading enrollments:', error);
      this.enrollments = [];
    } finally {
      this.enrollmentLoading = false;
      this.updateEnrollmentCounts();
    }
  }

  private updateEnrollmentCounts(): void {
    if (this.selectedPurchase) {
      this.enrolledCount = this.enrollments.length;
      this.availableSlots = this.selectedPurchase.quantity - this.enrolledCount;
    }
  }

  updateQuantity(): void {
    if (!this.selectedPurchase || !this.quantityForm.valid) return;
    
    const newQuantity = this.quantityForm.get('quantity')?.value;
    
    // Check if new quantity is less than current enrollments
    if (newQuantity < this.enrolledCount) {
      alert(`No se puede reducir la cantidad a ${newQuantity} porque ya hay ${this.enrolledCount} inscripciones creadas.`);
      this.quantityForm.patchValue({ quantity: this.selectedPurchase.quantity });
      return;
    }
    
    const url = `${environment.apiUrl}/admin/company-purchases/${this.selectedPurchase._id}`;
    const data = { quantity: newQuantity };
    
    this.http.patch(url, data).subscribe({
      next: (response: any) => {
        this.selectedPurchase = response;
        this.updateEnrollmentCounts();
        alert('Cantidad actualizada correctamente');
        this.loadPurchases();
      },
      error: (error) => {
        alert('Error al actualizar la cantidad: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'bg-warning',
      'contacted': 'bg-info',
      'payment_pending': 'bg-primary',
      'paid': 'bg-success',
      'completed': 'bg-success',
      'canceled': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
  }

  getStatusDescription(status: string): string {
    const descriptions: { [key: string]: string } = {
      'pending': 'La solicitud ha sido recibida y está pendiente de revisión.',
      'contacted': 'Se ha contactado a la empresa para coordinar el pago.',
      'payment_pending': 'La empresa está en proceso de realizar el pago.',
      'paid': 'El pago ha sido recibido y los asientos están reservados.',
      'completed': 'Todas las inscripciones han sido completadas.',
      'canceled': 'La solicitud ha sido cancelada.'
    };
    return descriptions[status] || 'Estado desconocido';
  }

  // Modal and enrollment management methods
  openEnrollmentModal(modal: any): void {
    // This would open a modal for creating new enrollments
    console.log('Opening enrollment modal', modal);
  }

  searchUsers(searchField: string): void {
    // This would search for existing users
    console.log('Searching users', searchField);
  }

  createEnrollment(): void {
    if (!this.enrollmentForm.valid || !this.selectedPurchase) return;
    
    const enrollmentData = {
      ...this.enrollmentForm.value,
      companyPurchaseId: this.selectedPurchase._id
    };
    
    console.log('Creating enrollment', enrollmentData);
    // Implementation would create the enrollment via API
  }

  cancelPurchase(purchaseId: string): void {
    if (!confirm('¿Está seguro de que desea cancelar esta solicitud?')) {
      return;
    }
    
    const reason = prompt('Ingrese el motivo de la cancelación:');
    if (!reason) return;
    
    const url = `${environment.apiUrl}/admin/company-purchases/${purchaseId}/cancel`;
    
    this.http.post(url, { reason }).subscribe({
      next: () => {
        alert('Solicitud cancelada correctamente');
        this.loadPurchases();
        this.selectedPurchase = null;
      },
      error: (error) => {
        alert('Error al cancelar la solicitud: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }
}