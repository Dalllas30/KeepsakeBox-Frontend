import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Time } from '@angular/common';

import { Patient } from '../../../core/models/patient.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { Session } from '../../../core/models/session.model';
import { TemplateSession } from '../../../core/models/template-session.model';
import { TemplateSessionData } from '../../../core/models/template-session-data.model';
import { AppContext } from '../../../core/models/app-context.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { DialogService } from '../../../core/services/dialog.service';
import { PatientService } from '../../../core/services/patient.service';
import { RtSessionService } from '../../../core/services/rt-session.service';
import { TemplateSessionService } from '../../../core/services/template-session.service';
import { SessionFeedback } from '../../../core/models/session-feedback.model';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap/tooltip';

@Component({
  selector: 'app-patient-session-startlist',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbPagination, NgbTooltipModule],
  templateUrl: './patient-session-startlist.component.html',
  styleUrls: ['./patient-session-startlist.component.css']
})
export class PatientSessionStartlistComponent implements OnInit {

  mytime!: Time;
  @Input() showFilter = false;
  @Input() Interrupted = true;
  @Input() ToStart = true;
  @Input() Favorite = false;
  @Input() Shared = true;
  @Input() page = 1;
  @Input() pageSize = 4;
  @Input() maxSize = 3;
  public collectionSize!: number;
  public templateSession!: TemplateSession;
  public templateSessions!: TemplateSession[];
  public templateSessionsCopy!: TemplateSession[];
  public templateSessionsOnGoing!: TemplateSession[];
  public templateSessionsToStart!: TemplateSession[];
  @Input() resumeScreen = true;
  @Input() CompleteListOnGoing = false;
  public patient!: Patient;
  public caregiver!: Caregiver;
  public session!: Session;
  public session1!: Session;
  public templateSessionData!: TemplateSessionData;
  public appContext!: AppContext;
  

  constructor(
    private router: Router,
    private patientService: PatientService,
    private caregiverService: CaregiverService,
    private templateSessionService: TemplateSessionService,
    private rtSessionService: RtSessionService,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private appService: AppService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.patient = this.patientService.getCurrentPatient()!;
    this.appContext = new AppContext("caregiver/person/rtSessionStartlist", "", true, this.patient.id, false);
    this.appService.resetAppContext();
    this.appService.setAppContext(this.appContext);
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    await this.retrieveTemplateSession();
    this.cdr.detectChanges();
  }

  async retrieveTemplateSession(): Promise<void> {
    if (this.Interrupted && this.ToStart) {
      this.templateSessions = await this.templateSessionService
        .getTemplateSessionList(this.authenticationService.getCurrentCaregiverToken()!, this.patient.id, "all", "all");
    } else if (this.Interrupted && !this.Shared) {
      this.templateSessions = await this.templateSessionService
        .getTemplateSessionList(this.authenticationService.getCurrentCaregiverToken()!, this.patient.id, "ongoing", "all");
    } else if (this.Interrupted && this.Shared) {
      this.templateSessions = await this.templateSessionService
        .getTemplateSessionList(this.authenticationService.getCurrentCaregiverToken()!, this.patient.id, "all", "all");
    } else if (this.ToStart || this.Shared) {
      this.templateSessions = await this.templateSessionService
        .getTemplateSessionList(this.authenticationService.getCurrentCaregiverToken()!, this.patient.id, "tostart", "all");
    } else {
      this.templateSessions = [];
    }
    if (!this.ToStart && this.Shared) {
      this.templateSessionsCopy = [];
      this.templateSessions.forEach(ts => {
        if (ts.isStarted || ts.caregiver_id != this.caregiver.id) this.templateSessionsCopy.push(ts);
      });
      this.templateSessions = this.templateSessionsCopy;
    }
    this.collectionSize = this.templateSessions.length;
  }

  async navigateToSessionRT(templateSession: TemplateSession): Promise<void> {
    this.session = new Session(templateSession.session_id, templateSession.id, "", "", "", "", "", new Date(), new Date(), false, { hours: 0, minutes: 0 }, 0, 0, null as unknown as SessionFeedback);
    this.rtSessionService.resetCurrentSession();
    this.rtSessionService.setCurrentSession(this.session);
    this.patient = await this.patientService
      .getPatientById(this.authenticationService.getCurrentCaregiverToken()!, templateSession.patient_id);
    this.router.navigate(['/caregiver/session/running']);
  }

  async navigateToFeedback(templateSession: TemplateSession): Promise<void> {
    this.session1 = new Session(templateSession.session_id, templateSession.id, "", "", "", "", "", new Date(), new Date(), false, { hours: 0, minutes: 0 }, 0, 0, null as unknown as SessionFeedback);
    this.rtSessionService.resetCurrentSession();
    this.rtSessionService.setCurrentSession(this.session1);
    this.rtSessionService.resetCurrentDuration();
    this.rtSessionService.setCurrentDuration(0);
    this.appService.resetPageStatus();
    this.appService.setPageStatus('finishFromList');
    this.router.navigate(['/caregiver/session/feedback']);
  }

  async startSessionRT(templateSession: TemplateSession): Promise<void> {
    let sessionId = null;
    if (sessionId = await this.templateSessionService
      .startSessionFromTemplateSession(this.authenticationService.getCurrentCaregiverToken()!, templateSession.id, this.patient.id)) {
      this.session = new Session(sessionId, templateSession.id, "", "", "", "", "", new Date(), new Date(), false, { hours: 0, minutes: 0 }, 0, 0, null as unknown as SessionFeedback);
      this.rtSessionService.resetCurrentSession();
      this.rtSessionService.setCurrentSession(this.session);
      this.router.navigate(['/caregiver/session/running']);
    }
  }

  async createAutomaticTemplateSession(): Promise<void> {
    this.appService.resetSelectedCategories();
    this.router.navigate(['/caregiver/session/create/sessionAutomatic']);
  }

  async createManualTemplateSession(): Promise<void> {
    this.appService.resetSelectedCategories();
    this.router.navigate(['/caregiver/session/create/sessionCategories']);
  }

  openPwdScreen(): void {
    window.open('/session/view', '_blank');
  }

  async removeTemplateSession(templateSession: TemplateSession, patientId: string) {
    var response = await this.dialogService.askConfirmation('discardTemplateSessionConfirmation', 'discardTemplateSessionHelp')
      .catch(err => false);
    if (response) {
      if (await this.templateSessionService.removeTemplateSession(
        this.authenticationService.getCurrentCaregiverToken()!, templateSession.id, patientId)) {
        await this.retrieveTemplateSession();
      }
    }
  }

  async manageSession(templateSession: TemplateSession) {
    if (templateSession.caregiver_id == this.caregiver.id) {
      this.appContext = new AppContext("caregiver/person/rtSessionStartlist", templateSession.id, true, this.patient.id, true);
    } else {
      this.appContext = new AppContext("caregiver/person/rtSessionStartlist", templateSession.id, true, this.patient.id, false);
    }
    this.appService.resetAppContext();
    this.appService.setAppContext(this.appContext);
    this.templateSessionService.resetTemplateSession();
    this.templateSessionService.setTemplateSession(templateSession);
    this.router.navigate(['/caregiver/session/detail']);
  }
}