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
 
 //Request URLs
 const serverURL = "194.117.20.219"
 //const serverURL = "localhost"
 const getPatientByIdURL01= `http://${serverURL}:8080/patient?token=`
 const getPatientByIdURL02 = "&patientId="
 const getPatientNameByIdURL01= `http://${serverURL}:8080/patient/name?token=`
 const getPatientNameByIdURL02 = "&patientId="
 const getPatientsCaregiversByIdURL01= `http://${serverURL}:8080/patient/caregivers?token=`
 const getPatientsCaregiversByIdURL02 = "&patientId="
 const updatePatientURL = `http://${serverURL}:8080/patient/update?token=`
 
 @Injectable({
   providedIn: 'root'
 })
 export class PatientService {
 
//Class Constructor
constructor(private http: HttpClient) {
  //Stores the current patient on cache
  this.currentPatient = new BehaviorSubject<Patient | null>(JSON.parse(localStorage.getItem('currentPatient')!));
}

//Cache variable for the current patient
private currentPatient: BehaviorSubject<Patient | null>;
 
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
 
 }
 