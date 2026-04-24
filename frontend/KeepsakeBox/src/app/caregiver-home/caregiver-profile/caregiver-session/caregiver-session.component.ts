import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Time } from '@angular/common';
import { Patient } from '../../../core/models/patient.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { Session } from '../../../core/models/session.model';
import { SessionFeedback } from '../../../core/models/session-feedback.model';
import { TemplateSession } from '../../../core/models/template-session.model';
import { TemplateSessionData } from '../../../core/models/template-session-data.model';
import { AppContext } from '../../../core/models/app-context.model';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { PatientService } from '../../../core/services/patient.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { RtSessionService } from '../../../core/services/rt-session.service';
import { TemplateSessionService } from '../../../core/services/template-session.service';
import { AppService } from '../../../core/services/app.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
//import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-caregiver-session',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './caregiver-session.component.html',
  styleUrls: ['./caregiver-session.component.css']
})
export class CaregiverSessionComponent implements OnInit {
  mytime!: Time;

  @Input() showFilter = false;
  @Input() Interrupted = false;
  @Input() ToStart = true;
  @Input() Favorite = false;
  @Input() Shared = true;
  @Input() page = 1;
  @Input() pageSize = 4;
  @Input() maxSize = 3;
  @Input() resumeScreen = true;
  @Input() CompleteListOnGoing = false;

  public collectionSize!: number;
  public templateSession!: TemplateSession;
  public templateSessions!: TemplateSession[];
  public templateSessionsOnGoing!: TemplateSession[];
  public templateSessionsToStart!: TemplateSession[];
  public patient!: Patient;
  public caregiver!: Caregiver;
  public session!: Session;
  public session1!: Session;
  public sessionFeedback!: SessionFeedback;
  public templateSessionData!: TemplateSessionData;
  public appContext!: AppContext;

  constructor(
    private router: Router,
    private patientService: PatientService,
    private caregiverService: CaregiverService,
    private templateSessionService: TemplateSessionService,
    private rtSessionService: RtSessionService,
    private authenticationService: AuthenticationService,
    // private dialogService: DialogService,
    private appService: AppService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.appContext = new AppContext("caregiver/profile/session", "", false, "", false);
    this.appService.resetAppContext();
    this.appService.setAppContext(this.appContext);
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.sessionFeedback = new SessionFeedback("", "", "", new Date(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "", 0);
    await this.retrieveTemplateSession();
    this.cdr.detectChanges();
  }

  async retrieveTemplateSession(): Promise<void> {
    var filters: string = "";
    if (this.ToStart) filters = "tostart";
    if (this.Shared) {
      if (filters.length > 0) filters = filters + ":";
      filters = filters + "shared";
    }
    if (filters.length > 0) {
      this.templateSessions = await this.templateSessionService
        .getTemplateSessionList(this.authenticationService.getCurrentCaregiverToken()!, "any", filters, "all");
    } else {
      this.templateSessions = [];
    }
    this.collectionSize = this.templateSessions.length;
  }

  async navigateToSessionRT(templateSession: TemplateSession): Promise<void> {
    this.session = new Session(templateSession.session_id, templateSession.id, "", "", "", "", "", new Date(), new Date(), false, { hours: 0, minutes: 0 }, 0, 0, this.sessionFeedback);
    this.rtSessionService.resetCurrentSession();
    this.rtSessionService.setCurrentSession(this.session);
    this.patient = await this.patientService.getPatientById(this.authenticationService.getCurrentCaregiverToken()!, templateSession.patient_id);
    this.router.navigate(['/caregiver/session/running']);
  }

  async navigateToFeedback(templateSession: TemplateSession): Promise<void> {
    this.session1 = new Session(templateSession.session_id, templateSession.id, "", "", "", "", "", new Date(), new Date(), false, { hours: 0, minutes: 0 }, 0, 0, this.sessionFeedback);
    this.rtSessionService.resetCurrentSession();
    this.rtSessionService.setCurrentSession(this.session1);
    this.rtSessionService.resetCurrentDuration();
    this.rtSessionService.setCurrentDuration(0);
    this.appService.resetPageStatus();
    this.appService.setPageStatus('finishFromList');
    this.router.navigate(['/caregiver/session/feedback']);
  }

  async startSessionRT(templateSession: TemplateSession): Promise<void> {

    const response = await this.templateSessionService.startSessionFromTemplateSession(
      this.authenticationService.getCurrentCaregiverToken()!,
      templateSession.id,
      templateSession.patient_id
    );

    if (response) {

      const sessionId = response;

      this.session = new Session(
        sessionId,
        templateSession.id,
        "", "", "", "", "",
        new Date(), // ou ajusta conforme precisares
        new Date(),
        false,
        { hours: 0, minutes: 0 },
        0,
        0,
        this.sessionFeedback
      );

      this.rtSessionService.resetCurrentSession();
      this.rtSessionService.setCurrentSession(this.session);
      this.router.navigate(['/caregiver/session/running']);
    }
  }

  async createAutomaticTemplateSession(): Promise<void> {
    this.appService.resetSelectedCategories();
    this.patientService.resetCurrentPatient();
    this.router.navigate(['/caregiver/session/create/sessionAutomatic']);
  }

  async createManualTemplateSession(): Promise<void> {
    this.appService.resetSelectedCategories();
    this.patientService.resetCurrentPatient();
    this.router.navigate(['/caregiver/session/create/sessionCategories']);
  }

  async removeTemplateSession(templateSession: TemplateSession, patientId: string) {
    // var response = await this.dialogService.askConfirmation('discardTemplateSessionConfirmation', 'discardTemplateSessionHelp').catch(err => false);
    // if (response) {
    //   if (await this.templateSessionService.removeTemplateSession(
    //     this.authenticationService.getCurrentCaregiverToken()!, templateSession.id, patientId)) {
    //     await this.retrieveTemplateSession();
    //   }
    // }
  }

  async manageSession(templateSession: TemplateSession) {
    if (templateSession.caregiver_id == this.caregiver.id) {
      this.appContext = new AppContext("caregiver/profile/session", templateSession.id, false, templateSession.patient_id, true);
    } else {
      this.appContext = new AppContext("caregiver/profile/session", templateSession.id, false, templateSession.patient_id, false);
    }
    this.appService.resetAppContext();
    this.appService.setAppContext(this.appContext);
    this.templateSessionService.resetTemplateSession();
    this.templateSessionService.setTemplateSession(templateSession);
    this.router.navigate(['/caregiver/session/detail']);
  }

  isCurrentCaregiver(templateSession: TemplateSession): boolean {
    return templateSession.caregiver_id == this.caregiver.id;
  }
}