import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
// import { Stomp } from '@stomp/stompjs';
// import * as SockJS from 'sockjs-client';

import { Caregiver } from '../../../core/models/caregiver.model';
import { Patient } from '../../../core/models/patient.model';
import { PatientChatMessageData } from '../../../core/models/patient-chat-message-data.model';
import { PatientChatMessage } from '../../../core/models/patient-chat-message.model';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { MessageService } from '../../../core/services/message.service';
import { PatientService } from '../../../core/services/patient.service';

const serverURL = "localhost";

@Component({
  selector: 'app-patient-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './patient-messages.component.html',
  styleUrls: ['./patient-messages.component.css']
})
export class PatientMessagesComponent implements OnInit, AfterViewInit {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public currentPatient!: Patient;
  public currentCaregiver!: Caregiver;
  public loadingMessages!: boolean;
  public messages!: PatientChatMessage[];
  public oldMessages!: PatientChatMessage[];
  public newMessages!: PatientChatMessage[];
  public messageToSend!: PatientChatMessageData;

  @ViewChild('messagesDiv', { static: false }) private messagingDiv!: ElementRef;
  @ViewChildren('messages') messagesSent!: QueryList<any>;

  private scrollContainer: any;
  private stompClient: any = null;

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private patientService: PatientService,
    private caregiverService: CaregiverService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentPatient = await this.patientService.getCurrentPatient()!;
    this.retrieveChatMessages();
    this.currentCaregiver = await this.caregiverService.getCurrentCaregiver()!;
    this.messageService.updateLastMessageReadDate(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.currentCaregiver.id,
      this.currentPatient.chat.id,
      new Date()
    );
    this.messageToSend = new PatientChatMessageData(this.currentCaregiver.id, "", new Date());
    this.connect();
  }

  ngAfterViewInit(): void {
    this.scrollContainer = this.messagingDiv.nativeElement;
    this.scrollMessagesToBottomFast();
    this.messagesSent.changes.subscribe(_ => this.onMessagesSentChanged());
  }

  async retrieveChatMessages(): Promise<void> {
    this.loadingMessages = true;
    this.messages = await this.messageService.getPatientChatMessages(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.currentPatient.chat.id
    );
    this.loadingMessages = false;
    this.oldMessages = this.messages.filter(m => m.createdDate < this.currentPatient.chat.lastMessageReadDate);
    this.newMessages = this.messages.filter(m => m.createdDate >= this.currentPatient.chat.lastMessageReadDate);
  }

  private onMessagesSentChanged(): void {
    this.scrollMessagesToBottom();
    this.messageService.updateLastMessageReadDate(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.currentCaregiver.id,
      this.currentPatient.chat.id,
      new Date()
    );
  }

  scrollMessagesToBottomFast() {
    this.scrollContainer.scroll({ top: this.scrollContainer.scrollHeight, left: 0, behavior: 'auto' });
  }

  scrollMessagesToBottom() {
    this.scrollContainer.scroll({ top: this.scrollContainer.scrollHeight, left: 0, behavior: 'smooth' });
  }

  connect() {
    // const socket = new SockJS(`http://${serverURL}:8080/ws`);
    // this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame: any) {
      console.log('Connected: ' + frame);
      _this.stompClient.subscribe('/topic/' + _this.currentPatient.chat.id, function (resp: any) {
        _this.showMessage(JSON.parse(resp.body));
      });
    });
  }

  sendMessage() {
    this.messageToSend.createdDate = new Date();
    this.stompClient.send('/chat/send/' + this.currentPatient.chat.id, {}, JSON.stringify(this.messageToSend));
    this.messageToSend = new PatientChatMessageData(this.currentCaregiver.id, "", new Date());
  }

  async showMessage(message: PatientChatMessage) {
    this.newMessages.push(message);
  }
}