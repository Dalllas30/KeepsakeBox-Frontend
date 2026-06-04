import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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

  private stompClient: any = null;

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private patientService: PatientService,
    private caregiverService: CaregiverService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentPatient = await this.patientService.getCurrentPatient()!;
    this.currentCaregiver = await this.caregiverService.getCurrentCaregiver()!;
    this.messageToSend = new PatientChatMessageData(this.currentCaregiver.id, "", new Date());

    if (!this.currentPatient.chat?.id) {
      // No chat yet for this patient — nothing to load
      this.loadingMessages = false;
      this.messages = [];
      this.oldMessages = [];
      this.newMessages = [];
      this.cdr.detectChanges();
      return;
    }

    await this.retrieveChatMessages();
    this.messageService.updateLastMessageReadDate(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.currentCaregiver.id,
      this.currentPatient.chat.id,
      new Date()
    );
    this.connect();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.scrollMessagesToBottomFast();
    this.messagesSent.changes.subscribe(_ => this.onMessagesSentChanged());
  }

  async retrieveChatMessages(): Promise<void> {
    if (!this.currentPatient.chat?.id) return;
    this.loadingMessages = true;
    try {
      this.messages = await this.messageService.getPatientChatMessages(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.currentPatient.chat.id
      );
      const lastRead = this.currentPatient.chat.lastMessageReadDate;
      this.oldMessages = lastRead
        ? this.messages.filter(m => m.createdDate < lastRead)
        : [];
      this.newMessages = lastRead
        ? this.messages.filter(m => m.createdDate >= lastRead)
        : [...this.messages];
    } catch {
      this.messages = [];
      this.oldMessages = [];
      this.newMessages = [];
    }
    this.loadingMessages = false;
    this.cdr.detectChanges();
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
    this.messagingDiv?.nativeElement?.scroll({ top: this.messagingDiv.nativeElement.scrollHeight, left: 0, behavior: 'auto' });
  }

  scrollMessagesToBottom() {
    this.messagingDiv?.nativeElement?.scroll({ top: this.messagingDiv.nativeElement.scrollHeight, left: 0, behavior: 'smooth' });
  }

  connect() {
    if (!this.stompClient) {
      // WebSocket/STOMP not available (mock / dev mode) — skip live connection.
      // Messages are loaded once on init and refreshed after every send via REST.
      return;
    }
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

  async sendMessage(): Promise<void> {
    if (!this.messageToSend.message?.trim()) return;

    if (!this.stompClient) {
      // Mock / dev mode: send via REST, then reload the message list.
      this.messageToSend.createdDate = new Date();
      await this.messageService.sendMessageRest(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.currentPatient.chat.id,
        this.messageToSend
      );
      this.messageToSend = new PatientChatMessageData(this.currentCaregiver.id, '', new Date());
      await this.retrieveChatMessages();
      this.cdr.detectChanges();
      return;
    }

    // Live mode: send over STOMP
    this.messageToSend.createdDate = new Date();
    this.stompClient.send('/chat/send/' + this.currentPatient.chat.id, {}, JSON.stringify(this.messageToSend));
    this.messageToSend = new PatientChatMessageData(this.currentCaregiver.id, '', new Date());
  }

  async showMessage(message: PatientChatMessage) {
    this.newMessages.push(message);
  }
}