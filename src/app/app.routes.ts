import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { TestcompComponent } from './component/testcomp/testcomp.component';
import { CourseDetailComponent } from './component/coursedetails/coursedetails.component';
import { LoginComponent } from './component/login/login.component';
import { CourseListComponent } from './component/course-list/course-list.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { CheckoutSuccessComponent } from './component/checkout-sucess/checkout-sucess.component';
import { CompanySuccessComponent } from './component/company-success/company-success.component';
import { QuickCheckoutComponent } from './component/quick-checkout/quick-checkout.component';
import { RedesignedHomeComponent } from './component/homere/homere.component';

// Guards
//import { AuthGuard } from './guards/auth.guard';




export const routes: Routes = [
  {
    path: '',
    component: RedesignedHomeComponent,//HomeComponent,
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


  /*
   { 
     path: 'dashboard', 
     component: UserDashboardComponent,
     canActivate: [AuthGuard],
     title: 'Mi Panel',
     data: { animation: 'DashboardPage' }
   },*/
  { path: '**', redirectTo: '', pathMatch: 'full' }
];