import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AppContext } from '../../../core/models/app-context.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { PatientCaregiver } from '../../../core/models/patient-caregiver.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';
import { TemplateSessionService } from '../../../core/services/template-session.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
  selector: 'app-rt-session-choose-caregiver',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbPaginationModule],
  templateUrl: './rt-session-choose-caregiver.component.html',
  styleUrls: ['./rt-session-choose-caregiver.component.css']
})
export class RtSessionChooseCaregiverComponent implements OnInit {

  public appContext!: AppContext;
  public currentCaregiver!: Caregiver;
  public currentPatient!: Patient;
  public patientCaregivers!: PatientCaregiver[];
  public patientCaregiversCopy!: PatientCaregiver[];
  @Input() page = 1;
  @Input() pageSize = 3;
  @Input() maxSize = 3;
  public collectionSize!: number;

  constructor(
    private authenticationService: AuthenticationService,
    private appService: AppService,
    private router: Router,
    private templateSessionService: TemplateSessionService,
    private caregiverService: CaregiverService,
    private patientService: PatientService
  ) {}

  async ngOnInit(): Promise<void> {
    this.appContext = this.appService.getAppContext()!;
    this.currentCaregiver = this.caregiverService.getCurrentCaregiver()!;
    console.log("templatesessionId:" + this.appContext.templateSessionId);
    if (this.appContext.patientId) {
      this.patientCaregivers = await this.templateSessionService
        .getCaregiversByTemplateSessionId(
          this.authenticationService.getCurrentCaregiverToken()!, this.appContext.templateSessionId, this.appContext.patientId);
    } else {
      this.patientCaregivers = await this.templateSessionService
        .getCaregiversByTemplateSessionId(
          this.authenticationService.getCurrentCaregiverToken()!, this.appContext.templateSessionId, "any");
    }
    this.collectionSize = this.patientCaregivers.length;
    this.patientCaregiversCopy = this.patientCaregivers;
  }

  searchCaregiverByName(event: Event) {
    this.patientCaregivers = this.patientCaregiversCopy;
    const filterValue = (event.target as HTMLInputElement).value;
    this.patientCaregivers = this.patientCaregivers.filter(
      patient_caregiver =>
        patient_caregiver.caregiver.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        this.caregiverDisplayName(patient_caregiver.caregiver.name.toLowerCase(), "").includes(filterValue.toLowerCase())
    );
    this.collectionSize = this.patientCaregivers.length;
  }

  caregiverDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  goToPatientList(caregiver: Caregiver) {
    this.caregiverService.resetSelectedCaregiver();
    this.caregiverService.setSelectedCaregiver(caregiver);
    this.router.navigate(['caregiver/session/share/patient']);
  }

  selectCaregiver(caregiver: Caregiver) {}

  backToImageSelection() {
    this.router.navigate(['/caregiver/session/detail']);
  }

  async saveShareSession(): Promise<void> {
    var caregiverList: string[] = [];
    this.patientCaregivers.forEach(patientCaregiver => {
      if (patientCaregiver.caregiver.isActive) {
        caregiverList.push(patientCaregiver.caregiver.id);
      }
    });
    if (await this.templateSessionService.updateCaregiversByTemplateSessionId(
      this.authenticationService.getCurrentCaregiverToken()!, this.appContext.templateSessionId, caregiverList)) {
      this.router.navigate([this.appContext.routingBack]);
    }
  }
}