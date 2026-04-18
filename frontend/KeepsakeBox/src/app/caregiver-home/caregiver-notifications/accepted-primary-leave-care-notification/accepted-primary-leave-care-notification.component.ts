import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CaregiverNotification } from '../../../core/models/caregiver-notification.model';
import { AppService } from '../../../core/services/app.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-accepted-primary-leave-care-notification',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './accepted-primary-leave-care-notification.component.html',
  styleUrl: './accepted-primary-leave-care-notification.component.css',
})
export class AcceptedPrimaryLeaveCareNotificationComponent implements OnInit {
  @Input() notification!: CaregiverNotification;
  @Output() notificationsChanged: EventEmitter<boolean> = new EventEmitter();

  private appService = inject(AppService);
  private authenticationService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {}

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }

  async deleteNotification() {
    if (await this.notificationService.deleteNotification(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.notification.id
    )) {
      this.notificationsChanged.emit();
    }
  }
}
