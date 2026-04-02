import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CaregiverHomeComponent } from './caregiver-home/caregiver-home.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // {
  //   path: 'caregiver',
  //   component: CaregiverHomeComponent,
  //   children: [
  //     { path: 'persons', loadComponent: () => import('./caregiver-home/caregiver-patients/caregiver-patients.component').then(m => m.CaregiverPatientsComponent) },
  //     { path: 'notifications', loadComponent: () => import('./caregiver-home/caregiver-notifications/caregiver-notifications.component').then(m => m.CaregiverNotificationsComponent) },
  //     { path: 'logout', loadComponent: () => import('./caregiver-home/caregiver-logout/caregiver-logout.component').then(m => m.CaregiverLogoutComponent) },
  //     { path: 'help', loadComponent: () => import('./caregiver-home/caregiver-help/caregiver-help.component').then(m => m.CaregiverHelpComponent) },
  //     { path: 'profile/info', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-profile.component').then(m => m.CaregiverProfileComponent) },
  //     { path: 'profile/update', loadComponent: () => import('./caregiver-home/caregiver-update-profile/caregiver-update-profile.component').then(m => m.CaregiverUpdateProfileComponent) },
  //     { path: 'profile/password', loadComponent: () => import('./caregiver-home/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
  //     { path: 'persons/add', loadComponent: () => import('./caregiver-home/add-patient/add-patient.component').then(m => m.AddPatientComponent) },
  //   ]
  // },
  { path: '**', redirectTo: 'login' }
];