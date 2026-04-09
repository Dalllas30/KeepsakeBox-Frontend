import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageToValidate, ImageToValidateData, Request } from '../models/image.model';
import { firstValueFrom } from 'rxjs';

//const serverURL = "194.117.20.219";
const serverURL = "localhost";
//const createCaregiverRequestURL = `http://${serverURL}:8080/caregiver/image/personal?token=`;
const getRequestURL = `http://${serverURL}:8080/request`
const createRequestURL = `http://${serverURL}:8080/createrequest?token=`
const sendToValidateURL = `http://${serverURL}:8080/validate`
const getImagesToValidateByCaregiverIdURL = `http://${serverURL}:8080/validate/caregiver`

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private http: HttpClient,) { }

  /**
   * Creates a new upload request and returns the request id
   */
   async createUploadRequest(token: string, requestData: Request): Promise<string | null> {
    let requestId = null;
    const response = await firstValueFrom(
      this.http.post(createRequestURL + token, requestData, { responseType: 'text' })
    );
    if (response) {
      requestId = response;
    }
    return requestId; 
  }

  /**
    * Gets a request with a session ID token
    * @param token - session ID associated to the
    *                Caregiver we want to retrieve
    * @returns Caregiver associated to token/sessionID
    */
   async getRequestById(requestId: string): Promise<Request | null> {
    var retrievedRequest: Request | null = null;
    const response = await firstValueFrom(
      this.http.get<Request>(getRequestURL + `/${requestId}`)
    );
    if (response) {
      retrievedRequest = response;
    }
    return retrievedRequest;
  }

  /**
   * Creates a new upload request and returns the request id
   */
   async sendImageToValidate(imageToValidate: ImageToValidateData): Promise<string | null> {
    let imageId = null;
    const response = await firstValueFrom(
      this.http.post(sendToValidateURL, imageToValidate, { responseType: 'text' })
    );
    if (response) {
      imageId = response;
    }
    return imageId; 
  }

  async getImagesToValidateByCaregiverId(caregiverId: string): Promise<ImageToValidate[]> {
    let imagesToValidate: ImageToValidate[] = [];
    const response = await firstValueFrom(
      this.http.get<ImageToValidate[]>(getImagesToValidateByCaregiverIdURL + `/${caregiverId}`)
    );
    if (response) {
      imagesToValidate = response;
    }
    return imagesToValidate;
  }

}
