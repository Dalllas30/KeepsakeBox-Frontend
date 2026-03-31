import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  //{ path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
 // { path: 'home', loadComponent: () => import('./caregiver-home/caregiver-home.component').then(m => m.CaregiverHomeComponent), canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
