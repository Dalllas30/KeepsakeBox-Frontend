/**
 * @author Pedro Neves - fc46430
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RtSessionImage } from '../models/rt-session-image.model';
import { RtSessionImageList } from '../models/rt-session-image-list.model';
import { ImageService } from './image.service';

//Request URLs
//const serverURL = "194.117.20.219"
const serverURL = "localhost"
const getRtSessionImagesURL01 = `http://${serverURL}:8080/session/running/image?token=`;
const getRtSessionImagesURL02 = '&sessionId=';
const getRtSessionImagesURL03 = '&direction=';
const updateRtSessionImageFeedbackURL = `http://${serverURL}:8080/session/running/image/feedback/update?token=`;
const getSessionPatientImagesURL01 = `http://${serverURL}:8080/caregiver/history/summary?token=`;
const getSessionPatientImagesURL02 = '&sessionId=';
const getSessionPatientImagesURL03 = `http://${serverURL}:8080/caregiver/history/summary/images?token=`;

@Injectable({
  providedIn: 'root'
})
export class RtSessionImageService {

  constructor(private http: HttpClient,
              private imageService: ImageService) {}


  /**
   * Gets RT session images with the given session ID
   * @param token - current logged caregiver token
   * @param sessionId - ID of the session to get images from
   * @returns list with all PersonalImage that belongs to the patient
   */
  async getRtSessionImage(token: string, sessionId: String, direction: String): Promise<RtSessionImage | null>{
    let rtSessionImage: RtSessionImage | null = null;
    await this.http.get<RtSessionImage>(
      `${getRtSessionImagesURL01}${token}${getRtSessionImagesURL02}${sessionId}${getRtSessionImagesURL03}${direction}`)
    .toPromise()
    .then(response => {
      if (response) {
        rtSessionImage = response;
      }
    });
    return rtSessionImage;
  }

  async updateRtSessionImageFeedback(token: string, rtSessionImage: RtSessionImage): Promise<boolean> {
      let rtSessionImageFeedbackUpdated = true;
      let localrtSessionImage = new RtSessionImage(rtSessionImage.id,rtSessionImage.image_id,"",
                rtSessionImage.current_image,rtSessionImage.total_images,rtSessionImage.patient_feedback,
                rtSessionImage.anxiety, rtSessionImage.agressivity, rtSessionImage.irritability, rtSessionImage.commitment,
                rtSessionImage.joy, rtSessionImage.enthusiasm, rtSessionImage.communication, rtSessionImage.apathy,
                rtSessionImage.observation, rtSessionImage.patient_agressivity, rtSessionImage.patient_sadness, rtSessionImage.patient_isolation,
                rtSessionImage.category); 
      await this.http.post(
        `${updateRtSessionImageFeedbackURL}${token}`,localrtSessionImage).toPromise()
        .catch(() => {
          rtSessionImageFeedbackUpdated = false;
        });
      return rtSessionImageFeedbackUpdated;
  }

  async getSessionPatientImageInformation(token: string, sessionId: String): Promise<RtSessionImage[]>{
    let images: RtSessionImage[] = [];
    await this.http.get<RtSessionImageList>(
      `${getSessionPatientImagesURL01}${token}${getSessionPatientImagesURL02}${sessionId}`)
    .toPromise()
    .then(response => {
      if (response) {
        images = response.images.sort((a, b) =>
          (a.image_id < b.image_id) ? 1 : -1);
      }
    });
    images.forEach(async element => {
      element.thumbnailPath = await this.imageService.getThumbnailPath(element.image_id)
    });
    return images;
  }

  async getSessionImagesInformation(token: string, sessionId: String): Promise<RtSessionImage[]>{
    let images: RtSessionImage[] = [];
    await this.http.get<RtSessionImageList>(
      `${getSessionPatientImagesURL03}${token}${getSessionPatientImagesURL02}${sessionId}`)
    .toPromise()
    .then(response => {
      if (response) {
        images = response.images.sort((a, b) =>
          (a.image_id < b.image_id) ? 1 : -1);
      }
    });
    return images;
  }
}
