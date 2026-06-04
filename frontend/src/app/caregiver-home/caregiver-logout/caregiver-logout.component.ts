import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { PatientService } from '../../core/services/patient.service';
import { CancelScreenComponent } from '../../shared/cancel-screen/cancel-screen.component';

@Component({
  selector: 'app-caregiver-logout',
  standalone: true,
  imports: [CommonModule, TranslateModule, CancelScreenComponent],
  templateUrl: './caregiver-logout.component.html',
  styleUrls: ['./caregiver-logout.component.css']
})
export class CaregiverLogoutComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private patientService: PatientService,
    private router: Router
  ) {}

  navigateToPatients() {
    this.router.navigate(['/caregiver/persons']);
  }

  logout() {
    this.authenticationService.logout();
    this.patientService.resetCurrentPatient();
    this.caregiverService.resetCurrentCaregiver();
    this.authenticationService.resetCurrentCaregiverToken();
    this.router.navigate(['/login']);
  }
}