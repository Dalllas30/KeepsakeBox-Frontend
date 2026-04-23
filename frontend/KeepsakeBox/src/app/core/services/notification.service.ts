/**
 * @author André Santana - fc49451
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CaregiverNotificationList } from '../models/caregiver-notification-list.model';
import { CaregiverNotification } from '../models/caregiver-notification.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {}

  private async getCaregiverByToken(token: string): Promise<any | null> {
    const caregivers = await this.http.get<any[]>(`${environment.apiUrl}/caregivers?token=${token}`).toPromise();
    return caregivers?.[0] ?? null;
  }

  private async getCaregiverByEmail(email: string): Promise<any | null> {
    const caregivers = await this.http.get<any[]>(`${environment.apiUrl}/caregivers?email=${email}`).toPromise();
    return caregivers?.[0] ?? null;
  }

  private async getPatientById(patientId: string): Promise<any | null> {
    return await this.http.get<any>(`${environment.apiUrl}/patients/${patientId}`).toPromise().catch(() => null);
  }

  private async createNotification(notification: Partial<CaregiverNotification>): Promise<boolean> {
    try {
      await this.http.post(`${environment.apiUrl}/notifications`, notification).toPromise();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets all caregiver received and sent notifications pending
   * @param token - session ID associated to the current caregiver
   * @returns list with all notifications received and sent by
   *          the caregiver that are pending.
   */
  async getCaregiverNotifications(token: string): Promise<CaregiverNotification[]> {
    let notifications: CaregiverNotification[] = [];
    const caregiver = await this.getCaregiverByToken(token);
    await this.http.get<any[]>(
      `${environment.apiUrl}/notifications?receiver.id=${caregiver?.id ?? ''}`).toPromise()
    .then(response => {
      if (response) {
        notifications = (Array.isArray(response) ? response : (response as any).notifications ?? [])
                .sort((a: any, b: any) => (a.createdDate < b.createdDate) ? 1 : -1);
      }
    });
    return notifications;
  }

  /**
   * Deletes a notification with given ID
   * @param token - session ID associated to the current caregiver
   * @param notificationId - ID of the notification to be deleted
   */
  async deleteNotification(token: string,
    notificationId: string): Promise<boolean>{
    let deleted = true;
    await this.http.delete(`${environment.apiUrl}/notifications/${notificationId}`)
    .toPromise()
    .catch(error => {
      deleted = false;
    });
    return deleted;
  }

  /**
   * Creates a notification for a patient share
   * @param token - session ID associated to the current caregiver
   * @param receiverEmail - email of the caregiver we want to share patient with
   * @param patientId - ID of the patient to be shared
   * @returns TRUE if notification was added successfully
   */
  async notifySharePatient(token: string,
    receiverEmail: string, patientId: String): Promise<boolean>{
    const sender = await this.getCaregiverByToken(token);
    const receiver = await this.getCaregiverByEmail(receiverEmail);
    const patient = await this.getPatientById(patientId.toString());
    return this.createNotification({ sender, receiver, patient, messageType: 'SHARE_PATIENT', createdDate: new Date() } as any);
  }

  /**
   * Creates a notification when a share is accepted
   * @param token - session ID associated to the current caregiver
   * @param senderEmail - email of the caregiver who sent the
   *                      share request
   * @param patientId - ID of the patient to be shared
   * @returns TRUE if notification was added successfully
   */
  async notifyAcceptSharePatient(token: string,
    senderEmail: string, patientId: String): Promise<boolean>{
    const sender = await this.getCaregiverByEmail(senderEmail);
    const receiver = await this.getCaregiverByToken(token);
    const patient = await this.getPatientById(patientId.toString());
    return this.createNotification({ sender, receiver, patient, messageType: 'ACCEPT_SHARE', createdDate: new Date() } as any);
  }

  /**
   * Creates a notification when a share is denied
   * @param token - session ID associated to the current caregiver
   * @param senderEmail - email of the caregiver who sent the
   *                      share request
   * @param patientId - ID of the patient to be shared
   * @returns TRUE if notification was added successfully
   */
  async notifyDenySharePatient(token: string,
    senderEmail: string, patientId: String): Promise<boolean>{
    const sender = await this.getCaregiverByEmail(senderEmail);
    const receiver = await this.getCaregiverByToken(token);
    const patient = await this.getPatientById(patientId.toString());
    return this.createNotification({ sender, receiver, patient, messageType: 'DENY_SHARE', createdDate: new Date() } as any);
  }

  /**
   * Creates a notification for a primary care transfer
   * @param token - session ID associated to the current caregiver
   * @param receiverEmail - email of the caregiver we want to transfer primary care to
   * @param patientId - ID of the patient to be shared
   * @returns TRUE if notification was added successfully
   */
   async notifyPrimaryCareTransfer(token: string,
    receiverEmail: string, patientId: String): Promise<boolean>{
    const sender = await this.getCaregiverByToken(token);
    const receiver = await this.getCaregiverByEmail(receiverEmail);
    const patient = await this.getPatientById(patientId.toString());
    return this.createNotification({ sender, receiver, patient, messageType: 'PRIMARY_TRANSFER', createdDate: new Date() } as any);
  }

  /**
   * Creates a notification when a primary care is denied
   * @param token - session ID associated to the current caregiver
   * @param senderEmail - email of the caregiver who sent the
   *                      share request
   * @param patientId - ID of the patient to be shared
   * @returns TRUE if notification was added successfully
   */
  async notifyDenyPrimaryCarePatient(token: string, senderEmail: string, patientId: string) {
    const sender = await this.getCaregiverByEmail(senderEmail);
    const receiver = await this.getCaregiverByToken(token);
    const patient = await this.getPatientById(patientId);
    return this.createNotification({ sender, receiver, patient, messageType: 'DENY_PRIMARY_TRANSFER', createdDate: new Date() } as any);
  }

  /**
   * Creates a notification when a primary care is accepted
   * @param token - session ID associated to the current caregiver
   * @param senderEmail - email of the caregiver who sent the
   *                      share request
   * @param patientId - ID of the patient to be shared
   * @returns TRUE if notification was added successfully
   */
  async notifyAcceptPrimaryCarePatient(token: string, senderEmail: string, patientId: string) {
    const sender = await this.getCaregiverByEmail(senderEmail);
    const receiver = await this.getCaregiverByToken(token);
    const patient = await this.getPatientById(patientId);
    return this.createNotification({ sender, receiver, patient, messageType: 'ACCEPT_PRIMARY_TRANSFER', createdDate: new Date() } as any);
  }

  /**
   * Notifies a caregiver that was removed from a patient
   * @param token - primary caregiver token who removed
   * @param receiverEmail - email of the caregiver who was removed
   * @param patientId - ID of the patient where the caregiver was removed
   * @returns TRUE if request was successful
   */
  async notifyRemovedFromPatient(token: string,
    receiverEmail: string, patientId: string) {
      const sender = await this.getCaregiverByToken(token);
      const receiver = await this.getCaregiverByEmail(receiverEmail);
      const patient = await this.getPatientById(patientId);
      return this.createNotification({ sender, receiver, patient, messageType: 'REMOVED_FROM_PATIENT', createdDate: new Date() } as any);
  }

  /**
   * Notifies another caregiver to be the primary caregiver
   * as the primary one wants to leave patient care
   * @param token - token of the caregiver who wants to lead
   * @param receiverEmail - email of the caregiver to become the new primary
   * @param patientId - ID of the patient who wants to 
   */
  async notifyPrimaryLeaveCare(token: string, receiverEmail: string, patientId: string) {
    const sender = await this.getCaregiverByToken(token);
    const receiver = await this.getCaregiverByEmail(receiverEmail);
    const patient = await this.getPatientById(patientId);
    return this.createNotification({ sender, receiver, patient, messageType: 'PRIMARY_LEAVE', createdDate: new Date() } as any);
  }

  /**
   * Notifies a primary caregiver that the request was accepted and he
   * left the patient care
   * @param token - current caregiver token
   * @param senderEmail - caregiver who sent the request to give primary caregiver
   * @param patientId - ID of the patient that will 
   */
  async notifyAcceptPrimaryLeaveCare(token: string, senderEmail: string, patientId: string) {
    const sender = await this.getCaregiverByEmail(senderEmail);
    const receiver = await this.getCaregiverByToken(token);
    const patient = await this.getPatientById(patientId);
    return this.createNotification({ sender, receiver, patient, messageType: 'ACCEPT_PRIMARY_LEAVE', createdDate: new Date() } as any);
  }

  /**
   * Notifies a primary caregiver that the request was denied and he
   * couldn't left the patient care
   * @param token - current caregiver token
   * @param senderEmail - caregiver who sent the request to give primary caregiver
   * @param patientId - ID of the patient that will 
   */
   async notifyDenyPrimaryLeaveCare(token: string, senderEmail: string, patientId: string) {
    const sender = await this.getCaregiverByEmail(senderEmail);
    const receiver = await this.getCaregiverByToken(token);
    const patient = await this.getPatientById(patientId);
    return this.createNotification({ sender, receiver, patient, messageType: 'DENY_PRIMARY_LEAVE', createdDate: new Date() } as any);
  }
}
