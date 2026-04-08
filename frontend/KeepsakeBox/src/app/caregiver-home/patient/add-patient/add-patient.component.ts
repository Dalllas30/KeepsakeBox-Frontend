/**
 * @author André Santana - fc49451
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Caregiver } from '../../../core/models/caregiver.model';
import { BirthDate } from '../../../core/models/birth-date.model';
import { CaregiverPatientRegisterData } from '../../../core/models/caregiver-patient-register-data.model';
import { PatientRegisterData } from '../../../core/models/patient-register-data.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { BirthDateInputComponent } from '../../../shared/birth-date-input/birth-date-input.component';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, BirthDateInputComponent],
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {
  public caregiver!: Caregiver;
  public addError: boolean = false;
  public adding: boolean = false;

  // Form fields
  public name: string = '';
  public displayName: string = '';
  public education: string = '';
  public interests: string = '';
  public cities: string = '';
  public patientRelation: string = '';
  public birthDate: BirthDate = new BirthDate(0, -1, 0, true);

  constructor(
    private appService: AppService,
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
  }

  get isBirthDateValid(): boolean {
    return this.birthDate.day !== 0 &&
           this.birthDate.month !== -1 &&
           this.birthDate.year !== 0 &&
           this.birthDate.validDate;
  }

  async addPatient(): Promise<void> {
    this.adding = true;
    this.addError = false;
    const token = this.authenticationService.getCurrentCaregiverToken()!;

    const patientData = new PatientRegisterData(
      this.name,
      this.displayName,
      new Date(this.birthDate.year, this.birthDate.month, this.birthDate.day, 0, 0, 0, 0),
      this.education,
      '',
      this.interests,
      this.cities
    );

    const registerData = new CaregiverPatientRegisterData(patientData, this.patientRelation);
    const result = await this.caregiverService.addPatient(token, registerData);

    if (result) {
      this.router.navigate(['/caregiver/persons']);
    } else {
      this.addError = true;
    }
    this.adding = false;
  }

  cancel(): void {
    this.router.navigate(['/caregiver/persons']);
  }
}
