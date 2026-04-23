import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { Caregiver } from '../../../core/models/caregiver.model';
import { PatientObservation } from '../../../core/models/patient-observation.model';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { ObservationService } from '../../../core/services/observation.service';
import { PatientService } from '../../../core/services/patient.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

@Component({
  selector: 'app-patient-observations',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbPagination, RouterLink],
  templateUrl: './patient-observations.component.html',
  styleUrls: ['./patient-observations.component.css']
})
export class PatientObservationsComponent implements OnInit {

  @Input() page = 1;
  @Input() pageSize = 2;
  @Input() maxSize = 3;
  public collectionSize!: number;
  public observations!: PatientObservation[];
  public observationsCopy!: PatientObservation[];
  public currentCaregiver!: Caregiver;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private patientService: PatientService,
    private observationService: ObservationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.currentCaregiver = this.caregiverService.getCurrentCaregiver()!;
    await this.retrieveObservations();
    this.cdr.detectChanges();
  }

  async retrieveObservations(): Promise<void> {
    this.observations = await this.observationService.getPatientObservations(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.patientService.getCurrentPatient()!.id
    );
    this.observationsCopy = this.observations;
    this.collectionSize = this.observations.length;
  }

  searchObservation(event: Event) {
    this.observations = this.observationsCopy;
    const filterValue = (event.target as HTMLInputElement).value;
    this.observations = this.observations.filter(
      observation =>
        observation.caregiver.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        observation.caregiver.email.toString().includes(filterValue.toLowerCase()) ||
        observation.observation.toLowerCase().includes(filterValue.toLowerCase())
    );
    this.collectionSize = this.observations.length;
  }

  goToEditObservation(observation: PatientObservation) {
    this.router.navigateByUrl('/caregiver/person/observations/update', {
      state: { observation: observation }
    });
  }

  goToDeleteObservation(observation: PatientObservation) {
    this.router.navigateByUrl('/caregiver/person/observations/delete', {
      state: { observation: observation }
    });
  }
}