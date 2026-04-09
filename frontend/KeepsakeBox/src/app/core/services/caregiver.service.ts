/**
 * @author André Santana - fc49451
 */

 import { HttpClient } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { BehaviorSubject } from 'rxjs';
 import { Caregiver } from '../models/caregiver.model';
 import { CaregiverPatientAssociationData } from '../models/caregiver-patient-association-data.model';
 import { Patient } from '../models/patient.model';
 import { PatientList } from '../models/patient-list.model';
 import { CaregiverPatientRegisterData } from '../models/caregiver-patient-register-data.model';
 import { ResponseBasic } from '../models/response-basic.model';
 import { CaregiverList } from '../models/caregiver-list.model';
 
 //Request URLs
 const serverURL = "194.117.20.219"
// const serverURL = "localhost"
 const getCaregiverURL = `http://${serverURL}:8080/caregiver?token=`
 const getCaregiverPatientsURL01 = `http://${serverURL}:8080/caregiver/patients?token=`
 const getCaregiverPatientsURL02 = "&patientId="
 const addCaregiverPatientURL = `http://${serverURL}:8080/caregiver/patient?token=`
 const sharePatientURL = `http://${serverURL}:8080/caregiver/patient/share?token=`
 const caregiverUpdateURL = `http://${serverURL}:8080/caregiver/update?token=`
 const validatePasswordURL01 = `http://${serverURL}:8080/caregiver/password?token=`
 const validatePasswordURL02 = "&password="
 const changePasswordURL01 = `http://${serverURL}:8080/caregiver/password/update?token=`
 const changePasswordURL02 = "&password="
 const primaryCareTranferURL01 = `http://${serverURL}:8080/caregiver/patient/primary/transfer?token=`
 const primaryCareTranferURL02 = "&oldPrimary="
 const primaryCareTranferURL03 = "&patientId="
 const leavePatientCareURL01 = `http://${serverURL}:8080/caregiver/patient/leave?token=`
 const leavePatientCareURL02 = "&patientId="
 const removeCaregiverFromPatientCareURL01 = `http://${serverURL}:8080/caregiver/patient/leave/forced?token=`
 const removeCaregiverFromPatientCareURL02 = "&caregiverId="
 const removeCaregiverFromPatientCareURL03 = "&patientId="
 const leavePrimaryCare01 = `http://${serverURL}:8080/caregiver/patient/primary/leave?token=`
 const leavePrimaryCare02 = "&caregiverId="
 const leavePrimaryCare03 = "&patientId="
 const getCaregiversURL = `http://${serverURL}:8080/caregiver/list?token=`
 const getCaregiverOutsideURL = `http://${serverURL}:8080/caregiver/outside`
 
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
    * Gets current caregiver token from cache
    * @returns current caregiver logged in
    */
   getCurrentCaregiver(): Caregiver | null {
     return this.currentCaregiver.value;
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
     await this.http.get<Caregiver>(`${getCaregiverURL}${token}`).toPromise()
     .then(response => {
       if (response) {
         var caregiver: Caregiver = response;
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
     await this.http.post<Caregiver>(`${getCaregiverURL}${token}`, caregiverId).toPromise()
     .then(response => {
       if (response) {
         retrievedCareguiver = response;
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
      await this.http.post<Caregiver>(getCaregiverOutsideURL, caregiverId).toPromise()
      .then(response => {
        if (response) {
          retrievedCareguiver = response;
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
     await this.http.get<PatientList>(`${getCaregiverPatientsURL01}${token}`).toPromise()
     .then(response => {
       if (response) {
         patients = response.patients.sort((a, b) => (a.name > b.name) ? 1 : -1);
       }
     });
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
     await this.http.post<PatientList>(`${getCaregiverPatientsURL01}${token}${getCaregiverPatientsURL02}${patientId}`,caregiverId).toPromise()
     .then(response => {
       if (response) {
         patients = response.patients.sort((a, b) => (a.name > b.name) ? 1 : -1);
       }
     });
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
     await this.http.post<ResponseBasic>(
       `${addCaregiverPatientURL}${token}`,caregiverPatientRegisterData).toPromise()
     .then(response => {
       if (response) {
         patientId = response.result;
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
     await this.http.post(
       `${sharePatientURL}${token}`,
       caregiverPatientAssociationData).toPromise()
     .catch(error => {
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
     await this.http.get(
       `${primaryCareTranferURL01}${token}${primaryCareTranferURL02}${oldPrimaryId}${primaryCareTranferURL03}${patientId}`)
     .toPromise()
     .catch(error => {
       primaryCareTranferred = false;
     });
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
     let caregiverUpdated = true;
     await this.http.post(
       `${caregiverUpdateURL}${token}`,
       updatedCaregiver).toPromise()
     .catch(error => {
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
     let validatedPass = true;
     await this.http.get(
       `${validatePasswordURL01}${token}${validatePasswordURL02}${password}`)
     .toPromise()
     .catch(error => {
       validatedPass = false;
     });
     return validatedPass;
   }
 
   /**
    * Changes a password for the caregiver
    * with given token
    * @param token - current caregiver token
    * @param password - new password
    */
   async changePassword(token: string, newPassword: string): Promise<boolean>{
     let changedPass = true;
     await this.http.get(
       `${changePasswordURL01}${token}${changePasswordURL02}${newPassword}`)
     .toPromise()
     .catch(error => {
       changedPass = false;
     });
     return changedPass;
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
     await this.http.get(
       `${leavePatientCareURL01}${token}${leavePatientCareURL02}${patientId}`)
     .toPromise()
     .catch(error => {
       leftCare = false;
     });
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
     await this.http.get(
       `${removeCaregiverFromPatientCareURL01}${token}${removeCaregiverFromPatientCareURL02}${caregiverId}${removeCaregiverFromPatientCareURL03}${patientId}`)
     .toPromise()
     .catch(error => {
       removed = false;
     });
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
     await this.http.get(
       `${leavePrimaryCare01}${token}${leavePrimaryCare02}${caregiverId}${leavePrimaryCare03}${patientId}`)
     .toPromise()
     .catch(error => {
       left = false;
     });
     return left;
   }
 
   /**
    * Gets caregiver list
    * @param token - token associated to the current caregiver
    *                logged in (permission to execute request)
    */
    async getCaregivers(token: string): Promise<Caregiver[]> {
     let caregivers: Caregiver[] = [];
     await this.http.get<CaregiverList>(
       `${getCaregiversURL}${token}`).toPromise()
     .then(async response => {
       if (response) {
         caregivers = response.caregivers;
       }
     });
     return caregivers;
   }
 
 
 }
 