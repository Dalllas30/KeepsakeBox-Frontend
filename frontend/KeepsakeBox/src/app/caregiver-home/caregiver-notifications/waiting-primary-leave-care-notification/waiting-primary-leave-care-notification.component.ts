import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CaregiverNotification } from '../../../core/models/caregiver-notification.model';
import { AppService } from '../../../core/services/app.service';

@Component({
  selector: 'app-waiting-primary-leave-care-notification',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './waiting-primary-leave-care-notification.component.html',
  styleUrl: './waiting-primary-leave-care-notification.component.css',
})
export class WaitingPrimaryLeaveCareNotificationComponent implements OnInit {
  @Input() notification!: CaregiverNotification;

  private appService = inject(AppService);

  ngOnInit(): void {}

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }
}
