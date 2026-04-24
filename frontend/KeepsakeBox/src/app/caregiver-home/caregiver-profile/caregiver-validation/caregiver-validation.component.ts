import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageGroup, ImageToValidate } from '../../../core/models/image.model';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { PatientService } from '../../../core/services/patient.service';
import { ValidationService } from '../../../core/services/validation.service';

@Component({
  selector: 'app-caregiver-validation',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbPaginationModule],
  templateUrl: './caregiver-validation.component.html',
  styleUrls: ['./caregiver-validation.component.css']
})
export class CaregiverValidationComponent implements OnInit {
  public awaitingValidation: boolean = true;
  public discardActive: boolean = false;
  public imagesToValidate: ImageToValidate[] = [];
  public imageGroups: ImageGroup[] = [];
  public imagesSorted: any[] = [];
  public targets: any[] = [];

  constructor(
    private router: Router,
    private validationService: ValidationService,
    private caregiverService: CaregiverService,
    private authenticationService: AuthenticationService,
    private patientService: PatientService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.validationService.getImagesToValidateByCaregiverId(this.caregiverService.getCurrentCaregiver()!.id).then((res) => {
      this.imagesToValidate = res;
      let usernames: any = {};
      this.imagesToValidate.forEach(img => {
        if (!usernames[img.username]) usernames[img.username] = [];
        usernames[img.username].push(img);
      });
      this.imagesSorted = Object.values(usernames);
      this.imagesSorted.forEach(async imageGroup => {
        this.targets.push(await this.getTargetName(imageGroup));
      });
    });
    this.cdr.detectChanges();
  }

  goToValidationInterface(imageGroup: any) {
    const navigationExtras: NavigationExtras = { state: { imagesToValidate: imageGroup } };
    this.router.navigate(['/caregiver/profile/validation/images'], navigationExtras);
  }

  async getTargetName(imageGroup: any) {
    const patient = await this.patientService.getPatientById(this.authenticationService.getCurrentCaregiverToken()!, imageGroup[0].targetID);
    return (patient !== null && patient !== undefined) ? patient.name : this.caregiverService.getCurrentCaregiver()!.name;
  }
}