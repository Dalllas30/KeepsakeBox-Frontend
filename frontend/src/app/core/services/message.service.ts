/**
 * @author André Santana - fc49451
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CaregiverLastMessageRead } from '../models/caregiver-last-message-read.model';
import { CaregiverPatientChatList } from '../models/caregiver-patient-chat-list.model';
import { CaregiverPatientChat } from '../models/caregiver-patient-chat.model';
import { PatientChatMessageList } from '../models/patient-chat-message-list.model';
import { PatientChatMessage } from '../models/patient-chat-message.model';
import { environment } from '../../../environments/environment';
import { PatientChatMessageData } from '../models/patient-chat-message-data.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  //Service constructor
  constructor(private http: HttpClient) {}

  private async getCurrentCaregiverId(): Promise<string | null> {
    const token = localStorage.getItem('currentCaregiverToken');
    if (!token) {
      return localStorage.getItem('currentCaregiverId');
    }
    const caregivers = await this.http.get<any[]>(`${environment.apiUrl}/caregivers?token=${token}`).toPromise();
    return caregivers?.[0]?.id?.toString() ?? localStorage.getItem('currentCaregiverId');
  }

  /**
   * Gets all chats of patients associated to the
   * current caregiver
   * @param token - session ID associated to the current caregiver
   *                we want to update
   * @returns a list with all chats associated to patients that are
   *          associated to the current caregiver
   */
  async getCaregiverPatientChats(token: string): Promise<CaregiverPatientChat[]> {
    let chats: CaregiverPatientChat[] = [];
    const caregiverId = await this.getCurrentCaregiverId();
    await this.http.get<CaregiverPatientChatList>(`${environment.apiUrl}/chats?caregiverId=${caregiverId ?? ''}`).toPromise()
    .then(response => {
      if (response) {
        chats = (Array.isArray(response) ? response : (response as any).chats ?? [])
                .sort((a: CaregiverPatientChat, b: CaregiverPatientChat) => (a.chat.lastMessageSentDate < b.chat.lastMessageSentDate) ? 1 : -1);
      }
    });
    return chats;
  }

  /**
	 * Gets all messages associated to a patient chat that are associated to
	 * the current logged caregiver
	 * @param token - session token associated to the
        * 				  caregiver logged in
	 * @param chatId - ID of the chat we want to retrieve messages from
	 * @returns all messages of the patient chat with given ID associated to
	 * 		      to the current caregiver
	 */
  async getPatientChatMessages(token: string, chatId: string): Promise<PatientChatMessage[]> {
    let messages: PatientChatMessage[] = [];
    await this.http.get<PatientChatMessageList>(
      `${environment.apiUrl}/messages?chatId=${chatId}`).toPromise()
    .then(response => {
      if (response) {
        messages = (Array.isArray(response) ? response : (response as any).messages ?? [])
                      .sort((a: PatientChatMessage, b: PatientChatMessage) => (a.createdDate > b.createdDate) ? 1 : -1);
      }
    });
    return messages;
  }

  /**
   * Updates last message read date for caregiver with given ID for chat with
   * given ID
   * @param token - session ID associated to the current caregiver
   *                we want to update
   * @param caregiverId - ID of the caregiver we want to update last message read
   * @param chatId - ID of the chat caregiver read
   * @param lastReadDate - last read date for the update
   */
  updateLastMessageReadDate(token: string, caregiverId: string, chatId: string, lastReadDate: Date): void {
    // Update the chats table
    this.http.patch(`${environment.apiUrl}/chats/${chatId}`, {
      lastMessageReadDate: lastReadDate,
      caregiverId
    }).subscribe();

    // Also update the patient's embedded chat object so the patient list badge clears.
    // The patient list reads p.chat.lastMessageReadDate directly from the patients table,
    // not from the chats table, so both copies must be kept in sync.
    this.http.get<any[]>(`${environment.apiUrl}/patients?chat.id=${chatId}`)
      .toPromise()
      .then(patients => {
        const patient = patients?.[0];
        if (patient?.chat) {
          this.http.patch(`${environment.apiUrl}/patients/${patient.id}`, {
            chat: { ...patient.chat, lastMessageReadDate: lastReadDate }
          }).subscribe();
        }
      })
      .catch(() => {});
  }

  /**
   * Sends a message via REST (used in mock/dev mode when no WebSocket is available).
   * Also bumps the chat's lastMessageSentDate so the chat list stays sorted.
   */
  async sendMessageRest(
    token: string,
    chatId: string,
    messageData: PatientChatMessageData
  ): Promise<PatientChatMessage | null> {
    // Resolve sender details from the token
    const caregivers = await this.http
      .get<any[]>(`${environment.apiUrl}/caregivers?token=${token}`)
      .toPromise().catch(() => null);
    const sender = caregivers?.[0] ?? null;

    const payload = {
      chatId,
      createdBy: {
        id:    sender?.id?.toString()  ?? messageData.createdById,
        name:  sender?.name            ?? '',
        email: sender?.email           ?? ''
      },
      message:     messageData.message,
      createdDate: messageData.createdDate ?? new Date()
    };

    const created = await this.http
      .post<PatientChatMessage>(`${environment.apiUrl}/messages`, payload)
      .toPromise().catch(() => null);

    // Keep the chats table in sync (used for chat-list sorting).
    // NOTE: we intentionally do NOT patch the patient's embedded chat here.
    // updateLastMessageReadDate (called via onMessagesSentChanged right after this)
    // is the sole writer to patients.chat — having two concurrent GET+PATCH writers
    // on the same record caused json-server file corruption.
    if (created) {
      this.http
        .patch(`${environment.apiUrl}/chats/${chatId}`, { lastMessageSentDate: payload.createdDate })
        .subscribe();
    }

    return created ?? null;
  }
}