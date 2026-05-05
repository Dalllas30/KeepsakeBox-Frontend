/**
 * @author Pedro Neves - fc46430
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RtSessionImage } from '../models/rt-session-image.model';
import { RtSessionImageList } from '../models/rt-session-image-list.model';
import { ImageService } from './image.service';
import { TemplateSessionService } from './template-session.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RtSessionImageService {

  private currentImageIndexBySession = new Map<string, number>();

  constructor(private http: HttpClient,
              private imageService: ImageService,
              private templateSessionService: TemplateSessionService) {}

  private async getRtSessionImages(sessionId: string): Promise<RtSessionImage[]> {
    const response = await this.http.get<RtSessionImage[]>(`${environment.apiUrl}/rtSessionImages?sessionId=${sessionId}`).toPromise();
    return (response ?? []).sort((a, b) => (a.current_image > b.current_image) ? 1 : -1);
  }

  private async seedRtSessionImagesFromCurrentSelection(sessionId: string): Promise<RtSessionImage[]> {
    let currentSelection = this.templateSessionService.getCurrentRtSessionData() ?? [];

    if (currentSelection.length === 0) {
      const session = await this.http.get<any>(`${environment.apiUrl}/sessions/${sessionId}`).toPromise().catch(() => null);
      const templateId = session?.template_id?.toString();
      if (templateId) {
        const templateImages = await this.templateSessionService.getImagesByTemplateSessionId('', templateId);
        currentSelection = templateImages
          .map((img: any) => {
            const imageId = (img?.id ?? img?.image?.id ?? '').toString();
            if (!imageId) {
              return null;
            }
            return {
              id: imageId,
              image: { ...(img.image ?? img), id: imageId }
            } as any;
          })
          .filter((item: any) => item != null);
      }
    }

    if (currentSelection.length === 0) {
      return [];
    }

    await Promise.all(currentSelection.map(async (selection, index) => {
      const imageId = selection.id?.toString();
      if (!imageId) {
        return;
      }

      const existing = await this.http.get<any[]>(`${environment.apiUrl}/rtSessionImages?sessionId=${sessionId}&image_id=${imageId}`).toPromise();
      if (existing && existing.length > 0) {
        return;
      }

      await this.http.post(`${environment.apiUrl}/rtSessionImages`, {
        sessionId,
        image_id: imageId,
        imageURL: selection.image?.imageURL ?? '',
        current_image: index + 1,
        total_images: currentSelection.length,
        patient_feedback: 0,
        anxiety: -1,
        agressivity: -1,
        irritability: -1,
        commitment: -1,
        joy: -1,
        enthusiasm: -1,
        communication: -1,
        apathy: -1,
        observation: '',
        patient_agressivity: 0,
        patient_sadness: 0,
        patient_isolation: 0,
        category: selection.image?.category ?? ''
      }).toPromise();
    }));

    return this.getRtSessionImages(sessionId);
  }

  private async getOrSeedRtSessionImages(sessionId: string): Promise<RtSessionImage[]> {
    const images = await this.getRtSessionImages(sessionId);
    if (images.length > 0) {
      return images;
    }
    const seededImages = await this.seedRtSessionImagesFromCurrentSelection(sessionId);
    return seededImages.length > 0 ? seededImages : images;
  }


  /**
   * Gets RT session images with the given session ID
   * @param token - current logged caregiver token
   * @param sessionId - ID of the session to get images from
   * @returns list with all PersonalImage that belongs to the patient
   */
  async getRtSessionImage(token: string, sessionId: String, direction: String): Promise<RtSessionImage | null>{
    const images = await this.getOrSeedRtSessionImages(sessionId.toString());
    if (images.length === 0) {
      return null;
    }

    const sessionKey = sessionId.toString();
    const normalizedDirection = direction.toString();
    let currentIndex = this.currentImageIndexBySession.get(sessionKey) ?? 1;

    if (normalizedDirection === 'Current') {
      currentIndex = 1;
    } else if (normalizedDirection === 'Next') {
      currentIndex = Math.min(currentIndex + 1, images.length);
    } else if (normalizedDirection === 'Previous') {
      currentIndex = Math.max(currentIndex - 1, 1);
    } else {
      const matchedIndex = images.findIndex(image =>
        image.category === normalizedDirection || image.current_image.toString() === normalizedDirection
      );
      if (matchedIndex >= 0) {
        currentIndex = matchedIndex + 1;
      }
    }

    this.currentImageIndexBySession.set(sessionKey, currentIndex);
    return images[currentIndex - 1] ?? images[0] ?? null;
  }

  async updateRtSessionImageFeedback(token: string, rtSessionImage: RtSessionImage): Promise<boolean> {
      let rtSessionImageFeedbackUpdated = true;
      const existing = await this.http.get<RtSessionImage>(`${environment.apiUrl}/rtSessionImages/${rtSessionImage.id}`).toPromise().catch(() => null);
      let localrtSessionImage = new RtSessionImage(rtSessionImage.id,rtSessionImage.image_id,rtSessionImage.imageURL || existing?.imageURL || '',
                rtSessionImage.current_image,rtSessionImage.total_images,rtSessionImage.patient_feedback,
                rtSessionImage.anxiety, rtSessionImage.agressivity, rtSessionImage.irritability, rtSessionImage.commitment,
                rtSessionImage.joy, rtSessionImage.enthusiasm, rtSessionImage.communication, rtSessionImage.apathy,
                rtSessionImage.observation, rtSessionImage.patient_agressivity, rtSessionImage.patient_sadness, rtSessionImage.patient_isolation,
                rtSessionImage.category); 
      await this.http.put(
        `${environment.apiUrl}/rtSessionImages/${rtSessionImage.id}`,localrtSessionImage).toPromise()
        .catch(() => {
          rtSessionImageFeedbackUpdated = false;
        });
      return rtSessionImageFeedbackUpdated;
  }

  async getSessionPatientImageInformation(token: string, sessionId: String): Promise<RtSessionImage[]>{
    const images = await this.getOrSeedRtSessionImages(sessionId.toString());
    await Promise.all(images.map(async element => {
      element.thumbnailPath = await this.imageService.getThumbnailPath(element.image_id)
    }));
    return images;
  }

  async getSessionImagesInformation(token: string, sessionId: String): Promise<RtSessionImage[]>{
    return this.getOrSeedRtSessionImages(sessionId.toString());
  }
}
