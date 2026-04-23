import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageToValidate, ImageToValidateData, Request } from '../models/image.model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

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
      this.http.post<any>(`${environment.apiUrl}/requests`, requestData)
    );
    if (response) {
      requestId = response.id?.toString() ?? null;
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
      this.http.get<Request>(`${environment.apiUrl}/requests/${requestId}`)
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
      this.http.post<any>(`${environment.apiUrl}/imagesToValidate`, imageToValidate)
    );
    if (response) {
      imageId = response.id?.toString() ?? null;
    }
    return imageId; 
  }

  async getImagesToValidateByCaregiverId(caregiverId: string): Promise<ImageToValidate[]> {
    let imagesToValidate: ImageToValidate[] = [];
    const response = await firstValueFrom(
      this.http.get<ImageToValidate[]>(`${environment.apiUrl}/imagesToValidate?caregiverID=${caregiverId}`)
    );
    if (response) {
      imagesToValidate = response;
    }
    return imagesToValidate;
  }

}
