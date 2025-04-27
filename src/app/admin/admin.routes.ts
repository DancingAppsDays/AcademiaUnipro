
// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminCourseDatesComponent } from './components/admin-course-dates/admin-course-dates.component';
import { AdminEnrollmentsComponent } from './components/admin-enrollments/admin-enrollments.component';
import { AdminCourseDetailsComponent } from './components/admin-course-details/admin-course-details.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { CompanyPurchaseDashboardComponent } from './components/company-purchase-dashboard/company-purchase-dashboard.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'course-dates', component: AdminCourseDatesComponent },
      { path: 'course-dates/:id', component: AdminCourseDetailsComponent },
      { path: 'enrollments', component: AdminEnrollmentsComponent },
      {path: 'company-purchase-dashboard', component: CompanyPurchaseDashboardComponent }, // Placeholder for company purchase dashboard
    ]
  }
];