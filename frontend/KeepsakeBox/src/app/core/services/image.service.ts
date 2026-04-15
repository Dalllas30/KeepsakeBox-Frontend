/**
 * @author André Santana - fc49451
 * @author Pedro Neves - fc46430
 */

/* TODO: migrate ImageService to return Observables:
         All methods still use .toPromise() — migrate together with consuming components */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AddImageData } from '../models/add-image-data.model';
import { Request, Thumbnail } from '../models/image.model';
import { ImagesFilterData } from '../models/images-filter-data.model';
import { PersonalImageList } from '../models/personal-image-list.model';
import { PersonalImage } from '../models/personal-image.model';
import { AppService } from './app.service';

// Request URLs
const serverURL                = 'localhost';
const addPatientImageURL01     = `http://${serverURL}:8080/patient/image/personal?token=`;
const addPatientImageURL02     = '&patientId=';
const addCaregiverImageURL     = `http://${serverURL}:8080/caregiver/image/personal?token=`;
const getPatientImageURL01     = `http://${serverURL}:8080/patient/image/personal?token=`;
const getPatientImageURL02     = '&patientId=';
const getPatientImageURL03     = '&imageId=';
const getImagesByCategoryURL   = `http://${serverURL}:8080/images?token=`;
const getSessionPatientImagesURL01 = `http://${serverURL}:8080/patient/images/session?token=`;
const getSessionPatientImagesURL02 = '&patientId=';
const getSessionPatientImagesURL03 = '&direction=';
const getCaregiverImageURL01   = `http://${serverURL}:8080/caregiver/image/personal?token=`;
const getCaregiverImageURL02   = '&imageId=';
const getPatientImagesURL01    = `http://${serverURL}:8080/patient/images/personal?token=`;
const getPatientImagesURL02    = '&patientId=';
const getCaregiverImagesURL    = `http://${serverURL}:8080/caregiver/images/personal?token=`;
const updatePatientImageURL01  = `http://${serverURL}:8080/patient/image/personal/update?token=`;
const updatePatientImageURL02  = '&patientId=';
const updateCaregiverImageURL  = `http://${serverURL}:8080/caregiver/image/personal/update?token=`;
const deletePatientImageURL01  = `http://${serverURL}:8080/patient/image/personal/delete?token=`;
const deletePatientImageURL02  = '&patientId=';
const deletePatientImageURL03  = '&imageId=';
const deleteCaregiverImageURL01 = `http://${serverURL}:8080/caregiver/image/personal/delete?token=`;
const deleteCaregiverImageURL02 = '&imageId=';
const getThumbnailURL          = `http://${serverURL}:8080/thumbnail/id`;

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private http       = inject(HttpClient);
  private router     = inject(Router);
  private appService = inject(AppService);

  private categoriesPT: string[] =
    ['Animais', 'Comida', 'Empregos', 'Locais', 'Pessoas', 'Veículos', 'Hábitos',
     'Música', 'Cinema', 'Desportos', 'Objetos', 'Passatempos', 'Férias', 'Natureza']
      .sort((a, b) => (a > b) ? 1 : -1);

  private categoriesENG: string[] =
    ['Animals', 'Food', 'Jobs', 'Places', 'People', 'Vehicles', 'Habits',
     'Music', 'Cinema', 'Sports', 'Objects', 'Hobbies', 'Vacations', 'Nature']
      .sort((a, b) => (a > b) ? 1 : -1);

  private imagesURL:           string[] = [];
  private imagesToValidateURL: string[] = [];

  constructor() {
    this.categoriesPT.push('Outra');
    this.categoriesENG.push('Other');
  }

  // ─── Canvas-based image resize (replaces ng2-img-max) ───────────────────────

  private resizeImage(file: File, maxWidth: number, maxHeight: number): Observable<Blob> {
    return new Observable(observer => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width  = Math.round(width  * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          if (blob) { observer.next(blob); observer.complete(); }
          else      { observer.error('Canvas toBlob failed'); }
        }, file.type || 'image/jpeg');
      };
      img.onerror = err => { URL.revokeObjectURL(url); observer.error(err); };
      img.src = url;
    });
  }

  // ─── Categories ─────────────────────────────────────────────────────────────

  getCategoriesPT():  string[] { return this.categoriesPT; }
  getCategoriesENG(): string[] { return this.categoriesENG; }

  parseCategories(categoriesArray: string[]): string {
    return categoriesArray
      .sort((a, b) => (a > b) ? 1 : -1)
      .join(', ');
  }

  // ─── Image URL stacks ────────────────────────────────────────────────────────

  pushImageURL(imageURL: string):           void { this.imagesURL.push(imageURL); }
  pushImageToValidateURL(imageURL: string): void { this.imagesToValidateURL.push(imageURL); }
  popImageURL():           string { return this.imagesURL.pop() || ''; }
  popImageToValidateURL(): string { return this.imagesToValidateURL.pop() || ''; }
  resetImagesURL():           void { this.imagesURL = []; }
  resetImagesToValidateURL(): void { this.imagesToValidateURL = []; }

  // ─── Upload helpers ──────────────────────────────────────────────────────────

  async addImagesURLToUpload(files: File[]): Promise<void> {
    const filesAmount = files.length;
    for (const file of files) {
      await this.resizeImage(file, 1000, 1000).subscribe(
        (result: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(result);
          reader.onload = async (event) => {
            if (typeof event.target?.result === 'string') {
              this.pushImageURL(event.target.result);
            } else if (event.target?.result) {
              this.pushImageURL(event.target.result.toString());
            }
            if (this.appService.isRouteActive('caregiver/person/images')) {
              this.router.navigateByUrl('/caregiver/person/images/add', {
                state: { imagesAmount: filesAmount }
              });
            } else {
              this.router.navigateByUrl('/caregiver/profile/images/add', {
                state: { imagesAmount: filesAmount }
              });
            }
          };
        },
        (error: unknown) => { console.error('Error resizing image:', error); }
      );
    }
  }

  addImagesURLToUploadForValidation(files: File[], request: Request): Promise<void> {
    void request;
    const filesAmount    = files.length;
    void filesAmount;
    const uploadPromises: Promise<void>[] = [];

    for (const file of files) {
      const uploadPromise = new Promise<void>((resolve, reject) => {
        this.resizeImage(file, 1000, 1000).subscribe(
          (result: Blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onload = (event) => {
              if (typeof event.target?.result === 'string') {
                this.pushImageToValidateURL(event.target.result);
              } else if (event.target?.result) {
                this.pushImageToValidateURL(event.target.result.toString());
              }
              resolve();
            };
            reader.onerror = () => reject();
          },
          (error: unknown) => { console.error('Error resizing image:', error); reject(error); }
        );
      });
      uploadPromises.push(uploadPromise);
    }

    return Promise.all(uploadPromises).then(() => undefined);
  }

  // ─── Thumbnail ───────────────────────────────────────────────────────────────

  async getThumbnail(imageId: string): Promise<Thumbnail | null> {
    let thumbnail: Thumbnail | null = null;
    await this.http.post<Thumbnail>(getThumbnailURL, imageId).toPromise().then(response => {
      if (response) thumbnail = response;
    });
    return thumbnail;
  }

  async getThumbnailPath(imageId: string): Promise<string> {
    const thumbnail = await this.getThumbnail(imageId);
    return thumbnail?.imagePath || '';
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  async addPatientImage(token: string, patientId: string, addImageData: AddImageData): Promise<boolean> {
    let ok = true;
    await this.http.post(
      `${addPatientImageURL01}${token}${addPatientImageURL02}${patientId}`,
      addImageData).toPromise().catch(() => { ok = false; });
    return ok;
  }

  async addCaregiverImage(token: string, addImageData: AddImageData): Promise<boolean> {
    let ok = true;
    await this.http.post(
      `${addCaregiverImageURL}${token}`,
      addImageData).toPromise().catch(() => { ok = false; });
    return ok;
  }

  async getPatientImages(token: string, patientId: string): Promise<PersonalImage[]> {
    let images: PersonalImage[] = [];
    await this.http.get<PersonalImageList>(
      `${getPatientImagesURL01}${token}${getPatientImagesURL02}${patientId}`)
      .toPromise()
      .then(response => {
        if (response) {
          images = response.images.sort((a, b) =>
            (a.image.lastUpdatedDate?.getTime() ?? 0) < (b.image.lastUpdatedDate?.getTime() ?? 0) ? 1 : -1);
        }
      });
    await Promise.all(images.map(async el => {
      el.image.thumbnailPath = await this.getThumbnailPath(el.image.id);
    }));
    return images;
  }

  async getImagesByCategory(token: string, imagesFilterData: ImagesFilterData): Promise<PersonalImage[]> {
    let images: PersonalImage[] = [];
    await this.http.post<PersonalImageList>(
      `${getImagesByCategoryURL}${token}`, imagesFilterData)
      .toPromise()
      .then(response => {
        if (response) {
          images = response.images.sort((a, b) =>
            (a.image.lastUpdatedDate?.getTime() ?? 0) < (b.image.lastUpdatedDate?.getTime() ?? 0) ? 1 : -1);
        }
      });
    return images;
  }

  async getSessionPatientImage(token: string, patientId: string, direction: string): Promise<PersonalImage[]> {
    let images: PersonalImage[] = [];
    await this.http.get<PersonalImageList>(
      `${getSessionPatientImagesURL01}${token}${getSessionPatientImagesURL02}${patientId}${getSessionPatientImagesURL03}${direction}`)
      .toPromise()
      .then(response => {
        if (response) {
          images = response.images.sort((a, b) =>
            (a.image.lastUpdatedDate?.getTime() ?? 0) < (b.image.lastUpdatedDate?.getTime() ?? 0) ? 1 : -1);
        }
      });
    return images;
  }

  async getCaregiverImages(token: string): Promise<PersonalImage[]> {
    let images: PersonalImage[] = [];
    await this.http.get<PersonalImageList>(`${getCaregiverImagesURL}${token}`)
      .toPromise()
      .then(response => {
        if (response) {
          images = response.images.sort((a, b) =>
            (a.image.lastUpdatedDate?.getTime() ?? 0) < (b.image.lastUpdatedDate?.getTime() ?? 0) ? 1 : -1);
        }
      });
    await Promise.all(images.map(async el => {
      el.image.thumbnailPath = await this.getThumbnailPath(el.image.id);
    }));
    return images;
  }

  async getPatientImage(token: string, patientId: string, imageId: string): Promise<PersonalImage | null> {
    let image: PersonalImage | null = null;
    await this.http.get<PersonalImage>(
      `${getPatientImageURL01}${token}${getPatientImageURL02}${patientId}${getPatientImageURL03}${imageId}`)
      .toPromise().then(response => { if (response) image = response; });
    return image;
  }

  async getCaregiverImage(token: string, imageId: string): Promise<PersonalImage | null> {
    let image: PersonalImage | null = null;
    await this.http.get<PersonalImage>(
      `${getCaregiverImageURL01}${token}${getCaregiverImageURL02}${imageId}`)
      .toPromise().then(response => { if (response) image = response; });
    return image;
  }

  async updatePatientImage(token: string, patientId: string, img: PersonalImage): Promise<boolean> {
    let ok = true;
    await this.http.post(
      `${updatePatientImageURL01}${token}${updatePatientImageURL02}${patientId}`, img)
      .toPromise().catch(() => { ok = false; });
    return ok;
  }

  async updateCaregiverImage(token: string, img: PersonalImage): Promise<boolean> {
    let ok = true;
    await this.http.post(`${updateCaregiverImageURL}${token}`, img)
      .toPromise().catch(() => { ok = false; });
    return ok;
  }

  async deletePatientImage(token: string, patientId: string, imageId: string): Promise<boolean> {
    let ok = true;
    await this.http.get(
      `${deletePatientImageURL01}${token}${deletePatientImageURL02}${patientId}${deletePatientImageURL03}${imageId}`)
      .toPromise().catch(() => { ok = false; });
    return ok;
  }

  async deleteCaregiverImage(token: string, imageId: string): Promise<boolean> {
    let ok = true;
    await this.http.get(
      `${deleteCaregiverImageURL01}${token}${deleteCaregiverImageURL02}${imageId}`)
      .toPromise().catch(() => { ok = false; });
    return ok;
  }
}
