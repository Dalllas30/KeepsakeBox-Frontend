/**
 * @author André Santana - fc49451
 */

/* TODO: migrate ValidationService to return Observables:
         ValidationService.createUploadRequest still uses .toPromise()
         update confirm() to subscribe */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { PatientService } from '../../core/services/patient.service';
import { AppService } from '../../core/services/app.service';
import { ValidationService } from '../../core/services/validation.service';
import { Request } from '../../core/models/image.model';

@Component({
  selector: 'app-generate-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './generate-request.component.html',
  styleUrl: './generate-request.component.css'
})
export class GenerateRequestComponent implements OnInit {
  private authenticationService = inject(AuthenticationService);
  private caregiverService      = inject(CaregiverService);
  private patientService        = inject(PatientService);
  private appService            = inject(AppService);
  private validationService     = inject(ValidationService);

  translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';

  selectedDuration = '';
  options: { name: string; value: number }[] = [];

  generatedDate  = '';
  lockedDuration = '';
  confirmed      = false;
  copiedLink     = false;
  id             = '';

  ngOnInit(): void {
    if (this.translateCache === 'pt') {
      this.selectedDuration = '1 dia';
      this.options = [
        { name: '1 dia',    value: 1 },
        { name: '1 semana', value: 2 },
        { name: '1 mês',    value: 3 },
        { name: '3 meses',  value: 4 },
      ];
    } else {
      this.selectedDuration = '1 day';
      this.options = [
        { name: '1 day',    value: 1 },
        { name: '1 week',   value: 2 },
        { name: '1 month',  value: 3 },
        { name: '3 months', value: 4 },
      ];
    }
  }

  async confirm(): Promise<void> {
    const option = this.options.find(o => o.name === this.selectedDuration);
    if (!option) return;

    const date = this.generateDate(option.value);
    this.generatedDate  = this.formatDate(date);
    this.lockedDuration = this.selectedDuration;
    this.confirmed      = true;
    this.copiedLink     = false;

    const targetID = this.isRouteActive('caregiver/person/images/method/generate-request')
      ? this.patientService.getCurrentPatient()!.id
      : this.caregiverService.getCurrentCaregiver()!.id;

    const requestData: Request = {
      id:             '',
      expirationDate: this.generatedDate,
      caregiverID:    this.caregiverService.getCurrentCaregiver()!.id,
      targetID,
    };

    this.id = await this.validationService.createUploadRequest(
      this.authenticationService.getCurrentCaregiverToken()!, requestData) ?? '';
  }

  formatDate(date: Date): string {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
  }

  generateDate(value: number): Date {
    const today = new Date();
    switch (value) {
      case 1:  return new Date(today.getFullYear(), today.getMonth(),     today.getDate() + 1);
      case 2:  return new Date(today.getFullYear(), today.getMonth(),     today.getDate() + 7);
      case 3:  return new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      case 4:  return new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
      default: return new Date(today.getFullYear(), today.getMonth(),     today.getDate() + 1);
    }
  }

  copyLinkToClipboard(): void {
    const input = document.getElementById('fname') as HTMLInputElement;
    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
    this.copiedLink = true;
  }

  isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }
}
