/**
 * @author André Santana - fc49451
 */

 import { HttpClient } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { BehaviorSubject } from 'rxjs';
 import { ResponseBasic } from '../models/response-basic.model';
 import { PatientCaregiverList } from '../models/patient-caregiver-list.model';
 import { PatientCaregiver } from '../models/patient-caregiver.model';
 import { Patient } from '../models/patient.model';
 import { PatientObservation } from '../models/patient-observation.model';
 import { PatientObservationList } from '../models/patient-observation-list.model';
 import { AddPatientObservationData } from '../models/add-patient-observation-data.model';

 //Request URLs
 //const serverURL = "194.117.20.219"
 const serverURL = "localhost"
 const getPatientByIdURL01= `http://${serverURL}:8080/patient?token=`
 const getPatientByIdURL02 = "&patientId="
 const getPatientNameByIdURL01= `http://${serverURL}:8080/patient/name?token=`
 const getPatientNameByIdURL02 = "&patientId="
 const getPatientsCaregiversByIdURL01= `http://${serverURL}:8080/patient/caregivers?token=`
 const getPatientsCaregiversByIdURL02 = "&patientId="
 const updatePatientURL = `http://${serverURL}:8080/patient/update?token=`
 const getObservationsURL01 = `http://${serverURL}:8080/patient/observations?token=`
 const getObservationsURL02 = "&patientId="
 const addObservationURL = `http://${serverURL}:8080/patient/observation?token=`
 const updateObservationURL = `http://${serverURL}:8080/patient/observation/update?token=`
 const deleteObservationURL01 = `http://${serverURL}:8080/patient/observation/delete?token=`
 const deleteObservationURL02 = "&observationId="

  //change to localhost:4200 when testing
 
 @Injectable({
   providedIn: 'root'
 })
 export class PatientService {
 
//Class Constructor
constructor(private http: HttpClient) {
  //Stores the current patient on cache
  this.currentPatient = new BehaviorSubject<Patient | null>(JSON.parse(localStorage.getItem('currentPatient')!));
  this.currentObservation = new BehaviorSubject<PatientObservation | null>(JSON.parse(localStorage.getItem('currentObservation') || 'null'));
}

//Cache variable for the current patient
private currentPatient: BehaviorSubject<Patient | null>;

//Cache variable for the currently selected observation
private currentObservation: BehaviorSubject<PatientObservation | null>;
 
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
    * Gets a patient with given Nif
    * @param token - session ID associated to the
    *                Caregiver who sent the request
    * @param patientId - ID of the patient we want to retrieve
    * @returns Patient associated to the given NIF
    */
   async getPatientById(token: string, patientId: String): Promise<Patient>{
     let patient = null;
     await this.http.get<Patient>(
       `${getPatientByIdURL01}${token}${getPatientByIdURL02}${patientId}`).toPromise()
     .then(async response => {
       if (response){
         patient = response;
       }
     })
     .catch(error => {
       patient = null;
     });
     return patient!;
   }
 
   /**
    * Gets a patient name with given id
    * @param token - session ID associated to the
    *                Caregiver who sent the request
    * @param patientId - ID of the patient we want to retrieve
    * @returns Patient associated to the given id
    */
    async getPatientNameById(token: string, patientId: String): Promise<ResponseBasic>{
     let patient = null;
     await this.http.get<ResponseBasic>(
       `${getPatientNameByIdURL01}${token}${getPatientNameByIdURL02}${patientId}`).toPromise()
     .then(async response => {
       if (response){
         patient = response.result;
       }
     })
     .catch(error => {
       patient = null;
     });
     return patient!;
   }
 
   /**
    * Gets patient associated caregivers with given Nif
    * @param token - token associated to the current caregiver
    *                logged in (permission to execute request)
    * @param patientId - ID of the patient we want to get
    *              patients from
    */
   async getPatientCaregivers(token: string, patientId: String): Promise<PatientCaregiver[]> {
     let caregivers: PatientCaregiver[] = [];
     await this.http.get<PatientCaregiverList>(
       `${getPatientsCaregiversByIdURL01}${token}${getPatientsCaregiversByIdURL02}${patientId}`).toPromise()
     .then(async response => {
       if (response) {
         caregivers = response.caregivers.sort((a, b) => (a.caregiver.name > b.caregiver.name) ? 1 : -1);
       }
     });
     return caregivers;
   }
 
   /**
    * Updates a patient info with given caregiver token
    * and patient new data
    * @param token - current caregiver looged in token
    * @param patient - patient data for the update
    * @returns TRUE if the operation was successfull
    */
   async updatePatient(token: string, patient: Patient): Promise<boolean>{
     let patientUpdated = true;
     await this.http.post(
       `${updatePatientURL}${token}`,patient).toPromise()
     .catch(error => {
       patientUpdated = false;
     });
     return patientUpdated;
   }

   // ─── Current Observation State ────────────────────────────────────────────

   /**
    * Sets the currently selected observation on cache
    * @param observation - observation to save on cache
    */
   setCurrentObservation(observation: PatientObservation): void {
     localStorage.setItem('currentObservation', JSON.stringify(observation));
     this.currentObservation.next(observation);
   }

   /**
    * Resets currently selected observation on cache
    */
   resetCurrentObservation(): void {
     localStorage.removeItem('currentObservation');
     this.currentObservation.next(null);
   }

   /**
    * Gets currently selected observation from cache
    * @returns PatientObservation saved on cache
    */
   getCurrentObservation(): PatientObservation | null {
     return this.currentObservation.value;
   }

   // ─── Observation CRUD ─────────────────────────────────────────────────────

   /**
    * Gets all observations for a given patient
    * @param token - current caregiver token
    * @param patientId - ID of the patient
    * @returns list of observations
    */
   async getPatientObservations(token: string, patientId: string): Promise<PatientObservation[]> {
     let observations: PatientObservation[] = [];
     await this.http.get<PatientObservationList>(
       `${getObservationsURL01}${token}${getObservationsURL02}${patientId}`).toPromise()
     .then(response => {
       if (response) {
         observations = response.observations.sort(
           (a, b) => new Date(b.lastUpdatedDate).getTime() - new Date(a.lastUpdatedDate).getTime()
         );
       }
     });
     return observations;
   }

   /**
    * Adds a new observation for a patient
    * @param token - current caregiver token
    * @param observationData - data for the new observation
    * @returns TRUE if the operation was successful
    */
   async addObservation(token: string, observationData: AddPatientObservationData): Promise<boolean> {
     let added = true;
     await this.http.post(
       `${addObservationURL}${token}`, observationData).toPromise()
     .catch(error => {
       added = false;
     });
     return added;
   }

   /**
    * Updates an existing observation
    * @param token - current caregiver token
    * @param observation - updated observation object
    * @returns TRUE if the operation was successful
    */
   async updateObservation(token: string, observation: PatientObservation): Promise<boolean> {
     let updated = true;
     await this.http.post(
       `${updateObservationURL}${token}`, observation).toPromise()
     .catch(error => {
       updated = false;
     });
     return updated;
   }

   /**
    * Deletes an observation by its ID
    * @param token - current caregiver token
    * @param observationId - ID of the observation to delete
    * @returns TRUE if the operation was successful
    */
   async deleteObservation(token: string, observationId: string): Promise<boolean> {
     let deleted = true;
     await this.http.get(
       `${deleteObservationURL01}${token}${deleteObservationURL02}${observationId}`).toPromise()
     .catch(error => {
       deleted = false;
     });
     return deleted;
   }

 }
 