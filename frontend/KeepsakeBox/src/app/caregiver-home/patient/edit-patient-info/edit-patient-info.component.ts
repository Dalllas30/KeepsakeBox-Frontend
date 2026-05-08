import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { Patient } from '../../../core/models/patient.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { BirthDate } from '../../../core/models/birth-date.model';
import { ProfileImage } from '../../../core/models/profile-image.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';
import { ProfileImageComponent } from '../../../shared/profile-image/profile-image.component';
import { BirthDateInputComponent } from '../../../shared/birth-date-input/birth-date-input.component';
import { CancelScreenComponent } from '../../../shared/cancel-screen/cancel-screen.component';

@Component({
  selector: 'app-edit-patient-info',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule,
            ProfileImageComponent, BirthDateInputComponent, CancelScreenComponent],
  templateUrl: './edit-patient-info.component.html',
  styleUrls: ['./edit-patient-info.component.css']
})
export class EditPatientInfoComponent implements OnInit {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';

  public educationsPT = [
    "Ensino Primário / 1º Ciclo do Ensino Básico",
    "Ciclo Preparatório / 2º Ciclo do Ensino Básico",
    "Ensino Secundário Geral / 3º Ciclo do Ensino Básico",
    "Ensino Secundário Complementar / Ensino Secundário",
    "Ensino Superior"
  ];

  public educationsENG = [
    "Primary School / Elementary School",
    "Preparatory Cicle / 2nd Cycle of Basic Education",
    "General Secondary Education / 3rd Cycle of Basic Education",
    "Complementary High School / Secondary Education",
    "Higher Education"
  ];

  public hideCancel: boolean = true;
  public hideEditPatient: boolean = false;

  public caregiver!: Caregiver;
  public patient!: Patient;
  public profileImage!: ProfileImage;
  public birthDate!: BirthDate;

  public updated: boolean = true;
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
    this.patient = { ...this.patientService.getCurrentPatient()! };

    const datePart  = (this.caregiver.birthDate ?? '').toString().split('T')[0]; // "YYYY-MM-DD"
    const dateParts = datePart.split('-').map(Number);                                  // [YYYY, MM, DD]
    const year  = dateParts[0] || 2000;
    const month = dateParts[1] ? dateParts[1] - 1 : 0; // BirthDate expects 0-indexed month
    const day   = dateParts[2] || 1;
    const dateValues = this.patient.birthDate.toString().split("-").map(Number);
    this.birthDate    = new BirthDate(day, month, year, true);
    this.profileImage = new ProfileImage(this.patient.profileImageURL);
  }

  showCancel() {
    this.hideCancel = false;
    this.hideEditPatient = true;
  }

  showEditPatient() {
    this.hideCancel = true;
    this.hideEditPatient = false;
  }

  navigateToPatientInfo() {
    this.router.navigate(['/caregiver/person/info']);
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async updatePatient(): Promise<void> {
    this.updating = true;
    this.patient.profileImageURL = this.profileImage.imageURL;
    this.patient.birthDate = new Date(
      this.birthDate.year, this.birthDate.month, this.birthDate.day, 0, 0, 0, 0
    );

    const token = this.authenticationService.getCurrentCaregiverToken()!;
    if (await this.patientService.updatePatient(token, this.patient)) {
      this.patientService.setCurrentPatient(
        await this.patientService.getPatientById(token, this.patient.id)
      );
      this.router.navigate([
        this.patientService.getCurrentPatient() == null
          ? '/caregiver/persons'
          : '/caregiver/person/info'
      ]);
    } else {
      this.updated = false;
      this.updating = false;
    }
  }
}