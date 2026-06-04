import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Caregiver } from '../../../core/models/caregiver.model';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { USER_ROLES } from '../../../core/models/user-role.model';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-caregiver-info',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './caregiver-info.component.html',
  styleUrls: ['./caregiver-info.component.css']
})
export class CaregiverInfoComponent implements OnInit {
  public caregiver!: Caregiver;

  constructor(
    private caregiverService: CaregiverService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
  }

  public isCaregiver(): boolean {
    return this.authenticationService.getCurrentUserRole() === USER_ROLES.CAREGIVER;
  }
}