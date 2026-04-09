import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { Caregiver } from '../../../core/models/caregiver.model';
import { Image } from '../../../core/models/image.model';
import { PersonalImage } from '../../../core/models/personal-image.model';
import { AppService } from '../../../core/services/app.service';
import { CaregiverService } from '../../../core/services/caregiver.service';

@Component({
  selector: 'app-caregiver-image',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './caregiver-image.component.html',
  styleUrls: ['./caregiver-image.component.css']
})
export class CaregiverImageComponent implements OnInit {
  public caregiver!: Caregiver;
  public img: PersonalImage;

  constructor(
    private router: Router,
    private appService: AppService,
    private caregiverService: CaregiverService
  ) {
    if (this.router.getCurrentNavigation()?.extras.state != null) {
      this.img = this.router.getCurrentNavigation()!.extras.state!['image'];
    } else {
      this.img = new PersonalImage(
        new Image("", "", new Caregiver("", "", "", "", new Date(), "", "", "", true), "", "", true, true, "", 0.0, 0.0, 0.0, new Date(), new Date()), false
      );
    }
  }

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
  }

  public isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }

  goToImageUpdate() {
    this.router.navigateByUrl('/caregiver/profile/image/update', { state: { image: this.img } });
  }

  goToImageDelete() {
    this.router.navigateByUrl('/caregiver/profile/image/delete', { state: { image: this.img } });
  }

  goToImages() {
    this.router.navigateByUrl('/caregiver/profile/images');
  }
}