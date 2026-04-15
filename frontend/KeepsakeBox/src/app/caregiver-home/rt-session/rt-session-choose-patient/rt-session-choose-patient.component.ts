import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AppContext } from '../../../core/models/app-context.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { TemplateSessionService } from '../../../core/services/template-session.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
  selector: 'app-rt-session-choose-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbPaginationModule],
  templateUrl: './rt-session-choose-patient.component.html',
  styleUrls: ['./rt-session-choose-patient.component.css']
})
export class RtSessionChoosePatientComponent implements OnInit {

  public appContext!: AppContext;
  public caregiver!: Caregiver;
  @Input() patientId: string = "";
  public pList: Patient[] = [];
  public pListCopy!: Patient[];
  @Input() page = 1;
  @Input() pageSize = 3;
  @Input() maxSize = 3;
  public collectionSize!: number;

  constructor(
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private templateSessionService: TemplateSessionService,
    private router: Router,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getSelectedCaregiver()!;
    this.retrieveTemplateSessionPatients();
  }

  async retrieveTemplateSessionPatients(): Promise<void> {
    this.appContext = this.appService.getAppContext()!;
    this.pList = await this.templateSessionService
      .getCaregiverPatientsByTemplateSessionId(
        this.authenticationService.getCurrentCaregiverToken()!, this.caregiver.id, this.appContext.templateSessionId);
    this.pListCopy = this.pList;
    this.collectionSize = this.pList.length;
  }

  async retrievePatients(): Promise<void> {
    this.appContext = this.appService.getAppContext()!;
    this.pList = await this.caregiverService.getCaregiverPatientsByCaregiverId(
      this.authenticationService.getCurrentCaregiverToken()!, this.caregiver.id, this.appContext.patientId);
    this.pListCopy = this.pList;
    this.collectionSize = this.pList.length;
  }

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  searchPatientByName(event: Event) {
    this.pList = this.pListCopy;
    const filterValue = (event.target as HTMLInputElement).value;
    this.pList = this.pList.filter(
      patient =>
        patient.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        patient.displayName.toLowerCase().includes(filterValue.toLowerCase())
    );
    this.collectionSize = this.pList.length;
  }

  backToImageSelection() {
    this.router.navigate(['/caregiver/session/detail']);
  }

  async saveAlocateSession(): Promise<void> {
    var patientList: string[] = [];
    this.pList.forEach(patient => {
      if (patient.isActive) {
        patientList.push(patient.id);
      }
    });
    if (await this.templateSessionService.updateCaregiverPatientsByTemplateSessionId(
      this.authenticationService.getCurrentCaregiverToken()!, this.appContext.templateSessionId, patientList)) {
      this.router.navigate([this.appContext.routingBack]);
    }
  }
}