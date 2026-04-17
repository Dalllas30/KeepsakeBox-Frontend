import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Caregiver } from '../../../core/models/caregiver.model';
import { Image } from '../../../core/models/image.model';
import { PersonalImage } from '../../../core/models/personal-image.model';
import { AppService } from '../../../core/services/app.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-patient-image',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './patient-image.component.html',
  styleUrls: ['./patient-image.component.css']
})
export class PatientImageComponent implements OnInit {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public caregiver!: Caregiver;
  public img!: PersonalImage;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private appService: AppService,
    private caregiverService: CaregiverService
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state) {
      this.img = state['image'];
    } else {
      this.img = new PersonalImage(
        new Image("", "", new Caregiver("", "", "", "", null, "", "", "", true),
          "", "", true, true, "", 0.0, 0.0, 0.0, null, null), false
      );
    }
  }

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
  }

  translateLabels(categories: string): string {
    return this.categoryService.categoriesTranslation(categories, this.translateCache);
  }

  public isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }

  goToImageUpdate() {
    this.router.navigateByUrl('/caregiver/person/image/update', {
      state: { image: this.img }
    });
  }

  goToImageDelete() {
    this.router.navigateByUrl('/caregiver/person/image/delete', {
      state: { image: this.img }
    });
  }

  goToImages() {
    this.router.navigateByUrl('/caregiver/person/images');
  }
}