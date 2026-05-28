import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Caregiver } from '../../core/models/caregiver.model';
import { Session } from '../../core/models/session.model';
import { TemplateSession } from '../../core/models/template-session.model';
import { AppContext } from '../../core/models/app-context.model';
import { SessionFeedback } from '../../core/models/session-feedback.model';
import { AppService } from '../../core/services/app.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { DialogService } from '../../core/services/dialog.service';
import { RtSessionService } from '../../core/services/rt-session.service';
import { TemplateSessionService } from '../../core/services/template-session.service';

@Component({
  selector: 'app-independent-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './independent-home.component.html',
  styleUrls: ['./independent-home.component.css']
})
export class IndependentHomeComponent implements OnInit {

  public user!: Caregiver;
  public templateSessions!: TemplateSession[];
  public collectionSize: number = 0;
  public page = 1;
  public pageSize = 4;
  public maxSize = 3;
  private session!: Session;
  private appContext!: AppContext;

  constructor(
    private router: Router,
    private caregiverService: CaregiverService,
    private templateSessionService: TemplateSessionService,
    private rtSessionService: RtSessionService,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private appService: AppService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.caregiverService.getCurrentCaregiver()!;
    await this.retrieveTemplateSession();
    this.cdr.detectChanges();
  }

  async retrieveTemplateSession(): Promise<void> {
    this.templateSessions = await this.templateSessionService
      .getTemplateSessionList(this.authenticationService.getCurrentCaregiverToken()!, 'any', 'all', 'all');
    this.collectionSize = this.templateSessions.length;
  }

  async startSessionRT(templateSession: TemplateSession): Promise<void> {
    const sessionId = await this.templateSessionService.startSessionFromTemplateSession(
      this.authenticationService.getCurrentCaregiverToken()!,
      templateSession.id,
      ''
    );
    if (sessionId) {
      const sessionFeedback = new SessionFeedback('', '', '', new Date(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0);
      this.session = new Session(sessionId, templateSession.id, '', '', '', '', '', new Date(), new Date(), false, { hours: 0, minutes: 0 }, 0, 0, sessionFeedback);
      this.rtSessionService.resetCurrentSession();
      this.rtSessionService.setCurrentSession(this.session);
      this.router.navigate(['/caregiver/session/running']);
    }
  }

  async navigateToSessionRT(templateSession: TemplateSession): Promise<void> {
    const sessionFeedback = new SessionFeedback('', '', '', new Date(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0);
    this.session = new Session(templateSession.session_id, templateSession.id, '', '', '', '', '', new Date(), new Date(), false, { hours: 0, minutes: 0 }, 0, 0, sessionFeedback);
    this.rtSessionService.resetCurrentSession();
    this.rtSessionService.setCurrentSession(this.session);
    this.router.navigate(['/caregiver/session/running']);
  }

  async navigateToFeedback(templateSession: TemplateSession): Promise<void> {
    const sessionFeedback = new SessionFeedback('', '', '', new Date(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0);
    this.session = new Session(templateSession.session_id, templateSession.id, '', '', '', '', '', new Date(), new Date(), false, { hours: 0, minutes: 0 }, 0, 0, sessionFeedback);
    this.rtSessionService.resetCurrentSession();
    this.rtSessionService.setCurrentSession(this.session);
    this.rtSessionService.resetCurrentDuration();
    this.rtSessionService.setCurrentDuration(0);
    this.appService.resetPageStatus();
    this.appService.setPageStatus('finishFromList');
    this.router.navigate(['/caregiver/session/feedback']);
  }

  async manageSession(templateSession: TemplateSession): Promise<void> {
    this.appContext = new AppContext('caregiver/independent', templateSession.id, false, '', true);
    this.appService.resetAppContext();
    this.appService.setAppContext(this.appContext);
    this.templateSessionService.resetTemplateSession();
    this.templateSessionService.setTemplateSession(templateSession);
    this.router.navigate(['/caregiver/session/detail']);
  }

  async removeTemplateSession(templateSession: TemplateSession): Promise<void> {
    const response = await this.dialogService
      .askConfirmation('discardTemplateSessionConfirmation', 'discardTemplateSessionHelp')
      .catch(() => false);
    if (response) {
      if (await this.templateSessionService.removeTemplateSession(
        this.authenticationService.getCurrentCaregiverToken()!,
        templateSession.id,
        ''
      )) {
        await this.retrieveTemplateSession();
      }
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
}
