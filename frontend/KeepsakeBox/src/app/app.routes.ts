import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CaregiverHomeComponent } from './caregiver-home/caregiver-home.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'upload', loadComponent: () => import('./outside-user-image-upload/outside-user-image-upload.component').then(m => m.OutsideUserImageUploadComponent) },
  {
    path: 'caregiver',
    component: CaregiverHomeComponent,
    canActivate: [roleGuard],
    data: { roles: ['caregiver', 'independent'] },
    children: [

      // --- Persons / Patients ---
      { path: 'persons', loadComponent: () => import('./caregiver-home/caregiver-patients/caregiver-patients.component').then(m => m.CaregiverPatientsComponent) },
      { path: 'persons/add', loadComponent: () => import('./caregiver-home/patient/add-patient/add-patient.component').then(m => m.AddPatientComponent) },

      // --- Person (patient subpages) ---
      {
        path: 'person',
        loadComponent: () => import('./caregiver-home/patient/patient.component').then(m => m.PatientComponent),
        children: [
          { path: 'info', loadComponent: () => import('./caregiver-home/patient/patient-info/patient-info.component').then(m => m.PatientInfoComponent) },
          { path: 'caregiver', loadComponent: () => import('./caregiver-home/patient/patient-caregiver/patient-caregiver.component').then(m => m.PatientCaregiverComponent) },
          { path: 'caregiver/remove', loadComponent: () => import('./caregiver-home/patient/patient-remove-caregiver/patient-remove-caregiver.component').then(m => m.PatientRemoveCaregiverComponent) },
          { path: 'observations', loadComponent: () => import('./caregiver-home/patient/patient-observations/patient-observations.component').then(m => m.PatientObservationsComponent) },
          { path: 'observations/add', loadComponent: () => import('./caregiver-home/patient/add-patient-observation/add-patient-observation.component').then(m => m.AddPatientObservationComponent) },
          { path: 'observations/update', loadComponent: () => import('./caregiver-home/patient/update-patient-observation/update-patient-observation.component').then(m => m.UpdatePatientObservationComponent) },
          { path: 'observations/delete', loadComponent: () => import('./caregiver-home/patient/delete-patient-observation/delete-patient-observation.component').then(m => m.DeletePatientObservationComponent) },
          { path: 'messages', loadComponent: () => import('./caregiver-home/patient/patient-messages/patient-messages.component').then(m => m.PatientMessagesComponent) },
          { path: 'images', loadComponent: () => import('./caregiver-home/patient/patient-images/patient-images.component').then(m => m.PatientImagesComponent) },
          { path: 'image', loadComponent: () => import('./caregiver-home/patient/patient-image/patient-image.component').then(m => m.PatientImageComponent) },
          { path: 'image/update', loadComponent: () => import('./caregiver-home/update-image/update-image.component').then(m => m.UpdateImageComponent) },
          { path: 'image/delete', loadComponent: () => import('./caregiver-home/delete-image/delete-image.component').then(m => m.DeleteImageComponent) },
          { path: 'images/add', loadComponent: () => import('./caregiver-home/add-image/add-image.component').then(m => m.AddImageComponent) },
          { path: 'images/method', loadComponent: () => import('./caregiver-home/patient/patient-images/patient-image-add-selection/patient-image-add-selection.component').then(m => m.PatientImageAddSelectionComponent) },
          { path: 'images/method/online-search', loadComponent: () => import('./caregiver-home/online-search/online-search.component').then(m => m.OnlineSearchComponent) },
          { path: 'images/method/generate-request', loadComponent: () => import('./caregiver-home/generate-request/generate-request.component').then(m => m.GenerateRequestComponent) },
          { path: 'sessions', loadComponent: () => import('./caregiver-home/patient/patient-sessions/patient-sessions.component').then(m => m.PatientSessionsComponent) },
          { path: 'sessions/summary', loadComponent: () => import('./caregiver-home/patient/patient-sessions/patient-session-summary/patient-session-summary.component').then(m => m.PatientSessionSummaryComponent) },
          { path: 'sessions/summary/images', loadComponent: () => import('./caregiver-home/patient/patient-sessions/patient-session-summary/patient-session-images/patient-session-images.component').then(m => m.PatientSessionImagesComponent) },
          { path: 'rtSessionStartlist', loadComponent: () => import('./caregiver-home/patient/patient-session-startlist/patient-session-startlist.component').then(m => m.PatientSessionStartlistComponent) },
          { path: 'statistics', loadComponent: () => import('./caregiver-home/patient/patient-statistics/patient-statistics.component').then(m => m.PatientStatisticsComponent) },
          { path: 'info/update', loadComponent: () => import('./caregiver-home/patient/edit-patient-info/edit-patient-info.component').then(m => m.EditPatientInfoComponent) },
          { path: 'share', loadComponent: () => import('./caregiver-home/choose-share-patient/choose-share-patient.component').then(m => m.ChooseSharePatientComponent) },
          { path: 'share/only', loadComponent: () => import('./caregiver-home/only-share-patient/only-share-patient.component').then(m => m.OnlySharePatientComponent) },
          { path: 'share/principal', loadComponent: () => import('./caregiver-home/principal-share-patient/principal-share-patient.component').then(m => m.PrincipalSharePatientComponent) },
          { path: 'leave', loadComponent: () => import('./caregiver-home/leave-patient-care/leave-patient-care.component').then(m => m.LeavePatientCareComponent) },
          { path: 'primary/leave', loadComponent: () => import('./caregiver-home/leave-patient-primary-care/leave-patient-primary-care.component').then(m => m.LeavePatientPrimaryCareComponent) },
        ]
      },

      // --- Profile ---
      {
        path: 'profile',
        loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-profile.component').then(m => m.CaregiverProfileComponent),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'info' },
          { path: 'info', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-info/caregiver-info.component').then(m => m.CaregiverInfoComponent) },
          { path: 'images', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-images/caregiver-images.component').then(m => m.CaregiverImagesComponent) },
          { path: 'image', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-image/caregiver-image.component').then(m => m.CaregiverImageComponent) },
          { path: 'image/update', loadComponent: () => import('./caregiver-home/update-image/update-image.component').then(m => m.UpdateImageComponent) },
          { path: 'image/delete', loadComponent: () => import('./caregiver-home/delete-image/delete-image.component').then(m => m.DeleteImageComponent) },
          { path: 'images/add', loadComponent: () => import('./caregiver-home/add-image/add-image.component').then(m => m.AddImageComponent) },
          { path: 'images/method', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-images/caregiver-image-add-selection/caregiver-image-add-selection.component').then(m => m.CaregiverImageAddSelectionComponent) },
          { path: 'session', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-session/caregiver-session.component').then(m => m.CaregiverSessionComponent) },
          { path: 'history', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-sessions-history/caregiver-sessions-history.component').then(m => m.CaregiverSessionsHistoryComponent) },
          { path: 'history/summary', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-sessions-history/caregiver-session-summary/caregiver-session-summary.component').then(m => m.CaregiverSessionSummaryComponent) },
          { path: 'history/summary/images', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-sessions-history/caregiver-session-summary/caregiver-session-images/caregiver-session-images.component').then(m => m.CaregiverSessionImagesComponent) },
          { path: 'statistics', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-statistics/caregiver-statistics.component').then(m => m.CaregiverStatisticsComponent) },
          { path: 'update', loadComponent: () => import('./caregiver-home/caregiver-update-profile/caregiver-update-profile.component').then(m => m.CaregiverUpdateProfileComponent) },
          { path: 'password', loadComponent: () => import('./caregiver-home/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
          { path: 'validation', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-validation/caregiver-validation.component').then(m => m.CaregiverValidationComponent) },
          { path: 'validation/images', loadComponent: () => import('./caregiver-home/caregiver-profile/caregiver-validation/caregiver-validation-images/caregiver-validation-images.component').then(m => m.CaregiverValidationImagesComponent) },
          { path: 'validation/discard', loadComponent: () => import('./shared/cancel-screen/cancel-screen.component').then(m => m.CancelScreenComponent) },
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
      { path: 'help/profile', loadComponent: () => import('./caregiver-home/caregiver-help/profile-help/profile-help.component').then(m => m.ProfileHelpComponent) },
    ]
  },

  {
    path: 'independent',
    redirectTo: 'caregiver/persons',
    pathMatch: 'full'
  },

  { path: '**', redirectTo: 'login' }
];