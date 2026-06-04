import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ImageService } from '../../../../core/services/image.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-image-add-selection',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './patient-image-add-selection.component.html',
  styleUrls: ['./patient-image-add-selection.component.css']
})
export class PatientImageAddSelectionComponent {

  loadingImage: boolean = false;

  constructor(private imageService: ImageService) {}

  async addImages(event: any): Promise<void> {
    this.loadingImage = true;
    if (event.target.files && event.target.files[0]) {
      this.imageService.addImagesURLToUpload(event.target.files);
    }
  }
}