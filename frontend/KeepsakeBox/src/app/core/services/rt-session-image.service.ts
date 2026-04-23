/**
 * @author Pedro Neves - fc46430
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RtSessionImage } from '../models/rt-session-image.model';
import { RtSessionImageList } from '../models/rt-session-image-list.model';
import { ImageService } from './image.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RtSessionImageService {

  constructor(private http: HttpClient,
              private imageService: ImageService) {}

  private async getRtSessionImages(sessionId: string): Promise<RtSessionImage[]> {
    const response = await this.http.get<RtSessionImage[]>(`${environment.apiUrl}/rtSessionImages?sessionId=${sessionId}`).toPromise();
    return (response ?? []).sort((a, b) => (a.image_id < b.image_id) ? 1 : -1);
  }


  /**
   * Gets RT session images with the given session ID
   * @param token - current logged caregiver token
   * @param sessionId - ID of the session to get images from
   * @returns list with all PersonalImage that belongs to the patient
   */
  async getRtSessionImage(token: string, sessionId: String, direction: String): Promise<RtSessionImage | null>{
    const images = await this.getRtSessionImages(sessionId.toString());
    return images.find(image => image.category === direction || image.current_image.toString() === direction.toString()) ?? images[0] ?? null;
  }

  async updateRtSessionImageFeedback(token: string, rtSessionImage: RtSessionImage): Promise<boolean> {
      let rtSessionImageFeedbackUpdated = true;
      let localrtSessionImage = new RtSessionImage(rtSessionImage.id,rtSessionImage.image_id,"",
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
    const images = await this.getRtSessionImages(sessionId.toString());
    await Promise.all(images.map(async element => {
      element.thumbnailPath = await this.imageService.getThumbnailPath(element.image_id)
    }));
    return images;
  }

  async getSessionImagesInformation(token: string, sessionId: String): Promise<RtSessionImage[]>{
    return this.getRtSessionImages(sessionId.toString());
  }
}
