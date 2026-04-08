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
import { AddPatientObservationData } from '../../../core/models/add-patient-observation-data.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-add-patient-observation',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './add-patient-observation.component.html',
  styleUrls: ['./add-patient-observation.component.css']
})
export class AddPatientObservationComponent implements OnInit {
  public caregiver!: Caregiver;
  public patient!: Patient;
  public observation: string = '';
  public addError: boolean = false;
  public adding: boolean = false;

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
  }

  async addObservation(): Promise<void> {
    this.adding = true;
    this.addError = false;
    const token = this.authenticationService.getCurrentCaregiverToken()!;

    const observationData = new AddPatientObservationData(
      this.patient.id,
      this.caregiver.id,
      this.observation
    );

    const success = await this.patientService.addObservation(token, observationData);
    if (success) {
      this.router.navigate(['/caregiver/person/observations']);
    } else {
      this.addError = true;
    }
    this.adding = false;
  }

  cancel(): void {
    this.router.navigate(['/caregiver/person/observations']);
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }
}
