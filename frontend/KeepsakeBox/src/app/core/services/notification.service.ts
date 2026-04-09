/**
 * @author André Santana - fc49451
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CaregiverNotificationList } from '../models/caregiver-notification-list.model';
import { CaregiverNotification } from '../models/caregiver-notification.model';

//Request URLs
//const serverURL = "194.117.20.219"
const serverURL = "localhost"
const getCaregiverNotificationsURL = `http://${serverURL}:8080/caregiver/notifications?token=`
const notifySharePatientURL01 = `http://${serverURL}:8080/caregiver/notify/share?token=`
const notifySharePatientURL02 = "&receiverEmail="
const notifySharePatientURL03 = "&patientId="
const notifyAcceptedSharePatientURL01 = `http://${serverURL}:8080/caregiver/notify/share/accept?token=`
const notifyAcceptedSharePatientURL02 = "&senderEmail="
const notifyAcceptedSharePatientURL03 = "&patientId="
const notifyDeniedSharePatientURL01 = `http://${serverURL}:8080/caregiver/notify/share/deny?token=`
const notifyDeniedSharePatientURL02 = "&senderEmail="
const notifyDeniedSharePatientURL03 = "&patientId="
const deleteNotificationURL01 = `http://${serverURL}:8080/caregiver/notification/delete?token=`
const deleteNotificationURL02 = "&notificationId="
const notifyPrimaryCareTransferURL01 = `http://${serverURL}:8080/caregiver/notify/primary/transfer?token=`
const notifyPrimaryCareTransferURL02 = "&receiverEmail="
const notifyPrimaryCareTransferURL03 = "&patientId="
const notifyDeniedPrimaryCareURL01 = `http://${serverURL}:8080/caregiver/notify/primary/deny?token=`
const notifyDeniedPrimaryCareURL02 = "&senderEmail="
const notifyDeniedPrimaryCareURL03 = "&patientId="
const notifyAcceptedPrimaryCareURL01 = `http://${serverURL}:8080/caregiver/notify/primary/accept?token=`
const notifyAcceptedPrimaryCareURL02 = "&senderEmail="
const notifyAcceptedPrimaryCareURL03 = "&patientId="
const notifyRemovedFromCaregiver01 = `http://${serverURL}:8080/caregiver/notify/caregiver/removed?token=`
const notifyRemovedFromCaregiver02 = "&receiverEmail="
const notifyRemovedFromCaregiver03 = "&patientId="
const notifyPrimaryLeaveCare01 = `http://${serverURL}:8080/caregiver/notify/primary/leave?token=`
const notifyPrimaryLeaveCare02 = "&receiverEmail="
const notifyPrimaryLeaveCare03 = "&patientId="
const notifyAcceptedPrimaryLeaveCare01 = `http://${serverURL}:8080/caregiver/notify/primary/leave/accept?token=`
const notifyAcceptedPrimaryLeaveCare02 = "&senderEmail="
const notifyAcceptedPrimaryLeaveCare03 = "&patientId="
const notifyDeniedPrimaryLeaveCare01 = `http://${serverURL}:8080/caregiver/notify/primary/leave/deny?token=`
const notifyDeniedPrimaryLeaveCare02 = "&senderEmail="
const notifyDeniedPrimaryLeaveCare03 = "&patientId="

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {}

  /**
   * Gets all caregiver received and sent notifications pending
   * @param token - session ID associated to the current caregiver
   * @returns list with all notifications received and sent by
   *          the caregiver that are pending.
   */
  async getCaregiverNotifications(token: string): Promise<CaregiverNotification[]> {
    let notifications: CaregiverNotification[] = [];
    await this.http.get<CaregiverNotificationList>(
      `${getCaregiverNotificationsURL}${token}`).toPromise()
    .then(response => {
      if (response) {
        notifications = response.notifications
                .sort((a, b) => (a.createdDate < b.createdDate) ? 1 : -1);
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
    await this.http.get(
      `${deleteNotificationURL01}${token}${deleteNotificationURL02}${notificationId}`)
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
    let notified = true;
    await this.http.get(
      `${notifySharePatientURL01}${token}${notifySharePatientURL02}${receiverEmail}${notifySharePatientURL03}${patientId}`)
    .toPromise()
    .catch(error => {
      notified = false;
    });
    return notified;
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
    let notified = true;
    await this.http.get(
      `${notifyAcceptedSharePatientURL01}${token}${notifyAcceptedSharePatientURL02}${senderEmail}${notifyAcceptedSharePatientURL03}${patientId}`)
    .toPromise()
    .catch(error => {
      notified = false;
    });
    return notified;
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
    let notified = true;
    await this.http.get(
      `${notifyDeniedSharePatientURL01}${token}${notifyDeniedSharePatientURL02}${senderEmail}${notifyDeniedSharePatientURL03}${patientId}`)
    .toPromise()
    .catch(error => {
      notified = false;
    });
    return notified;
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
    let notified = true;
    await this.http.get(
      `${notifyPrimaryCareTransferURL01}${token}${notifyPrimaryCareTransferURL02}${receiverEmail}${notifyPrimaryCareTransferURL03}${patientId}`)
    .toPromise()
    .catch(error => {
      notified = false;
    });
    return notified;
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
    let notified = true;
    await this.http.get(
      `${notifyDeniedPrimaryCareURL01}${token}${notifyDeniedPrimaryCareURL02}${senderEmail}${notifyDeniedPrimaryCareURL03}${patientId}`)
    .toPromise()
    .catch(error => {
      notified = false;
    });
    return notified;
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
    let notified = true;
    await this.http.get(
      `${notifyAcceptedPrimaryCareURL01}${token}${notifyAcceptedPrimaryCareURL02}${senderEmail}${notifyAcceptedPrimaryCareURL03}${patientId}`)
    .toPromise()
    .catch(error => {
      notified = false;
    });
    return notified;
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
      let notified = true;
      await this.http.get(
        `${notifyRemovedFromCaregiver01}${token}${notifyRemovedFromCaregiver02}${receiverEmail}${notifyRemovedFromCaregiver03}${patientId}`)
      .toPromise()
      .catch(error => {
        notified = false;
      });
      return notified;
  }

  /**
   * Notifies another caregiver to be the primary caregiver
   * as the primary one wants to leave patient care
   * @param token - token of the caregiver who wants to lead
   * @param receiverEmail - email of the caregiver to become the new primary
   * @param patientId - ID of the patient who wants to 
   */
  async notifyPrimaryLeaveCare(token: string, receiverEmail: string, patientId: string) {
    let notified = true;
    await this.http.get(
      `${notifyPrimaryLeaveCare01}${token}${notifyPrimaryLeaveCare02}${receiverEmail}${notifyPrimaryLeaveCare03}${patientId}`)
    .toPromise()
    .catch(error => {
      notified = false;
    });
    return notified;
  }

  /**
   * Notifies a primary caregiver that the request was accepted and he
   * left the patient care
   * @param token - current caregiver token
   * @param senderEmail - caregiver who sent the request to give primary caregiver
   * @param patientId - ID of the patient that will 
   */
  async notifyAcceptPrimaryLeaveCare(token: string, senderEmail: string, patientId: string) {
    let notified = true;
    await this.http.get(
      `${notifyAcceptedPrimaryLeaveCare01}${token}${notifyAcceptedPrimaryLeaveCare02}${senderEmail}${notifyAcceptedPrimaryLeaveCare03}${patientId}`)
    .toPromise()
    .catch(error => {
      notified = false;
    });
    return notified;
  }

  /**
   * Notifies a primary caregiver that the request was denied and he
   * couldn't left the patient care
   * @param token - current caregiver token
   * @param senderEmail - caregiver who sent the request to give primary caregiver
   * @param patientId - ID of the patient that will 
   */
   async notifyDenyPrimaryLeaveCare(token: string, senderEmail: string, patientId: string) {
    let notified = true;
    await this.http.get(
      `${notifyDeniedPrimaryLeaveCare01}${token}${notifyDeniedPrimaryLeaveCare02}${senderEmail}${notifyDeniedPrimaryLeaveCare03}${patientId}`)
    .toPromise()
    .catch(error => {
      notified = false;
    });
    return notified;
  }
}
