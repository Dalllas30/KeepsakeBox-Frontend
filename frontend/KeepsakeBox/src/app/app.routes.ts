import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CaregiverHomeComponent } from './caregiver-home/caregiver-home.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'caregiver',
    component: CaregiverHomeComponent,
    children: [
      // --- Persons / Patients ---
      { path: 'persons', loadComponent: () => import('./caregiver-home/caregiver-patients/caregiver-patients.component').then(m => m.CaregiverPatientsComponent) },
      { path: 'person/info', loadComponent: () => import('./caregiver-home/patient/patient.component').then(m => m.PatientComponent) },
      { path: 'person/info/update', loadComponent: () => import('./caregiver-home/patient/edit-patient-info/edit-patient-info.component').then(m => m.EditPatientInfoComponent) },
      { path: 'person/observations/add', loadComponent: () => import('./caregiver-home/patient/add-patient-observation/add-patient-observation.component').then(m => m.AddPatientObservationComponent) },
      { path: 'person/observations/update', loadComponent: () => import('./caregiver-home/patient/update-patient-observation/update-patient-observation.component').then(m => m.UpdatePatientObservationComponent) },

      // --- Profile ---
      {
        path: 'profile',
        loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-profile.component').then(m => m.CaregiverProfileComponent),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'info' },
          { path: 'info', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-info/caregiver-info.component').then(m => m.CaregiverInfoComponent) },
          { path: 'images', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-images/caregiver-images.component').then(m => m.CaregiverImagesComponent) },
          { path: 'image', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-image/caregiver-image.component').then(m => m.CaregiverImageComponent) },
          { path: 'session', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-session/caregiver-session.component').then(m => m.CaregiverSessionComponent) },
          { path: 'history', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-sessions-history/caregiver-sessions-history.component').then(m => m.CaregiverSessionsHistoryComponent) },
          { path: 'statistics', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-statistics/caregiver-statistics.component').then(m => m.CaregiverStatisticsComponent) },
          { path: 'update', loadComponent: () => import('./caregiver-home/caregiver-update-profile/caregiver-update-profile.component').then(m => m.CaregiverUpdateProfileComponent) },
          { path: 'password', loadComponent: () => import('./caregiver-home/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
          { path: 'validation', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-validation/caregiver-validation.component').then(m => m.CaregiverValidationComponent) },
          { path: 'validation/images', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-validation/caregiver-validation-images/caregiver-validation-images.component').then(m => m.CaregiverValidationImagesComponent) },
        ]
      },

      // --- Session (rt-session) ---
      {
        path: 'session',
        loadComponent: () => import('./caregiver-home/rt-session/rt-session.component').then(m => m.RtSessionComponent),
        children: [
          { path: 'running', loadComponent: () => import('./caregiver-home/rt-session/rt-session-running/rt-session-running.component').then(m => m.RtSessionRunningComponent) },
          { path: 'feedback', loadComponent: () => import('./caregiver-home/rt-session/rt-session-feedback/rt-session-feedback.component').then(m => m.RtSessionFeedbackComponent) },
          { path: 'create/sessionCategories', loadComponent: () => import('./caregiver-home/rt-session/create-session-categories/create-session-categories.component').then(m => m.CreateSessionCategoriesComponent) },
          { path: 'create/sessionAutomatic', loadComponent: () => import('./caregiver-home/rt-session/create-session-automatic/create-session-automatic.component').then(m => m.CreateSessionAutomaticComponent) },
          { path: 'create/sessionImages', loadComponent: () => import('./caregiver-home/rt-session/create-session-images/create-session-images.component').then(m => m.CreateSessionImagesComponent) },
          { path: 'preview', loadComponent: () => import('./caregiver-home/rt-session/preview-session/preview-session.component').then(m => m.PreviewSessionComponent) },
          { path: 'share/caregiver', loadComponent: () => import('./caregiver-home/rt-session/rt-session-choose-caregiver/rt-session-choose-caregiver.component').then(m => m.RtSessionChooseCaregiverComponent) },
          { path: 'share/patient', loadComponent: () => import('./caregiver-home/rt-session/rt-session-choose-patient/rt-session-choose-patient.component').then(m => m.RtSessionChoosePatientComponent) },
          { path: 'detail', loadComponent: () => import('./caregiver-home/rt-session/rt-session-detail/rt-session-detail.component').then(m => m.RtSessionDetailComponent) },
          { path: 'previewImage', loadComponent: () => import('./caregiver-home/rt-session/rt-session-preview-image/rt-session-preview-image.component').then(m => m.RtSessionPreviewImageComponent) },
        ]
      },

      // --- Outros ---
      { path: 'notifications', loadComponent: () => import('./caregiver-home/caregiver-notifications/caregiver-notifications.component').then(m => m.CaregiverNotificationsComponent) },
      { path: 'logout', loadComponent: () => import('./caregiver-home/caregiver-logout/caregiver-logout.component').then(m => m.CaregiverLogoutComponent) },
      { path: 'help', loadComponent: () => import('./caregiver-home/caregiver-help/caregiver-help.component').then(m => m.CaregiverHelpComponent) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];