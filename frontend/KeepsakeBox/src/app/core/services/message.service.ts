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
    this.http.patch(`${environment.apiUrl}/chats/${chatId}`, {
      lastMessageReadDate: lastReadDate,
      caregiverId
    }).subscribe();
  }
}
