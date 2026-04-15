/**
 * @author André Santana - fc49451
 */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CaregiverService } from '../../core/services/caregiver.service';
import { Caregiver } from '../../core/models/caregiver.model';

@Component({
  selector: 'app-choose-share-patient',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './choose-share-patient.component.html',
  styleUrl: './choose-share-patient.component.css'
})
export class ChooseSharePatientComponent implements OnInit {
  private caregiverService = inject(CaregiverService);

  currentCaregiver!: Caregiver;

  ngOnInit(): void {
    this.currentCaregiver = this.caregiverService.getCurrentCaregiver()!;
  }
}
