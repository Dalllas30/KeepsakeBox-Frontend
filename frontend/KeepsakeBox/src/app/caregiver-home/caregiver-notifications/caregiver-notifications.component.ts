/**
 * @author André Santana - fc49451
 */

import { Component, OnInit, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CaregiverNotification } from '../../core/models/caregiver-notification.model';
import { Caregiver } from '../../core/models/caregiver.model';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { NotificationService, RENDERABLE_NOTIFICATION_TYPES } from '../../core/services/notification.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { WaitingShareNotificationComponent } from './waiting-share-notification/waiting-share-notification.component';
import { SharePatientNotificationComponent } from './share-patient-notification/share-patient-notification.component';
import { AcceptedSharePatientNotificationComponent } from './accepted-share-patient-notification/accepted-share-patient-notification.component';
import { DeniedSharePatientNotificationComponent } from './denied-share-patient-notification/denied-share-patient-notification.component';
import { WaitingPrimaryCareTransferNotificationComponent } from './waiting-primary-care-transfer-notification/waiting-primary-care-transfer-notification.component';
import { PrimaryCareTransferNotificationComponent } from './primary-care-transfer-notification/primary-care-transfer-notification.component';
import { AcceptedPrimaryCareNotificationComponent } from './accepted-primary-care-notification/accepted-primary-care-notification.component';
import { DeniedPrimaryCareNotificationComponent } from './denied-primary-care-notification/denied-primary-care-notification.component';
import { RemovedFromPatientNotificationComponent } from './removed-from-patient-notification/removed-from-patient-notification.component';
import { WaitingPrimaryLeaveCareNotificationComponent } from './waiting-primary-leave-care-notification/waiting-primary-leave-care-notification.component';
import { PrimaryLeaveCareNotificationComponent } from './primary-leave-care-notitification/primary-leave-care-notitification.component';
import { AcceptedPrimaryLeaveCareNotificationComponent } from './accepted-primary-leave-care-notification/accepted-primary-leave-care-notification.component';
import { DeniedPrimaryLeaveCareNotificationComponent } from './denied-primary-leave-care-notification/denied-primary-leave-care-notification.component';

@Component({
  selector: 'app-caregiver-notifications',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbPaginationModule,
    WaitingShareNotificationComponent,
    SharePatientNotificationComponent,
    AcceptedSharePatientNotificationComponent,
    DeniedSharePatientNotificationComponent,
    WaitingPrimaryCareTransferNotificationComponent,
    PrimaryCareTransferNotificationComponent,
    AcceptedPrimaryCareNotificationComponent,
    DeniedPrimaryCareNotificationComponent,
    RemovedFromPatientNotificationComponent,
    WaitingPrimaryLeaveCareNotificationComponent,
    PrimaryLeaveCareNotificationComponent,
    AcceptedPrimaryLeaveCareNotificationComponent,
    DeniedPrimaryLeaveCareNotificationComponent
  ],
  templateUrl: './caregiver-notifications.component.html',
  styleUrls: ['./caregiver-notifications.component.css']
})
export class CaregiverNotificationsComponent implements OnInit {
  @Input() page = 1;
  @Input() pageSize = 3;
  @Input() maxSize = 3;

  public collectionSize: number = 0;
  public currentCaregiver!: Caregiver;
  public notifications: CaregiverNotification[] = [];

  private notificationService = inject(NotificationService);
  private authenticationService = inject(AuthenticationService);
  private caregiverService = inject(CaregiverService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.currentCaregiver = this.caregiverService.getCurrentCaregiver()!;
    this.retrieveCaregiverNotifications();
  }

  async retrieveCaregiverNotifications(): Promise<void> {
    this.notifications = await this.notificationService
      .getCaregiverNotifications(this.authenticationService.getCurrentCaregiverToken()!);
    this.notifications = this.notifications.filter(n => {
      // Drop any type that has no rendered component — this silences
      // response notifications whose type names don't match the template
      // (e.g. ACCEPT_SHARE created by the service vs ACCEPTED_SHARE_PATIENT in the template).
      if (!RENDERABLE_NOTIFICATION_TYPES.has(n.messageType)) return false;

      // Hide self-generated "accepted/denied" confirmations the current caregiver
      // sent — they only need to be seen by the other party.
      const isSender = n.sender.email == this.currentCaregiver.email;
      const selfTypes = [
        'ACCEPTED_SHARE_PATIENT', 'DENIED_SHARE_PATIENT', 'REMOVED_FROM_PATIENT',
        'ACCEPTED_PRIMARY_CARE', 'DENIED_PRIMARY_CARE',
        'ACCEPTED_PRIMARY_LEAVE_CARE', 'DENIED_PRIMARY_LEAVE_CARE'
      ];
      return !(isSender && selfTypes.includes(n.messageType));
    });
    this.collectionSize = this.notifications.length;
    this.cdr.detectChanges();
  }
}