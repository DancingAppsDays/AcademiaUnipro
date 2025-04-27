// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { CourseDetailComponent } from './component/coursedetails/coursedetails.component';
import { LoginComponent } from './component/login/login.component';
import { CourseListComponent } from './component/course-list/course-list.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { CheckoutSuccessComponent } from './component/checkout-sucess/checkout-sucess.component';
import { CompanySuccessComponent } from './component/company-success/company-success.component';
import { QuickCheckoutComponent } from './component/quick-checkout/quick-checkout.component';
import { RedesignedHomeComponent } from './component/redesigned-home/redesigned-home.component';
import { DashboardComponent } from './component/user/dashboard/dashboard.component';
import { UserCoursesComponent } from './component/user/user-courses/user-courses.component';

// Guards
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: RedesignedHomeComponent,
    title: 'Academia Uniprotec - Capacitación Industrial',
    data: { animation: 'HomePage' }
  },
  {
    path: 'home',
    component: RedesignedHomeComponent,
    title: 'Academia Uniprotec - Capacitación Industrial',
    data: { animation: 'HomePage' }
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar Sesión',
    data: { animation: 'LoginPage' }
  },
  {
    path: 'register',
    component: LoginComponent, // Use the login component with register view
    title: 'Crear Cuenta',
    data: { animation: 'RegisterPage' }
  },
  {
    path: 'courses',
    component: CourseListComponent,
    title: 'Cursos Disponibles',
    data: { animation: 'CoursesPage' }
  },
  {
    path: 'courses/:category',
    component: CourseListComponent,
    title: 'Cursos por Categoría',
    data: { animation: 'CategoryPage' }
  },
  {
    path: 'course/:id',
    component: CourseDetailComponent,
    title: 'Detalles del Curso',
    data: { animation: 'CourseDetailPage' }
  },
  {
    path: 'checkout/success',
    component: CheckoutSuccessComponent,
    title: 'Compra Exitosa',
    data: { animation: 'SuccessPage' }
  },
  {
    path: 'checkout/company-success',
    component: CompanySuccessComponent,
    title: 'Solicitud Recibida',
    data: { animation: 'CompanySuccessPage' }
  },
  {
    path: 'checkout/:courseId',
    component: CheckoutComponent,
    title: 'Checkout',
    data: { animation: 'CheckoutPage' }
  },
  {
    path: 'quick-checkout/:courseId',
    component: QuickCheckoutComponent,
    title: 'Proceso de Compra Rápido',
    data: { animation: 'QuickCheckoutPage' }
  },
  
  // User Dashboard Routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    title: 'Mi Dashboard',
    data: { animation: 'DashboardPage' }
  },
  {
    path: 'dashboard/courses',
    component: UserCoursesComponent,
    canActivate: [AuthGuard],
    title: 'Mis Cursos',
    data: { animation: 'UserCoursesPage' }
  },
  {
    path: 'dashboard/profile',
    component: DashboardComponent, // Replace with actual profile component when created
    canActivate: [AuthGuard],
    title: 'Mi Perfil',
    data: { animation: 'ProfilePage' }
  },
  {
    path: 'dashboard/certificates',
    component: DashboardComponent, // Replace with actual certificates component when created
    canActivate: [AuthGuard],
    title: 'Mis Certificados',
    data: { animation: 'CertificatesPage' }
  },
  
  // Other routes
  { path: '**', redirectTo: '', pathMatch: 'full' }
];