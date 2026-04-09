/**
 * @author Pedro Neves - fc46430
 */

 import { HttpClient } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { Router } from '@angular/router';
 import { Patient } from '../models/patient.model';
 import { Caregiver } from '../models/caregiver.model';
 import { TemplateSession } from '../models/template-session.model';
 import { TemplateSessionData } from '../models/template-session-data.model';
 import { TemplateSessionList } from '../models/template-session-list.model';
 import { ResponseBasic } from '../models/response-basic.model';
 import { RtSessionCreateData } from '../models/rt-session-create-data.model';
 import { RtSessionCreateDataList } from '../models/rt-session-create-data-list.model';
 import { BehaviorSubject } from 'rxjs';
 import { PersonalImage } from '../models/personal-image.model';
 import { PersonalImageList } from '../models/personal-image-list.model';
 import { PatientList } from '../models/patient-list.model';
 import { PatientCaregiver } from '../models/patient-caregiver.model';
 import { PatientCaregiverList } from '../models/patient-caregiver-list.model';
 
 //Request URLs
 //const serverURL = "194.117.20.219"
 const serverURL = "localhost"
 const getTemplateSessionListURL01= `http://${serverURL}:8080/template/session/patient?token=`
 const getTemplateSessionListURL02 = "&patientId="
 const getTemplateSessionListURL03 = "&filter="
 const getTemplateSessionListURL04 = "&count="
 const getImagesByTemplateSessionIdURL01 = `http://${serverURL}:8080/template/session/images?token=`
 const getImagesByTemplateSessionIdURL02 = "&templateSessionId="
 const createTemplateSessionURL = `http://${serverURL}:8080/template/session/create?token=`
 const updateTemplateSessionURL01 = `http://${serverURL}:8080/template/session/update?token=`
 const updateTemplateSessionURL02 = "&templateSessionId="
 const selectImageList4TemplateSessionURL = `http://${serverURL}:8080/template/session/selectImageList?token=`
 const removeTemplateSessionURL01 = `http://${serverURL}:8080/template/session/remove?token=`
 const removeTemplateSessionURL02 = "&id="
 const removeTemplateSessionURL03 = "&patientId="
 const startSessionFromTemplateSessionURL01= `http://${serverURL}:8080/template/session/start?token=`
 const startSessionFromTemplateSessionURL02 = "&id="
 const startSessionFromTemplateSessionURL03 = "&patientId="
 const getCaregiverPatientsByCaregiverIdURL01 = `http://${serverURL}:8080/template/session/patients?token=`
 const getCaregiverPatientsByCaregiverIdURL02 = "&caregiverId="
 const getCaregiverPatientsByCaregiverIdURL03 = "&templateSessionId="
 const updateCaregiverPatientsByCaregiverIdURL01 = `http://${serverURL}:8080/template/session/patients?token=`
 const updateCaregiverPatientsByCaregiverIdURL02 = "&templateSessionId="
 const getCaregiversByTemplateSessionIdURL01 = `http://${serverURL}:8080/template/session/caregivers?token=`
 const getCaregiversByTemplateSessionIdURL02 = "&templateSessionId="
 const getCaregiversByTemplateSessionIdURL03 = "&patientId="
 const updateCaregiversByTemplateSessionIdURL01 = `http://${serverURL}:8080/template/session/caregivers?token=`
 const updateCaregiversByTemplateSessionIdURL02 = "&templateSessionId="
 
 
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
      let templateSessions: TemplateSession[] = [];
      await this.http.get<TemplateSessionList>(
        `${getTemplateSessionListURL01}${token}${getTemplateSessionListURL02}${patientId}${getTemplateSessionListURL03}${filter}${getTemplateSessionListURL04}${count}`).toPromise()
      .then(async response => {
        if (response){
          templateSessions = response.templateSessions;
        }
      });
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
      await this.http.post<ResponseBasic>(
        `${createTemplateSessionURL}${token}`,templateSessionData).toPromise()
      .then(async response => {
        if (response){
          templateSessionId = response.result;
        }
      })
      .catch(error => {
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
       await this.http.post<ResponseBasic>(
         `${updateTemplateSessionURL01}${token}${updateTemplateSessionURL02}${templateSessionId}`,templateSessionData).toPromise()
       .then(async response => {
         if (response){
           rtemplateSessionId = response.result;
         }
       })
       .catch(error => {
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
       await this.http.post<RtSessionCreateDataList>(
         `${selectImageList4TemplateSessionURL}${token}`,templateSessionData).toPromise()
       .then(async response => {
         if (response){
           response.rtSessionCreateData.forEach ( e => {
             // Atenção: corrigir este bug. o serviço Java (eclipse) deveria devolver apenas um isFavorite, mas devolve favorite
             // no Model do RtSessionCreateData => retirar o favorite
             // retirar este foreach
             // na criação do objeto => eliminar o parametro favorite !!!
             e.isFavorite=e.favorite;
           });
           console.log(response.rtSessionCreateData);
           rtSessionCreateData = response.rtSessionCreateData;
         }
       });
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
      await this.http.get(
        `${removeTemplateSessionURL01}${token}${removeTemplateSessionURL02}${templateSessionId}${removeTemplateSessionURL03}${patientId}`).toPromise()
       .catch(error => {
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
      await this.http.get<ResponseBasic>(
        `${startSessionFromTemplateSessionURL01}${token}${startSessionFromTemplateSessionURL02}${templateSessionId}${startSessionFromTemplateSessionURL03}${patientId}`).toPromise()
      .then(async response => {
        if (response){
          sessionId = response.result;
        }
      })
      .catch(error => {
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
       await this.http.get<PersonalImageList>(
         `${getImagesByTemplateSessionIdURL01}${token}${getImagesByTemplateSessionIdURL02}${templateSessionId}`)
       .toPromise()
       .then(response => {
         if (response) {
           images = response.images;
         }
       });
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
     await this.http.get<PatientList>(`${getCaregiverPatientsByCaregiverIdURL01}${token}${getCaregiverPatientsByCaregiverIdURL02}${caregiverId}${getCaregiverPatientsByCaregiverIdURL03}${templateSessionId}`).toPromise()
     .then(response => {
       if (response) {
         patients = response.patients.sort((a, b) => (a.name > b.name) ? 1 : -1);
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
     await this.http.post<ResponseBasic>(`${updateCaregiverPatientsByCaregiverIdURL01}${token}${updateCaregiverPatientsByCaregiverIdURL02}${templateSessionId}`,patientList).toPromise()
     .then(async response => {
       if (response){
         rtemplateSessionId = response.result;
       }
     })
    .catch(error => {
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
     await this.http.get<PatientCaregiverList>(`${getCaregiversByTemplateSessionIdURL01}${token}${getCaregiversByTemplateSessionIdURL02}${templateSessionId}${getCaregiversByTemplateSessionIdURL03}${patientId}`).toPromise()
     .then(response => {
       if (response) {
         patientCaregivers = response.caregivers;
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
       await this.http.post<ResponseBasic>(`${updateCaregiversByTemplateSessionIdURL01}${token}${updateCaregiversByTemplateSessionIdURL02}${templateSessionId}`,caregiverList).toPromise()
       .then(async response => {
         if (response){
           rtemplateSessionId = response.result;
         }
       })
      .catch(error => {
        rtemplateSessionId = "";
       });
       return rtemplateSessionId;
     }
   
 }
 