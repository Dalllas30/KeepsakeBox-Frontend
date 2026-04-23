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
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;

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

  private normalizePersonalImage(image: any): PersonalImage {
    return {
      ...image,
      image: image.image ?? image,
      isFavorite: image.isFavorite ?? false,
      associatedImageId: image.associatedImageId
    } as PersonalImage;
  }

  private async getImageById(imageId: string): Promise<any | null> {
    return await this.http.get<any>(`${apiUrl}/images/${imageId}`).toPromise().catch(() => null);
  }

  private async persistThumbnail(imageId: string, imagePath: string): Promise<void> {
    const existing = await this.http.get<any[]>(`${apiUrl}/thumbnails?imageId=${imageId}`).toPromise();
    if (existing && existing.length > 0) {
      await this.http.put(`${apiUrl}/thumbnails/${existing[0].id}`, { ...existing[0], imagePath }).toPromise();
      return;
    }
    await this.http.post(`${apiUrl}/thumbnails`, { imageId, imagePath }).toPromise();
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
    await this.http.get<any[]>(`${apiUrl}/thumbnails?imageId=${imageId}`).toPromise().then(response => {
      if (response && response.length > 0) thumbnail = response[0];
    });
    return thumbnail;
  }

  async getThumbnailPath(imageId: string): Promise<string> {
    const thumbnail = await this.getThumbnail(imageId);
    if (thumbnail?.imagePath) {
      return thumbnail.imagePath;
    }
    const image = await this.getImageById(imageId);
    return image?.image?.imageURL || image?.imageURL || '';
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  async addPatientImage(token: string, patientId: string, addImageData: AddImageData): Promise<boolean> {
    let ok = true;
    const createdBy = await this.http.get<any[]>(`${apiUrl}/caregivers?token=${token}`).toPromise().then(response => response?.[0] ?? null);
    const payload = {
      patientId,
      createdById: addImageData.createdById,
      createdBy,
      isFavorite: addImageData.isFavorite,
      image: {
        category: addImageData.category,
        description: addImageData.description,
        imageURL: addImageData.imageURL,
        createdById: addImageData.createdById,
        createdBy,
        isPersonal: true,
        isPrivate: addImageData.isPrivate,
        negativeIntensity: 0,
        neutralIntensity: 0,
        positiveIntensity: 0,
        createdDate: new Date().toISOString(),
        lastUpdatedDate: new Date().toISOString()
      }
    };
    const response = await this.http.post<any>(`${apiUrl}/images`, payload).toPromise().catch(() => null);
    if (!response) {
      ok = false;
    } else {
      await this.persistThumbnail(response.id.toString(), addImageData.imageURL);
    }
    return ok;
  }

  async addCaregiverImage(token: string, addImageData: AddImageData): Promise<boolean> {
    let ok = true;
    const createdBy = await this.http.get<any[]>(`${apiUrl}/caregivers?token=${token}`).toPromise().then(response => response?.[0] ?? null);
    const payload = {
      createdById: addImageData.createdById,
      createdBy,
      isFavorite: addImageData.isFavorite,
      image: {
        category: addImageData.category,
        description: addImageData.description,
        imageURL: addImageData.imageURL,
        createdById: addImageData.createdById,
        createdBy,
        isPersonal: false,
        isPrivate: addImageData.isPrivate,
        negativeIntensity: 0,
        neutralIntensity: 0,
        positiveIntensity: 0,
        createdDate: new Date().toISOString(),
        lastUpdatedDate: new Date().toISOString()
      }
    };
    const response = await this.http.post<any>(`${apiUrl}/images`, payload).toPromise().catch(() => null);
    if (!response) {
      ok = false;
    } else {
      await this.persistThumbnail(response.id.toString(), addImageData.imageURL);
    }
    return ok;
  }

  async getPatientImages(token: string, patientId: string): Promise<PersonalImage[]> {
    let images: PersonalImage[] = [];
    await this.http.get<any[]>(`${apiUrl}/images?patientId=${patientId}`).toPromise().then(response => {
      images = (response ?? []).map(image => this.normalizePersonalImage(image)).sort((a, b) =>
        (a.image.lastUpdatedDate?.getTime?.() ?? new Date(a.image.lastUpdatedDate ?? 0).getTime()) <
        (b.image.lastUpdatedDate?.getTime?.() ?? new Date(b.image.lastUpdatedDate ?? 0).getTime()) ? 1 : -1);
    });
    await Promise.all(images.map(async el => {
      el.image.thumbnailPath = await this.getThumbnailPath(el.image.id);
    }));
    return images;
  }

  async getImagesByCategory(token: string, imagesFilterData: ImagesFilterData): Promise<PersonalImage[]> {
    const allImages = await this.http.get<any[]>(`${apiUrl}/images`).toPromise();
    const caregiverId = imagesFilterData.caregiverId;
    const patientId = imagesFilterData.patientId;
    const category = imagesFilterData.category;
    const text = (imagesFilterData.description || '').toLowerCase();
    return (allImages ?? [])
      .filter(image => !category || category === 'All' || image.image?.category === category)
      .filter(image => !text || `${image.image?.description ?? ''}`.toLowerCase().includes(text))
      .filter(image => imagesFilterData.allPublicImage || image.image?.isPrivate === false || image.createdById === caregiverId || image.patientId === patientId)
      .map(image => this.normalizePersonalImage(image))
      .sort((a, b) => (new Date(a.image.lastUpdatedDate ?? 0).getTime()) < (new Date(b.image.lastUpdatedDate ?? 0).getTime()) ? 1 : -1);
  }

  async getSessionPatientImage(token: string, patientId: string, direction: string): Promise<PersonalImage[]> {
    const response = await this.http.get<any[]>(`${apiUrl}/images?patientId=${patientId}`).toPromise();
    return (response ?? []).map(image => this.normalizePersonalImage(image)).sort((a, b) =>
      (new Date(a.image.lastUpdatedDate ?? 0).getTime()) < (new Date(b.image.lastUpdatedDate ?? 0).getTime()) ? 1 : -1);
  }

  async getCaregiverImages(token: string): Promise<PersonalImage[]> {
    let images: PersonalImage[] = [];
    const caregivers = await this.http.get<any[]>(`${apiUrl}/caregivers?token=${token}`).toPromise();
    const caregiverId = caregivers?.[0]?.id?.toString();
    await this.http.get<any[]>(`${apiUrl}/images?createdById=${caregiverId}`).toPromise().then(response => {
      images = (response ?? []).map(image => this.normalizePersonalImage(image)).sort((a, b) =>
        (new Date(a.image.lastUpdatedDate ?? 0).getTime()) < (new Date(b.image.lastUpdatedDate ?? 0).getTime()) ? 1 : -1);
    });
    await Promise.all(images.map(async el => {
      el.image.thumbnailPath = await this.getThumbnailPath(el.image.id);
    }));
    return images;
  }

  async getPatientImage(token: string, patientId: string, imageId: string): Promise<PersonalImage | null> {
    let image: PersonalImage | null = null;
    await this.http.get<PersonalImage>(`${apiUrl}/images/${imageId}`).toPromise().then(response => {
      if (response) image = this.normalizePersonalImage(response);
    });
    return image;
  }

  async getCaregiverImage(token: string, imageId: string): Promise<PersonalImage | null> {
    let image: PersonalImage | null = null;
    await this.http.get<PersonalImage>(`${apiUrl}/images/${imageId}`).toPromise().then(response => {
      if (response) image = this.normalizePersonalImage(response);
    });
    return image;
  }

  async updatePatientImage(token: string, patientId: string, img: PersonalImage): Promise<boolean> {
    let ok = true;
    await this.http.put(`${apiUrl}/images/${img.image.id}`, { ...img, patientId }).toPromise().catch(() => { ok = false; });
    return ok;
  }

  async updateCaregiverImage(token: string, img: PersonalImage): Promise<boolean> {
    let ok = true;
    await this.http.put(`${apiUrl}/images/${img.image.id}`, img)
      .toPromise().catch(() => { ok = false; });
    return ok;
  }

  async deletePatientImage(token: string, patientId: string, imageId: string): Promise<boolean> {
    let ok = true;
    await this.http.delete(`${apiUrl}/images/${imageId}`)
      .toPromise().catch(() => { ok = false; });
    return ok;
  }

  async deleteCaregiverImage(token: string, imageId: string): Promise<boolean> {
    let ok = true;
    await this.http.delete(`${apiUrl}/images/${imageId}`)
      .toPromise().catch(() => { ok = false; });
    return ok;
  }
}
