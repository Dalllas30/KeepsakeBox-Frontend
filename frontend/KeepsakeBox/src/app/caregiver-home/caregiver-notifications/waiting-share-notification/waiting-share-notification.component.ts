/**
 * @author André Santana - fc49451
 */

import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CaregiverNotification } from '../../../core/models/caregiver-notification.model';
import { AppService } from '../../../core/services/app.service';

@Component({
  selector: 'app-waiting-share-notification',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './waiting-share-notification.component.html',
  styleUrl: './waiting-share-notification.component.css',
})
export class WaitingShareNotificationComponent implements OnInit {
  @Input() notification!: CaregiverNotification;

  private appService = inject(AppService);

  ngOnInit(): void {}

  convertPatientDisplayName(displayName: string, name: string): string {
    return this.appService.convertPatientDisplayName(displayName, name);
  }
}
