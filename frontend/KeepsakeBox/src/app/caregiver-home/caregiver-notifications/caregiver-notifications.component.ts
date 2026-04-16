import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CaregiverNotification } from '../../core/models/caregiver-notification.model';
import { Caregiver } from '../../core/models/caregiver.model';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { NotificationService } from '../../core/services/notification.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-caregiver-notifications',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule],
  templateUrl: './caregiver-notifications.component.html',
  styleUrls: ['./caregiver-notifications.component.css']
})
export class CaregiverNotificationsComponent implements OnInit {
  @Input() page = 1;
  @Input() pageSize = 3;
  @Input() maxSize = 3;

  public collectionSize!: number;
  public currentCaregiver!: Caregiver;
  public notifications!: CaregiverNotification[];

  constructor(
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService
  ) {}

  ngOnInit(): void {
    this.currentCaregiver = this.caregiverService.getCurrentCaregiver()!;
    this.retrieveCaregiverNotifications();
  }

  async retrieveCaregiverNotifications(): Promise<void> {
    this.notifications = await this.notificationService
      .getCaregiverNotifications(this.authenticationService.getCurrentCaregiverToken()!);
    this.notifications = this.notifications.filter(n => {
      const isSender = n.sender.email == this.currentCaregiver.email;
      const selfTypes = [
        'ACCEPTED_SHARE_PATIENT', 'DENIED_SHARE_PATIENT', 'REMOVED_FROM_PATIENT',
        'ACCEPTED_PRIMARY_CARE', 'DENIED_PRIMARY_CARE',
        'ACCEPTED_PRIMARY_LEAVE_CARE', 'DENIED_PRIMARY_LEAVE_CARE'
      ];
      return !(isSender && selfTypes.includes(n.messageType));
    });
    this.collectionSize = this.notifications.length;
  }
}