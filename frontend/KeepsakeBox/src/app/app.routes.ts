import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CaregiverHomeComponent } from './caregiver-home/caregiver-home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'caregiver',
    component: CaregiverHomeComponent,
    children: [
      { path: 'persons', loadComponent: () => import('./caregiver-home/caregiver-patients/caregiver-patients.component').then(m => m.CaregiverPatientsComponent) },
      { path: 'notifications', loadComponent: () => import('./caregiver-home/caregiver-notifications/caregiver-notifications.component').then(m => m.CaregiverNotificationsComponent) },
      { path: 'logout', loadComponent: () => import('./caregiver-home/caregiver-logout/caregiver-logout.component').then(m => m.CaregiverLogoutComponent) },
      { path: 'help', loadComponent: () => import('./caregiver-home/caregiver-help/caregiver-help.component').then(m => m.CaregiverHelpComponent) },
      {
        path: 'profile',
        loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-profile.component').then(m => m.CaregiverProfileComponent),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'info' },
          { path: 'images', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-images/caregiver-images.component').then(m => m.CaregiverImagesComponent) },
          { path: 'image', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-image/caregiver-image.component').then(m => m.CaregiverImageComponent) },
          { path: 'info', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-info/caregiver-info.component').then(m => m.CaregiverInfoComponent) },
          { path: 'session', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-session/caregiver-session.component').then(m => m.CaregiverSessionComponent) },
          { path: 'history', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-sessions-history/caregiver-sessions-history.component').then(m => m.CaregiverSessionsHistoryComponent) },
          { path: 'statistics', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-statistics/caregiver-statistics.component').then(m => m.CaregiverStatisticsComponent) },
          { path: 'update', loadComponent: () => import('./caregiver-home/caregiver-update-profile/caregiver-update-profile.component').then(m => m.CaregiverUpdateProfileComponent) },
          { path: 'password', loadComponent: () => import('./caregiver-home/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
          { path: 'validation/images', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-validation/caregiver-validation-images/caregiver-validation-images.component').then(m => m.CaregiverValidationImagesComponent) },
          { path: 'validation', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-validation/caregiver-validation.component').then(m => m.CaregiverValidationComponent) },
        ]
      },
      { path: 'person/info', loadComponent: () => import('./caregiver-home/patient/patient.component').then(m => m.PatientComponent) },
      { path: 'person/info/update', loadComponent: () => import('./caregiver-home/patient/edit-patient-info/edit-patient-info.component').then(m => m.EditPatientInfoComponent) },
      //{ path: 'persons/add', loadComponent: () => import('./caregiver-home/patient/add-patient/add-patient.component').then(m => m.AddPatientComponent) },
      { path: 'person/observations/add', loadComponent: () => import('./caregiver-home/patient/add-patient-observation/add-patient-observation.component').then(m => m.AddPatientObservationComponent) },
      { path: 'person/observations/update', loadComponent: () => import('./caregiver-home/patient/update-patient-observation/update-patient-observation.component').then(m => m.UpdatePatientObservationComponent) },
      //{ path: 'person/observations/delete', loadComponent: () => import('./caregiver-home/patient/delete-patient-observation/delete-patient-observation.component').then(m => m.DeletePatientObservationComponent) },
    ]
  },
   //{ path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
   // { path: 'home', loadComponent: () => import('./caregiver-home/caregiver-home.component').then(m => m.CaregiverHomeComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];