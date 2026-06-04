import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Caregiver } from '../../core/models/caregiver.model';
import { AppService } from '../../core/services/app.service';
import { CaregiverService } from '../../core/services/caregiver.service';

@Component({
  selector: 'app-cancel-screen',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './cancel-screen.component.html',
  styleUrl: './cancel-screen.component.css'
})
export class CancelScreenComponent {
  private appService = inject(AppService);
  private caregiverService = inject(CaregiverService);

  translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';

  @Output() answeredNo  = new EventEmitter<void>();
  @Output() answeredYes = new EventEmitter<void>();

  caregiver: Caregiver | null = this.caregiverService.getCurrentCaregiver();

  isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }

  clickedNo():  void { this.answeredNo.emit(); }
  clickedYes(): void { this.answeredYes.emit(); }
}