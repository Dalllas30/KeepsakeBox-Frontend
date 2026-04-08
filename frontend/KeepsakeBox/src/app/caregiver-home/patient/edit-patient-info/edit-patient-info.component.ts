/**
 * @author André Santana - fc49451
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Patient } from '../../../core/models/patient.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-edit-patient-info',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './edit-patient-info.component.html',
  styleUrls: ['./edit-patient-info.component.css']
})
export class EditPatientInfoComponent implements OnInit {
  public caregiver!: Caregiver;
  public patient!: Patient;
  public updatedPatient!: Patient;
  public updateError: boolean = false;
  public updating: boolean = false;

  constructor(
    private appService: AppService,
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patient = this.patientService.getCurrentPatient()!;
    // Clone to avoid mutating the cached object before saving
    this.updatedPatient = { ...this.patient };
  }

  async updatePatient(): Promise<void> {
    this.updating = true;
    this.updateError = false;
    const token = this.authenticationService.getCurrentCaregiverToken()!;
    const success = await this.patientService.updatePatient(token, this.updatedPatient);
    if (success) {
      this.patientService.setCurrentPatient(this.updatedPatient);
      this.router.navigate(['/caregiver/person/info']);
    } else {
      this.updateError = true;
    }
    this.updating = false;
  }

  cancel(): void {
    this.router.navigate(['/caregiver/person/info']);
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }
}
