import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { TestcompComponent } from './component/testcomp/testcomp.component';
import { CourseDetailComponent } from './component/coursedetails/coursedetails.component';

export const routes: Routes = [
   
    { path: 'home', component:HomeComponent },
    {path: 'coursedetails', component:CourseDetailComponent },
    {path: 'test', component:TestcompComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'}
  
];