import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Caregiver } from '../../core/models/caregiver.model';
import { AppService } from '../../core/services/app.service';
import { CaregiverService } from '../../core/services/caregiver.service';
import { ValidationService } from '../../core/services/validation.service';
import { ImageToValidate } from '../../core/models/image.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-caregiver-profile',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterOutlet, RouterLink],
  templateUrl: './caregiver-profile.component.html',
  styleUrls: ['./caregiver-profile.component.css']
})
export class CaregiverProfileComponent implements OnInit {
  public caregiver!: Caregiver;
  public imagesToValidate!: ImageToValidate[];

  constructor(
    private appService: AppService,
    private caregiverService: CaregiverService,
    private validationService: ValidationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.cdr.detectChanges();
  }

  public isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }

  /**
   * Returns true when the active child route is a standalone "overlay"
   * page that should fill the viewport on its own, without the profile
   * card and tab nav wrapping it.
   */
  hideNavBar(): boolean {
    return this.isRouteActive('profile/update') ||
      this.isRouteActive('profile/password') ||
      this.isRouteActive('profile/images/add') ||
      this.isRouteActive('profile/image/update') ||
      this.isRouteActive('profile/image/delete') ||
      this.isRouteActive('profile/images/method');
  }
}