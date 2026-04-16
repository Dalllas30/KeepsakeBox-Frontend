import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileImage } from '../../core/models/profile-image.model';

@Component({
  selector: 'app-profile-image',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css']
})
export class ProfileImageComponent implements OnInit {

  @Input() profileImage!: ProfileImage;

  public loadingImage = false;

  private http = inject(HttpClient);

  ngOnInit(): void {
    if (!this.profileImage.imageURL){
      //this.loadDefaultProfileImage();
      this.profileImage.imageURL = '/assets/profileimage-default.png';
    }
  }

  loadDefaultProfileImage(): void {
    this.http.get('../../assets/profileimage-default.png', { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        reader.readAsDataURL(res);
        reader.onload = (event: any) => {
          this.profileImage.imageURL = event.target.result;
        };
      });
  }

  async changeProfileImageURL(event: any): Promise<void> {
    this.loadingImage = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      this.loadingImage = false;
      return;
    }

    try {
      const resizedBlob = await this.resizeImage(file, 400, 400);
      const reader = new FileReader();
      reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
        this.profileImage.imageURL = loadEvent.target?.result as string;
        this.loadingImage = false;
      };
      reader.onerror = () => {
        console.error('Error reading resized image');
        this.loadingImage = false;
      };
      reader.readAsDataURL(resizedBlob);
    } catch (error) {
      console.error('Error resizing image', error);
      this.loadingImage = false;
    }
  }

  private resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const [width, height] = this.getResizedDimensions(img.width, img.height, maxWidth, maxHeight);
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Unable to get canvas context'));
            return;
          }
          context.drawImage(img, 0, 0, width, height);
          canvas.toBlob(blob => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          }, file.type || 'image/png');
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  private getResizedDimensions(width: number, height: number, maxWidth: number, maxHeight: number): [number, number] {
    const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
    return [Math.round(width * ratio), Math.round(height * ratio)];
  }
}
