/**
 * @author Pedro Neves - fc46430
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Caregiver } from '../models/caregiver.model';
import { Patient } from '../models/patient.model';
import { PatientCaregiver } from '../models/patient-caregiver.model';
import { PatientCaregiverList } from '../models/patient-caregiver-list.model';
import { PatientList } from '../models/patient-list.model';
import { PersonalImage } from '../models/personal-image.model';
import { PersonalImageList } from '../models/personal-image-list.model';
import { ResponseBasic } from '../models/response-basic.model';
import { RtSessionCreateData } from '../models/rt-session-create-data.model';
import { RtSessionCreateDataList } from '../models/rt-session-create-data-list.model';
import { TemplateSession } from '../models/template-session.model';
import { TemplateSessionData } from '../models/template-session-data.model';
import { TemplateSessionList } from '../models/template-session-list.model';
import { environment } from '../../../environments/environment';
 
 
 @Injectable({
   providedIn: 'root'
 })
 export class TemplateSessionService {
 
   constructor(private http: HttpClient) {
     this.currentPatient = new BehaviorSubject<Patient | null>(JSON.parse(localStorage.getItem('currentPatient') || 'null'));
     this.currentCaregiver = new BehaviorSubject<Caregiver | null>(JSON.parse(localStorage.getItem('currentCaregiver') || 'null'));
     this.templateSession = new BehaviorSubject<TemplateSession | null>(JSON.parse(localStorage.getItem('templateSession') || 'null'));
     this.currentRtSessionData = new BehaviorSubject<RtSessionCreateData[] | null>(JSON.parse(localStorage.getItem('RtSessionCreateDataList') || 'null'));
    }
 
    private currentPatient: BehaviorSubject<Patient | null>;
    private currentCaregiver: BehaviorSubject<Caregiver | null>;
    private templateSession: BehaviorSubject<TemplateSession | null>;
    private currentRtSessionData: BehaviorSubject<RtSessionCreateData[] | null>;
 
    /**
     * Sets the current patient on cache
     * @param patient - patient to save on cacje
     */
    setCurrentPatient(patient: Patient): void {
      localStorage.setItem('currentPatient', JSON.stringify(patient));
      this.currentPatient.next(patient);
    }
 
    /**
     * Resets current patient on cache
     */
    resetCurrentPatient(): void {
      localStorage.removeItem('currentPatient');
      this.currentPatient.next(null);
    }
 
    /**
     * Gets current patient saved on cache
     * @returns Patient saved on cache
     */
    getCurrentPatient(): Patient | null {
      return this.currentPatient.value;
    }
 
    /**
     * Sets the current patient on cache
     * @param caregiver - patient to save on cacje
     */
    setcurrentCaregiver(caregiver: Caregiver): void {
      localStorage.setItem('currentCaregiver', JSON.stringify(caregiver));
      this.currentCaregiver.next(caregiver);
    }
 
    /**
     * Resets current patient on cache
     */
    resetcurrentCaregiver(): void {
      localStorage.removeItem('currentCaregiver');
      this.currentCaregiver.next(null);
    }
 
    /**
     * Gets current patient saved on cache
     * @returns Patient saved on cache
     */
    getcurrentCaregiver(): Caregiver | null {
      return this.currentCaregiver.value;
    }
 
    /**
     * Sets the current template session on cache
     * @param templateSession - templateSession to save on cache
     */
     setTemplateSession(templateSession: TemplateSession): void {
       localStorage.setItem('templateSession', JSON.stringify(templateSession));
       this.templateSession.next(templateSession);
     }
  
     /**
      * Resets template session on cache
      */
     resetTemplateSession(): void {
       localStorage.removeItem('templateSession');
       this.templateSession.next(null);
     }
  
     /**
      * Gets template session saved on cache
      * @returns templateSession saved on cache
      */
     getTemplateSession(): TemplateSession | null   {
       return this.templateSession.value;
     }
  
 
 
 
 
 
 
 
 
 
 
 
 
 
    /**
     * Sets the data needed to create a RT Sesssion on cache
     * @param rtSessionData - List of data needed to create a RT Session
     */
     setCurrentRtSessionData(rtSessionData: RtSessionCreateData[]): void {
       localStorage.setItem('RtSessionCreateDataList', JSON.stringify(rtSessionData));
       this.currentRtSessionData.next(rtSessionData);
     }
  
     /**
      * Resets data needed to create a RT Session saved on cache
      */
     resetCurrentRtSessionData(): void {
       localStorage.removeItem('RtSessionCreateDataList');
       this.currentRtSessionData.next(null);
     }
  
     /**
      * Gets current data needed to create a RT Session saved on cache
      * @returns Patient saved on cache
      */
     getCurrentRtSessionData(): RtSessionCreateData[] | null {
       return this.currentRtSessionData.value;
     }

     private async getTemplateSessions(): Promise<TemplateSession[]> {
      return await this.http.get<TemplateSession[]>(`${environment.apiUrl}/templateSessions`).toPromise().then(response => response ?? []);
     }

     private async getImages(): Promise<any[]> {
      return await this.http.get<any[]>(`${environment.apiUrl}/images`).toPromise().then(response => response ?? []);
     }
  
 
    /**
     * Gets a template session list
     * @param token - session ID associated to the
     *                Caregiver who sent the request
     * @param patientId - ID of the patient we want to retrieve
     * @param filter - type of the sessions
     * @param count - number of entries will be return
     * @returns List of templeate sessions
     */
    async getTemplateSessionList(token: string, patientId: String, filter: String, count: String): Promise<TemplateSession[]>{
      let templateSessions = await this.getTemplateSessions();
      if (patientId && patientId !== 'any' && patientId !== 'all') {
        templateSessions = templateSessions.filter(templateSession => templateSession.patient_id?.toString() === patientId.toString());
      }
      if (filter && filter !== 'all') {
        if (filter === 'ongoing') {
          templateSessions = templateSessions.filter(templateSession => templateSession.isStarted);
        } else if (filter === 'tostart') {
          templateSessions = templateSessions.filter(templateSession => !templateSession.isStarted);
        }
      }
      templateSessions = templateSessions.sort((a, b) => new Date(b.last_updated_date as any).getTime() - new Date(a.last_updated_date as any).getTime());
      if (count && count !== 'all') {
        const limit = Number(count);
        if (!Number.isNaN(limit)) {
          templateSessions = templateSessions.slice(0, limit);
        }
      }
      return templateSessions;
    }
 
    /**
     * Create template sessions
     * @param token - session ID associated to the
     *                Caregiver who sent the request
     * @param templateSessionData - data to create a template session
     * @returns Template session ID of the template session ceated
     */
     async createTemplateSession(token: string, templateSessionData: TemplateSessionData): Promise<string | null>{
       let templateSessionId: string | null = null;
      await this.http.post<any>(`${environment.apiUrl}/templateSessions`, templateSessionData).toPromise()
      .then(async response => {
        if (response){
          templateSessionId = response.id?.toString() ?? null;
        }
      })
      .catch(() => {
        templateSessionId = null;
       });
      return templateSessionId;
    }
 
    /**
     * Update template sessions
     * @param token - session ID associated to the
     *                Caregiver who sent the request
     * @param templateSessionData - data to create a template session
     * @returns Template session ID of the template session ceated
     */
    async updateTemplateSession(token: string, templateSessionData: TemplateSessionData, templateSessionId: string): Promise<string | null>{
      let rtemplateSessionId: string | null = null;
       await this.http.put<any>(`${environment.apiUrl}/templateSessions/${templateSessionId}`, templateSessionData).toPromise()
       .then(async response => {
         if (response){
           rtemplateSessionId = templateSessionId;
         }
       })
       .catch(() => {
         rtemplateSessionId = null;
        });
       return rtemplateSessionId;
     }
 
     /**
     * Generate template sessions
     * @param token - session ID associated to the
     *                Caregiver who sent the request
     * @param templateSessionData - data to create a template session
     * @returns list of images to present in a session
     * 
       */
     async selectImageList4TemplateSession(token: string, templateSessionData: TemplateSessionData): Promise<RtSessionCreateData[]>{
       let rtSessionCreateData: RtSessionCreateData[] = [];
       const images = await this.getImages();
       const selectedImages = images.filter(image => templateSessionData.image_list.includes(image.id?.toString()));
       rtSessionCreateData = selectedImages.map(image => ({
         id: image.id?.toString(),
         image: image.image ?? image,
         favorite: image.isFavorite ?? false,
         isFavorite: image.isFavorite ?? false
       } as RtSessionCreateData));
       return rtSessionCreateData;
     }
 
    /**
     * Removes a template session of the list
     * @param token - session ID associated to the
     *                Caregiver who sent the request
     * @param templateSessionId - ID of the template session to remove
     * @returns If was removed or not
     */
    async removeTemplateSession(token: string, templateSessionId: String, patientId: String) {
      let removed = true;
      await this.http.delete(`${environment.apiUrl}/templateSessions/${templateSessionId}`).toPromise()
       .catch(() => {
         removed = false;
       });
     return removed;
    }
 
    /**
     * Starts a session
     * @param token - session ID associated to the
     *                Caregiver who sent the request
     * @param templateSessionId - ID of template session that going start
     * @param patientId - ID of the patient we want to start the session
     * @returns ID of the session that start
     */
     async startSessionFromTemplateSession(token: string, templateSessionId: string, patientId: String): Promise<string | null>{
       let sessionId: string | null = null;
      const templateSession = await this.http.get<any>(`${environment.apiUrl}/templateSessions/${templateSessionId}`).toPromise().catch(() => null);
      if (!templateSession) {
        return null;
      }
      await this.http.post<any>(`${environment.apiUrl}/sessions`, {
        template_id: templateSessionId,
        caregiver_id: templateSession.caregiver_id,
        caregiver_name: templateSession.caregiver_name,
        patient_id: patientId,
        patient_name: templateSession.patient_name,
        full_name: `${templateSession.caregiver_name ?? ''} ${templateSession.patient_name ?? ''}`.trim(),
        start_session: new Date().toISOString(),
        end_session: null,
        sessionFinished: false,
        duration: null,
        total_images: templateSession.total_images ?? 0,
        patient_feedback: 0,
        global_feedback: null
      }).toPromise().then(response => {
        sessionId = response?.id?.toString() ?? null;
      }).catch(() => {
        sessionId = null;
      });
      return sessionId;
    }
 
     /**
    * Gets all application images associated to a category with the given Filters
    * @param token - current logged caregiver token
    * @param templateSessionId - template session id
    * @returns list with all PersonalImage that match the filter data
    */
      async getImagesByTemplateSessionId(token: string, templateSessionId: String): Promise<PersonalImage[]>{
       let images: PersonalImage[] = [];
       const templateSession = await this.http.get<any>(`${environment.apiUrl}/templateSessions/${templateSessionId}`).toPromise().catch(() => null);
       const allImages = await this.getImages();
       if (templateSession?.image_list) {
         images = allImages.filter(image => templateSession.image_list.includes(image.id?.toString()));
       }
       return images;
     }
 
   /**
    * Gets all caregiver patients for a template session with current session token
    * @param token - session ID associated to the current caregiver
    * @param caregiverId - a selected caregiver 
    * @param templateSessionId - a selected templateSession
    * @returns List of all patients associated to the selected caregiver
    */
  async getCaregiverPatientsByTemplateSessionId(token: string, caregiverId: string, templateSessionId: string): Promise<Patient[]> {
    let patients: Patient[] = [];
     await this.http.get<Patient[]>(`${environment.apiUrl}/patients?caregiverId=${caregiverId}`).toPromise()
     .then(response => {
       if (response) {
         patients = response.sort((a, b) => (a.name > b.name) ? 1 : -1);
       }
     });
     return patients;
   }
 
   /**
    * Gets all caregiver patients for a template session with current session token
    * @param token - session ID associated to the current caregiver
    * @param caregiverId - a selected caregiver 
    * @param templateSessionId - a selected templateSession
    * @returns List of all patients associated to the selected caregiver
    */
  async updateCaregiverPatientsByTemplateSessionId(token: string, templateSessionId: string, patientList: string[]): Promise<string> {
    let rtemplateSessionId = "";
     await this.http.patch(`${environment.apiUrl}/templateSessions/${templateSessionId}`, { patientList }).toPromise().then(() => {
      rtemplateSessionId = templateSessionId;
     }).catch(() => {
      rtemplateSessionId = "";
     });
     return rtemplateSessionId;
   }
 
   /**
    * Gets all caregiver for a template session with current session token
    * @param token - session ID associated to the current caregiver
    * @param templateSessionId - a selected templateSession
    * @returns List of all caregivers associated to the patient of the selected template Session 
    */
    async getCaregiversByTemplateSessionId(token: string, templateSessionId: string, patientId: string): Promise<PatientCaregiver[]> {
     let patientCaregivers: PatientCaregiver[] = [];
     await this.http.get<PatientCaregiver[]>(`${environment.apiUrl}/patientCaregivers?patientId=${patientId}`).toPromise()
     .then(response => {
       if (response) {
         patientCaregivers = response.sort((a, b) => (a.caregiver.name > b.caregiver.name) ? 1 : -1);
       }
     });
     return patientCaregivers;
   }
 
     /**
    * Gets all caregiver patients for a template session with current session token
    * @param token - session ID associated to the current caregiver
    * @param caregiverId - a selected caregiver 
    * @param templateSessionId - a selected templateSession
    * @returns List of all patients associated to the selected caregiver
    */
      async updateCaregiversByTemplateSessionId(token: string, templateSessionId: string, caregiverList: string[]): Promise<string> {
       let rtemplateSessionId = "";
       await this.http.patch(`${environment.apiUrl}/templateSessions/${templateSessionId}`, { caregiverList }).toPromise().then(() => {
        rtemplateSessionId = templateSessionId;
       }).catch(() => {
        rtemplateSessionId = "";
       });
       return rtemplateSessionId;
     }
   
 }
 