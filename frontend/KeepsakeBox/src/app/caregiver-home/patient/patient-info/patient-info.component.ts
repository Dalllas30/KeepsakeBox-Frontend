import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Caregiver } from '../../../core/models/caregiver.model';
import { PatientCaregiver } from '../../../core/models/patient-caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPagination, RouterLink],
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit {

  @Input() page = 1;
  @Input() pageSize = 3;
  @Input() maxSize = 3;
  public collectionSize!: number;
  public patient!: Patient;
  public currentCaregiver!: PatientCaregiver;
  public patientCaregivers!: PatientCaregiver[];
  cities!: string[];
  interests!: string[];

  constructor(
    private router: Router,
    private appService: AppService,
    private patientService: PatientService,
    private caregiverService: CaregiverService,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.patient = await this.patientService.getCurrentPatient()!;
    this.cities = this.patient?.cities?.split(", ");
    this.interests = this.patient?.interests?.split(", ");
    this.currentCaregiver = new PatientCaregiver(
      new Caregiver("", "", "", "", null, "", "", "", true), false, ""
    );
    await this.retrievePatientCaregivers();
    await this.getReferenceTocaregiver();
    if (!this.currentCaregiver.isPrimary) {
      this.getReferenceToPrimaryCaregiver();
    }
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async retrievePatientCaregivers(): Promise<void> {
    this.patientCaregivers = await this.patientService
      .getPatientCaregivers(this.authenticationService.getCurrentCaregiverToken()!, this.patient.id);
    this.collectionSize = this.patientCaregivers.length;
  }

  async getReferenceTocaregiver() {
    let caregiverSaved = await this.caregiverService.getCurrentCaregiver();
    this.patientCaregivers.forEach((care, index) => {
      if (care.caregiver.email == caregiverSaved!.email)
        this.currentCaregiver = this.patientCaregivers.splice(index, 1)[0];
    });
    this.patientCaregivers.reverse().push(this.currentCaregiver);
    this.patientCaregivers.reverse();
  }

  async getReferenceToPrimaryCaregiver() {
    let primaryCaregiver: PatientCaregiver | null = null;
    this.patientCaregivers.forEach((care, index) => {
      if (care.isPrimary)
        primaryCaregiver = this.patientCaregivers.splice(index, 1)[0];
    });
    this.patientCaregivers.reverse().push(primaryCaregiver!);
    this.patientCaregivers.reverse();
  }

  goToPatientCaregiverDetails(caregiverToView: PatientCaregiver) {
    this.router.navigateByUrl('/caregiver/person/caregiver', {
      state: { caregiver: caregiverToView, isPrimary: this.currentCaregiver.isPrimary }
    });
  }

  goToLeftPatientCare(caregiver: PatientCaregiver) {
    if (caregiver.isPrimary) {
      this.router.navigateByUrl('/caregiver/person/primary/leave');
    } else {
      this.router.navigateByUrl('/caregiver/person/leave');
    }
  }

  goToPatientCaregiverRemove(caregiver: PatientCaregiver) {
    this.router.navigateByUrl('/caregiver/person/caregiver/remove', {
      state: { caregiver: caregiver }
    });
  }

  async navigateToSessionRT(patientId: String): Promise<void> {
    this.patient = await this.patientService
      .getPatientById(this.authenticationService.getCurrentCaregiverToken()!, patientId);
    this.router.navigate(['/caregiver/person/rtSessionStartlist']);
  }
}