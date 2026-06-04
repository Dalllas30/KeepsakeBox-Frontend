import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../../core/services/image.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-caregiver-image-add-selection',
  standalone: true,
  imports: [CommonModule,TranslateModule, RouterLink],
  templateUrl: './caregiver-image-add-selection.component.html',
  styleUrls: ['./caregiver-image-add-selection.component.css']
})
export class CaregiverImageAddSelectionComponent {
  loadingImage: boolean = false;

  constructor(private imageService: ImageService) {}

  async addImages(event: any): Promise<void> {
    this.loadingImage = true;
    if (event.target.files && event.target.files[0]) {
      this.imageService.addImagesURLToUpload(event.target.files);
    }
  }
}