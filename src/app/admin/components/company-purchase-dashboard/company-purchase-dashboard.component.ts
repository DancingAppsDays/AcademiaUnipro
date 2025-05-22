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

@Component({
  selector: 'app-company-purchase-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="company-dashboard-container">
      <div class="dashboard-header">
        <h2>Gestión de Compras Empresariales</h2>
        
        <div class="status-filter">
          <label for="statusFilter">Filtrar por Estado:</label>
          <select id="statusFilter" [(ngModel)]="selectedStatus" (change)="onStatusChange($event)" class="form-control">
            <option value="all">Todos los estados</option>
            <option *ngFor="let option of statusOptions" [value]="option.value">{{ option.label }}</option>
          </select>
        </div>
      </div>

      <!-- Loading indicator -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando solicitudes de compra empresarial...</p>
      </div>

      <!-- Error message -->
      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div *ngIf="!loading && !error" class="dashboard-content">
        <div class="row">
          <!-- Purchase list column -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-header">
                <h3>Solicitudes de Compra</h3>
              </div>
              <div class="card-body">
                <div *ngIf="purchases.length === 0" class="no-records">
                  No se encontraron solicitudes de compra empresarial.
                </div>
                
                <div *ngIf="purchases.length > 0" class="purchase-list">
                  <div *ngFor="let purchase of purchases" 
                       class="purchase-item" 
                       [class.active]="selectedPurchase?._id === purchase._id"
                       (click)="selectPurchase(purchase)">
                    <div class="purchase-header">
                      <h4>{{ purchase.companyName }}</h4>
                      <span class="badge" [ngClass]="{
                        'bg-warning': purchase.status === 'pending',
                        'bg-info': purchase.status === 'contacted' || purchase.status === 'payment_pending',
                        'bg-success': purchase.status === 'paid' || purchase.status === 'completed',
                        'bg-danger': purchase.status === 'canceled'
                      }">{{ purchase.status }}</span>
                    </div>
                    <div class="purchase-details">
                      <p><strong>ID:</strong> {{ purchase.requestId }}</p>
                      <p><strong>Curso:</strong> {{ purchase.courseTitle }}</p>
                      <p><strong>Fecha:</strong> {{ formatDate(purchase.selectedDate).split(' ')[0] }}</p>
                      <p><strong>Cantidad:</strong> {{ purchase.quantity }}</p>
                      <p class="text-muted">{{ formatDate(purchase.createdAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Details column -->
          <div class="col-md-8">
            <div *ngIf="!selectedPurchase" class="no-selection">
              <p>Seleccione una solicitud de compra para ver los detalles</p>
            </div>
            
            <div *ngIf="selectedPurchase" class="purchase-details-container">
              <!-- Purchase details card -->
              <div class="card mb-4">
                <div class="card-header">
                  <h3>Detalles de la Solicitud</h3>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <h4>Información de la Empresa</h4>
                      <p><strong>Nombre:</strong> {{ selectedPurchase.companyName }}</p>
                      <p><strong>RFC:</strong> {{ selectedPurchase.rfc }}</p>
                      <p><strong>Contacto:</strong> {{ selectedPurchase.contactName }}</p>
                      <p><strong>Email:</strong> {{ selectedPurchase.contactEmail }}</p>
                      <p><strong>Teléfono:</strong> {{ selectedPurchase.contactPhone }}</p>
                    </div>
                    <div class="col-md-6">
                      <h4>Información del Curso</h4>
                      <p><strong>Curso:</strong> {{ selectedPurchase.courseTitle }}</p>
                      <p><strong>Fecha:</strong> {{ formatDate(selectedPurchase.selectedDate) }}</p>
                      <p><strong>Cantidad:</strong> {{ selectedPurchase.quantity }}</p>
                      <p><strong>Estado:</strong> {{ selectedPurchase.status }}</p>
                      <p><strong>ID de Solicitud:</strong> {{ selectedPurchase.requestId }}</p>
                      
                      <div *ngIf="selectedPurchase.status === 'paid' || selectedPurchase.status === 'completed'" 
                           class="alert alert-success mt-2">
                        <i class="bi bi-check-circle me-2"></i>
                        <strong>Asientos reservados:</strong> Se han reservado {{ selectedPurchase.quantity }} 
                        asientos en la fecha del curso seleccionada.
                      </div>
                    </div>
                  </div>
                  
                  <div *ngIf="selectedPurchase.additionalInfo" class="mt-3">
                    <h4>Información Adicional</h4>
                    <p>{{ selectedPurchase.additionalInfo }}</p>
                  </div>
                  
                  <div *ngIf="selectedPurchase.adminNotes" class="mt-3">
                    <h4>Notas del Administrador</h4>
                    <p>{{ selectedPurchase.adminNotes }}</p>
                  </div>
                  
                  <div *ngIf="selectedPurchase.paymentMethod" class="mt-3">
                    <h4>Información de Pago</h4>
                    <p><strong>Método:</strong> {{ selectedPurchase.paymentMethod }}</p>
                    <p><strong>Referencia:</strong> {{ selectedPurchase.paymentReference }}</p>
                    <p><strong>Monto:</strong> {{ selectedPurchase.paymentAmount | currency:'MXN':'symbol':'1.0-2' }}</p>
                    <p><strong>Fecha:</strong> {{ formatDate(selectedPurchase.paymentDate ? formatDate(selectedPurchase.paymentDate) : 'N/A' ) }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Action Cards -->
              <div class="row">
                <!-- Status update form -->
                <div class="col-md-6 mb-4">
                  <div class="card">
                    <div class="card-header">
                      <h3>Actualizar Estado</h3>
                    </div>
                    <div class="card-body">
                      <form [formGroup]="statusForm" (ngSubmit)="updateStatus()">
                        <div class="mb-3">
                          <label for="status" class="form-label">Estado</label>
                          <select formControlName="status" id="status" class="form-control">
                            <option *ngFor="let option of statusOptions" [value]="option.value">{{ option.label }}</option>
                          </select>
                          
                          <div class="alert alert-info mt-2">
                            <p class="mb-0"><strong>Importante:</strong> Al marcar como "Pagado", los asientos se reservarán 
                              automáticamente en el curso, reduciendo la capacidad disponible.</p>
                          </div>
                        </div>
                        
                        <div class="mb-3">
                          <label for="notes" class="form-label">Notas</label>
                          <textarea formControlName="notes" id="notes" class="form-control" rows="3"></textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100" [disabled]="statusForm.invalid">
                          Actualizar Estado
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                
                <!-- Payment record form -->
                <div class="col-md-6 mb-4">
                  <div class="card">
                    <div class="card-header">
                      <h3>Registrar Pago</h3>
                    </div>
                    <div class="card-body">
                      <form [formGroup]="paymentForm" (ngSubmit)="recordPayment()">
                        <div class="mb-3">
                          <label for="paymentMethod" class="form-label">Método de Pago</label>
                          <select formControlName="paymentMethod" id="paymentMethod" class="form-control">
                            <option value="">Seleccionar método</option>
                            <option value="bank_transfer">Transferencia Bancaria</option>
                            <option value="credit_card">Tarjeta de Crédito</option>
                            <option value="cash">Efectivo</option>
                            <option value="check">Cheque</option>
                          </select>
                        </div>
                        
                        <div class="mb-3">
                          <label for="paymentReference" class="form-label">Referencia</label>
                          <input type="text" formControlName="paymentReference" id="paymentReference" class="form-control">
                        </div>
                        
                        <div class="mb-3">
                          <label for="paymentAmount" class="form-label">Monto</label>
                          <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" formControlName="paymentAmount" id="paymentAmount" class="form-control" step="0.01" min="0">
                          </div>
                        </div>
                        
                        <button type="submit" class="btn btn-success w-100" 
                                [disabled]="paymentForm.invalid || selectedPurchase?.status === 'paid' || selectedPurchase?.status === 'completed'">
                          Registrar Pago
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
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
    
    // Fill in the forms with current values
    this.statusForm.patchValue({
      status: purchase.status,
      notes: ''
    });
    
    this.paymentForm.reset({
      paymentMethod: purchase.paymentMethod || '',
      paymentReference: purchase.paymentReference || '',
      paymentAmount: purchase.paymentAmount || purchase.course?.price * purchase.quantity || 0
    });
  }

  updateStatus(): void {
    if (!this.selectedPurchase || !this.statusForm.valid) return;
    
    const url = `${environment.apiUrl}/admin/company-purchases/${this.selectedPurchase._id}/status`;
    const data = this.statusForm.value;
    
    // Display confirmation if changing to a less advanced status
    const currentStatusIndex = this.getStatusIndex(this.selectedPurchase.status);
    const newStatusIndex = this.getStatusIndex(data.status);
    
    if (newStatusIndex < currentStatusIndex) {
      if (!confirm(`¿Está seguro de cambiar el estado de "${this.getStatusLabel(this.selectedPurchase.status)}" a "${this.getStatusLabel(data.status)}"? Esta acción puede afectar la reserva de asientos.`)) {
        return;
      }
    }
    
    // Special confirmation for paid status
    if (data.status === 'paid' && this.selectedPurchase.status !== 'paid') {
      if (!confirm(`Al marcar como "Pagado", se reservarán ${this.selectedPurchase.quantity} asientos en el curso seleccionado. ¿Desea continuar?`)) {
        return;
      }
    }
    
    this.http.post(url, data)
      .subscribe({
        next: (response: any) => {
          this.loadPurchases();
          // Update the selected purchase with the new data
          this.selectedPurchase = response as CompanyPurchase;
          alert(`Estado actualizado correctamente a "${this.getStatusLabel(data.status)}"`);
        },
        error: (err) => {
          alert('Error al actualizar el estado: ' + (err.message || 'Error desconocido'));
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
}