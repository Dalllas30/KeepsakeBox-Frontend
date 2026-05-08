/**
 * @author André Santana - fc49451
 */

 import { HttpClient } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { BehaviorSubject, Observable } from 'rxjs';
 import { Caregiver } from '../models/caregiver.model';
 import { CaregiverPatientAssociationData } from '../models/caregiver-patient-association-data.model';
 import { Patient } from '../models/patient.model';
 import { PatientList } from '../models/patient-list.model';
 import { CaregiverPatientRegisterData } from '../models/caregiver-patient-register-data.model';
 import { ResponseBasic } from '../models/response-basic.model';
 import { CaregiverList } from '../models/caregiver-list.model';
 import { environment } from '../../../environments/environment';
 
 const apiUrl = environment.apiUrl;
 
 @Injectable({
   providedIn: 'root'
 })
 export class CaregiverService {
   
   //Cache variable for the current caregiver
   private currentCaregiver: BehaviorSubject<Caregiver | null>;
 
   //Cache variable for a selected caregiver
   private selectedCaregiver: BehaviorSubject<Caregiver | null>;
 
   //Class Constructor
   constructor(private http: HttpClient) {
     //Stores the current caregiver token on cache
     this.currentCaregiver = new BehaviorSubject<Caregiver | null>(JSON.parse(localStorage.getItem('currentCaregiver') || 'null'));
     this.selectedCaregiver = new BehaviorSubject<Caregiver | null>(JSON.parse(localStorage.getItem('selectedCaregiver') || 'null'));
   }

   private normalizeCaregiver(caregiver: any): Caregiver {
     return {
       ...caregiver,
       profileImageURL: caregiver.profileImageURL ?? caregiver.profileImage ?? '/assets/profileimage-default.png',
       type: caregiver.type ?? caregiver.caregiverType ?? '',
       isActive: caregiver.isActive ?? true
     } as Caregiver;
   }

   private async getCaregiverByToken(token: string): Promise<Caregiver | null> {
     const caregivers = await this.http.get<any[]>(`${apiUrl}/caregivers?token=${token}`).toPromise();
     return caregivers?.[0] ? this.normalizeCaregiver(caregivers[0]) : null;
   }

   private async getPatientCaregivers(): Promise<any[]> {
     return await this.http.get<any[]>(`${apiUrl}/patientCaregivers`).toPromise().then(response => response ?? []);
   }

   private async getPatients(): Promise<any[]> {
     return await this.http.get<any[]>(`${apiUrl}/patients`).toPromise().then(response => response ?? []);
   }
 
   /**
    * Sets the current caregiver on cache
    * @param caregiver - caregiver to store on cache
    */
   setCurrentCaregiver(caregiver: Caregiver): void {
     localStorage.setItem('currentCaregiver', JSON.stringify(caregiver));
     this.currentCaregiver.next(caregiver);
   }
 
   /**
    * Resets current caregiver on cache
    */
   resetCurrentCaregiver(): void {
     localStorage.removeItem('currentCaregiver');
     this.currentCaregiver.next(null);
   }
 
   /**
    * Gets current caregiver token from cache
    * @returns current caregiver logged in
    */
   getSelectedCaregiver(): Caregiver | null {
     return this.selectedCaregiver.value;
   }
 
   /**
    * Sets the selected caregiver on cache
    * @param caregiver - caregiver to store on cache
    */
    setSelectedCaregiver(caregiver: Caregiver): void {
     localStorage.setItem('selectedCaregiver', JSON.stringify(caregiver));
     this.selectedCaregiver.next(caregiver);
   }
 
   /**
    * Resets selected caregiver on cache
    */
   resetSelectedCaregiver(): void {
     localStorage.removeItem('selectedCaregiver');
     this.selectedCaregiver.next(null);
   }
 
   /**
    * Gets current caregiver token from cache (point-in-time snapshot).
    * Prefer getCurrentCaregiver$() when the value may change during the session.
    * @returns current caregiver logged in
    */
   getCurrentCaregiver(): Caregiver | null {
     return this.currentCaregiver.value;
   }

   /**
    * Returns an Observable that emits the current caregiver and every
    * subsequent update (type change, profile edit, colour theme, etc.).
    * Subscribe to this instead of getCurrentCaregiver() whenever the
    * component needs to stay in sync for its entire lifetime.
    */
   getCurrentCaregiver$(): Observable<Caregiver | null> {
     return this.currentCaregiver.asObservable();
   }
 
   /**
    * Gets a Caregiver with a session ID token
    * @param token - session ID associated to the
    *                Caregiver we want to retrieve
    * @returns Caregiver associated to token/sessionID
    */
   async getCaregiver(token: string): Promise<boolean>{
     let caregiverRetrieved = true;
     await this.resetCurrentCaregiver();
     await this.getCaregiverByToken(token).then(caregiver => {
       if (caregiver) {
         this.setCurrentCaregiver(caregiver);
       }
     }).catch(error => {
       caregiverRetrieved = false;
     });
     return caregiverRetrieved;
   }
 
   /**
    * Gets a Caregiver with a session ID token
    * @param token - session ID associated to the
    *                Caregiver we want to retrieve
    * @returns Caregiver associated to token/sessionID
    */
    async getCaregiverById(token: string, caregiverId: string): Promise<Caregiver | null >{
     var retrievedCareguiver: Caregiver | null = null;
     await this.http.get<Caregiver>(`${apiUrl}/caregivers/${caregiverId}`).toPromise().then(response => {
       if (response) {
         retrievedCareguiver = this.normalizeCaregiver(response);
       }
     });
     return retrievedCareguiver;
   }

   /**
    * Gets a Caregiver with a session ID token
    * @param token - session ID associated to the
    *                Caregiver we want to retrieve
    * @returns Caregiver associated to token/sessionID
    */
    async getCaregiverOutsideById(caregiverId: string): Promise<Caregiver | null>{
      var retrievedCareguiver: Caregiver | null = null;
      await this.http.get<Caregiver>(`${apiUrl}/caregivers/${caregiverId}`).toPromise().then(response => {
        if (response) {
          retrievedCareguiver = this.normalizeCaregiver(response);
        }
      });
      return retrievedCareguiver;
    }
 
   /**
    * Gets all caregiver patients with current session token
    * @param token - session ID associated to the current caregiver
    * @returns List of all patients associated to the current caregiver
    */
   async getCaregiverPatients(token: string): Promise<Patient[] | null> {
     let patients: Patient[] | null = null;
     const caregiver = await this.getCaregiverByToken(token);
     const caregiverId = caregiver?.id ?? localStorage.getItem('currentCaregiverId');
     try {
       // Fetch all patientCaregivers records for this caregiver (covers both primary and secondary)
       const patientCaregiverRecords = await this.http.get<any[]>(`${apiUrl}/patientCaregivers?caregiverId=${caregiverId}`).toPromise() ?? [];
       const patientIds = [...new Set(patientCaregiverRecords.map((r: any) => r.patientId?.toString()).filter(Boolean))];

       // Fetch each associated patient by ID
       const fetched = (await Promise.all(
         patientIds.map(id => this.http.get<Patient>(`${apiUrl}/patients/${id}`).toPromise().catch(() => null))
       )).filter(Boolean) as Patient[];

       // Also fetch patients where this caregiver is the primary (safety net for any missing patientCaregivers records)
       const primary = await this.http.get<Patient[]>(`${apiUrl}/patients?caregiverId=${caregiverId}`).toPromise() ?? [];
       for (const p of primary) {
         if (!fetched.find(existing => existing.id?.toString() === p.id?.toString())) {
           fetched.push(p);
         }
       }

       patients = fetched.sort((a, b) => (a.name > b.name) ? 1 : -1);
     } catch {
       patients = [];
     }
     return patients;
   }
 
   /**
    * Gets all caregiver patients with current session token
    * @param token - session ID associated to the current caregiver
    * @param caregiverId - a selected caregiver 
    * @returns List of all patients associated to the selected caregiver
    */
   async getCaregiverPatientsByCaregiverId(token: string, caregiverId: string, patientId: string): Promise<Patient[]> {
     let patients: Patient[] = [];
     const allPatients = await this.getPatients();
     patients = allPatients
       .filter((patient: any) => patient.caregiverId?.toString() === caregiverId.toString())
       .filter((patient: any) => !patientId || patientId === 'all' || patient.id?.toString() === patientId.toString())
       .sort((a, b) => (a.name > b.name) ? 1 : -1);
     return patients;
   }
   
   /**
    * Adds a new patient into the application and
    * associates to the current caregiver
    * @param token - session ID associated to the current caregiver
    *                we want to associate to patient as primary caregiver
    * @param caregiverPatientRegisterData - all data needed to execute the request
    * @returns TRUE if patient was added and associated successfully
    */
   async addPatient(token: string,
     caregiverPatientRegisterData: CaregiverPatientRegisterData): Promise<String | null>{
     let patientId = null;
     const caregiverId = this.currentCaregiver.value?.id;
     const patientPayload = {
       ...caregiverPatientRegisterData.patient,
       profileImageURL: caregiverPatientRegisterData.patient.profileImageURL || '/assets/profileimage-default.png',
       caregiverId: caregiverId ?? null,
       patientRelation: caregiverPatientRegisterData.patientRelation,
       isActive: true
     };
     await this.http.post<any>(`${apiUrl}/patients`, patientPayload).toPromise()
     .then(async response => {
       if (response) {
         patientId = response.id as any;
         const caregiver = this.currentCaregiver.value;
         if (caregiver) {
           await this.http.post(`${apiUrl}/patientCaregivers`, {
             patientId: response.id,
             caregiver,
             caregiverId: caregiver.id,
             isPrimary: true,
             patientRelation: caregiverPatientRegisterData.patientRelation
           }).toPromise();
         }
       }
     })
     .catch(error => {
       patientId = null;
     });
     return patientId;
   }
 
   /**
    * Shares an existing Patient with another caregiver
    * @param token - session ID associated to the current caregiver
    *                we want to associate to patient as primary caregiver
    * @param caregiverPatientAssociationData - all data needed to execute the request
    * @returns TRUE if patient was shared successfully
    */
   async sharePatient(token: string,
     caregiverPatientAssociationData: CaregiverPatientAssociationData): Promise<boolean>{
     let patientShared = true;
     const caregiver = await this.http.get<any>(`${apiUrl}/caregivers/${caregiverPatientAssociationData.caregiverId}`).toPromise().catch(() => null);
     const patient = await this.http.get<any>(`${apiUrl}/patients/${caregiverPatientAssociationData.patientId}`).toPromise().catch(() => null);
     await this.http.post(`${apiUrl}/patientCaregivers`, {
       patientId: caregiverPatientAssociationData.patientId,
       caregiver,
       caregiverId: caregiverPatientAssociationData.caregiverId,
       isPrimary: false,
       patientRelation: caregiverPatientAssociationData.patientRelation,
       patient
     }).toPromise().catch(error => {
       patientShared = false;
     });
     return patientShared;
   }
 
   /**
    * Transfers a primary care to the given caregiver
    * for the given patient ID
    * @param token - caregiver to assign as primary
    * @param oldPrimaryId - old primary caregiver ID
    * @param patientId - ID of the patient which to have
    *                    another caregiver assigned
    * @returns TRUE if the request was successful
    */
   async newPrimaryCaregiver(token: string, oldPrimaryId: string, patientId: string): Promise<boolean> {
     let primaryCareTranferred = true;
     const currentCaregiver = await this.getCaregiverByToken(token);
     const patientCaregivers = await this.getPatientCaregivers();
     const existingPrimary = patientCaregivers.find((record: any) => record.patientId?.toString() === patientId.toString() && record.caregiver?.id?.toString() === oldPrimaryId.toString());
     const currentRecord = patientCaregivers.find((record: any) => record.patientId?.toString() === patientId.toString() && record.caregiver?.id?.toString() === currentCaregiver?.id?.toString());
     if (existingPrimary?.id) {
       await this.http.patch(`${apiUrl}/patientCaregivers/${existingPrimary.id}`, { ...existingPrimary, isPrimary: false }).toPromise().catch(() => primaryCareTranferred = false);
     }
     if (currentCaregiver) {
       if (currentRecord?.id) {
         await this.http.patch(`${apiUrl}/patientCaregivers/${currentRecord.id}`, { ...currentRecord, isPrimary: true }).toPromise().catch(() => primaryCareTranferred = false);
       } else {
         await this.http.post(`${apiUrl}/patientCaregivers`, { patientId, caregiver: currentCaregiver, caregiverId: currentCaregiver.id, isPrimary: true, patientRelation: '' }).toPromise().catch(() => primaryCareTranferred = false);
       }
     }
     return primaryCareTranferred;
   }
 
   /**
    * Updates a caregiver with given data
    * @param token - session ID associated to the current caregiver
    *                we want to update
    * @param updatedCaregiver - updated caregiver data
    * @returns TRUE if caregiver was successfully updated
    */
   async caregiverUpdate(token: string,
     updatedCaregiver: Caregiver): Promise<boolean>{
     // Fetch the raw db record first and PATCH it to avoid destructive
     // replacements that can drop fields (token, password, legacy keys, etc.).
     const caregivers = await this.http.get<any[]>(`${apiUrl}/caregivers?token=${token}`).toPromise().catch(() => null);
     const existing = caregivers?.[0];
     if (!existing) return false;

     const payload = {
       name:            updatedCaregiver.name,
       email:           updatedCaregiver.email,
       phone:           updatedCaregiver.phone,
       birthDate:       updatedCaregiver.birthDate,
       // Keep both naming variants so old and new readers remain compatible.
       profileImage:    updatedCaregiver.profileImageURL,
       profileImageURL: updatedCaregiver.profileImageURL,
       caregiverType:   updatedCaregiver.type || existing.caregiverType || existing.type || '',
       type:            updatedCaregiver.type || existing.type || existing.caregiverType || '',
       speciality:      updatedCaregiver.speciality ?? existing.speciality ?? '',
       isActive:        updatedCaregiver.isActive ?? existing.isActive,
     };

     let caregiverUpdated = true;
     await this.http.patch(`${apiUrl}/caregivers/${existing.id}`, payload).toPromise().catch(() => {
       caregiverUpdated = false;
     });
     return caregiverUpdated;
   }
 
   /**
    * Validates a password for the caregiver
    * with given token
    * @param token - current caregiver token
    * @param password - password to validate
    */
   async validatePassword(token: string, password: string): Promise<boolean>{
     const caregiver = await this.getCaregiverByToken(token);
     return (caregiver as any)?.password === password;
   }
 
   /**
    * Changes a password for the caregiver
    * with given token
    * @param token - current caregiver token
    * @param password - new password
    */
   async changePassword(token: string, newPassword: string): Promise<boolean>{
     const caregiver = await this.getCaregiverByToken(token);
     if (!caregiver?.id) {
       return false;
     }
     await this.http.patch(`${apiUrl}/caregivers/${caregiver.id}`, { password: newPassword }).toPromise().catch(() => false);
     return true;
   }
 
   /**
    * Leaves a patient care by the caregiver with given token
    * for the patient with given ID
    * @param token - token of the caregiver who wants to leave care
    * @param patientId - ID of the patient caregiver wants to leave care
    * @returns TRUE if request was successful
    */
   async leavePatientCare(token: string, patientId: string) {
     let leftCare = true;
     const caregiver = await this.getCaregiverByToken(token);
     const patientCaregivers = await this.getPatientCaregivers();
     const record = patientCaregivers.find((entry: any) => entry.patientId?.toString() === patientId.toString() && entry.caregiver?.id?.toString() === caregiver?.id?.toString());
     if (record?.id) {
       await this.http.delete(`${apiUrl}/patientCaregivers/${record.id}`).toPromise().catch(() => leftCare = false);
     }
     if (caregiver?.id) {
       const patient = await this.http.get<any>(`${apiUrl}/patients/${patientId}`).toPromise().catch(() => null);
       if (patient && patient.caregiverId?.toString() === caregiver.id.toString()) {
         await this.http.patch(`${apiUrl}/patients/${patientId}`, {
           caregiverId: null,
           patientRelation: ''
         }).toPromise().catch(() => leftCare = false);
       }
     }
     return leftCare;
   }
 
   /**
    * Removes a caregiver from a patient care (by primary caregiver)
    * @param token - associated to the primary caregiver
    * @param caregiverId - ID of the caregiver to remove
    * @param patientId - ID of the patient to be removed from that patient
    * @returns TRUE if request was successful
    */
   async removeCaregiverFromPatientCare(token: string, caregiverId: string, patientId: string) {
     let removed = true;
     const patientCaregivers = await this.getPatientCaregivers();
     const record = patientCaregivers.find((entry: any) => entry.patientId?.toString() === patientId.toString() && entry.caregiver?.id?.toString() === caregiverId.toString());
     if (record?.id) {
       await this.http.delete(`${apiUrl}/patientCaregivers/${record.id}`).toPromise().catch(() => removed = false);
     }
     const patient = await this.http.get<any>(`${apiUrl}/patients/${patientId}`).toPromise().catch(() => null);
     if (patient && patient.caregiverId?.toString() === caregiverId.toString()) {
       await this.http.patch(`${apiUrl}/patients/${patientId}`, {
         caregiverId: null,
         patientRelation: ''
       }).toPromise().catch(() => removed = false);
     }
     return removed;
   }
 
   /**
    * Removes a primary caregiver from a patient care and sets the current
    * one as primary
    * @param token - current caregiver token
    * @param caregiverId - ID of the caregiver to remove
    * @param patientId - ID of the patient where the action
    *                    will be executed
    * @returns TRUE if the request successful
    */
   async leavePrimaryCare(token: string, caregiverId: string, patientId: string) {
     let left = true;
     const currentCaregiver = await this.getCaregiverByToken(token);
     const patientCaregivers = await this.getPatientCaregivers();
     const currentRecord = patientCaregivers.find((entry: any) => entry.patientId?.toString() === patientId.toString() && entry.caregiver?.id?.toString() === currentCaregiver?.id?.toString());
     const oldPrimaryRecord = patientCaregivers.find((entry: any) => entry.patientId?.toString() === patientId.toString() && entry.caregiver?.id?.toString() === caregiverId.toString());
     if (oldPrimaryRecord?.id) {
       await this.http.patch(`${apiUrl}/patientCaregivers/${oldPrimaryRecord.id}`, { ...oldPrimaryRecord, isPrimary: false }).toPromise().catch(() => left = false);
     }
     if (currentCaregiver) {
       if (currentRecord?.id) {
         await this.http.patch(`${apiUrl}/patientCaregivers/${currentRecord.id}`, { ...currentRecord, isPrimary: true }).toPromise().catch(() => left = false);
       } else {
         await this.http.post(`${apiUrl}/patientCaregivers`, { patientId, caregiver: currentCaregiver, caregiverId: currentCaregiver.id, isPrimary: true, patientRelation: '' }).toPromise().catch(() => left = false);
       }
     }
     return left;
   }
 
   /**
    * Gets caregiver list
    * @param token - token associated to the current caregiver
    *                logged in (permission to execute request)
    */
    async getCaregivers(token: string): Promise<Caregiver[]> {
     let caregivers: Caregiver[] = [];
     await this.http.get<Caregiver[]>(`${apiUrl}/caregivers`).toPromise()
     .then(async response => {
       if (response) {
         caregivers = response.map(caregiver => this.normalizeCaregiver(caregiver));
       }
     });
     return caregivers;
   }
 
 
 }
 