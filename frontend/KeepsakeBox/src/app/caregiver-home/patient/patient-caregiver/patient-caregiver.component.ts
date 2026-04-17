import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Caregiver } from '../../../core/models/caregiver.model';
import { PatientCaregiver } from '../../../core/models/patient-caregiver.model';
import { AppService } from '../../../core/services/app.service';
import { CaregiverService } from '../../../core/services/caregiver.service';

@Component({
  selector: 'app-patient-caregiver',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './patient-caregiver.component.html',
  styleUrls: ['./patient-caregiver.component.css']
})
export class PatientCaregiverComponent implements OnInit {

  public currentCaregiver!: PatientCaregiver;
  public loggedCaregiver!: Caregiver;
  public isPrimaryCaregiver: boolean = false;

  constructor(
    private appService: AppService,
    private caregiverService: CaregiverService,
    private router: Router
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state) {
      this.currentCaregiver = state['caregiver'];
      this.isPrimaryCaregiver = state['isPrimary'];
    } else {
      this.currentCaregiver = new PatientCaregiver(
        new Caregiver("", "", "", "", null, "", "", "", true), false, ""
      );
      this.isPrimaryCaregiver = false;
    }
  }

  ngOnInit(): void {
    this.loggedCaregiver = this.caregiverService.getCurrentCaregiver()!;
  }

  goToPatientCaregiverRemove() {
    this.router.navigateByUrl('/caregiver/person/caregiver/remove', {
      state: { caregiver: this.currentCaregiver }
    });
  }
}