import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient } from '../models/patient.model';
import { Caregiver } from '../models/caregiver.model';
import { Session } from '../models/session.model';
import { SessionList } from '../models/session-list.model';
import { BehaviorSubject } from 'rxjs';
import { SessionFeedback } from '../models/session-feedback.model';

//Request URLs
//const serverURL = "194.117.20.219"
const serverURL = "localhost"
const getSessionListByCaregiverURL02= `http://${serverURL}:8080/caregiver/history?token=`
const getSessionListByCaregiverURL03= "&filter="
const getSessionListByCaregiverURL04= "&filterYear="
const getSessionListByCaregiverURL06= "&patientId="
const getSessionListByDateCaregiverURL05 = `http://${serverURL}:8080/caregiver/statistics?token=`

const getSessionListByPatientURL03= "&filterMonth="
const getSessionListByPatientURL04= "&filterYear="
const getSessionListByPatientURL06= "&patientId="
const getSessionListByDatePatientURL05 = `http://${serverURL}:8080/patient/statistics?token=`

const getSessionListByPatientURL01= `http://${serverURL}:8080/session/patient?token=`
const getSessionListURL02 = "&patientId="

const updateSessionFeedbackURL01 = `http://${serverURL}:8080/session/update/feedback?token=`
const getSessionFeedbackURL01 = `http://${serverURL}:8080/session/feedback?token=`
const getSessionFeedbackURL02 = "&session_Id="
const finishSessionURL01 = `http://${serverURL}:8080/session/finish?token=`
const finishSessionURL02 = "&templateId="
const finishSessionURL03 = "&patientId="
const updateSessionDurationURL01 = `http://${serverURL}:8080/session/update/duration?token=`

@Injectable({
  providedIn: 'root'
})
export class RtSessionService {

  private currentPatient: BehaviorSubject<Patient | null>;
  private currentCaregiver: BehaviorSubject<Caregiver | null>;
  private currentSession: BehaviorSubject<Session | null>;
  private currentDuration: BehaviorSubject<number | null>;

  constructor(private http: HttpClient) {

    this.currentPatient = new BehaviorSubject<Patient | null>(
      JSON.parse(localStorage.getItem('currentPatient') || 'null')
    );

    this.currentCaregiver = new BehaviorSubject<Caregiver | null>(
      JSON.parse(localStorage.getItem('currentCaregiver') || 'null')
    );

    this.currentSession = new BehaviorSubject<Session | null>(
      JSON.parse(localStorage.getItem('currentSession') || 'null')
    );

    this.currentDuration = new BehaviorSubject<number | null>(
      JSON.parse(localStorage.getItem('currentDuration') || 'null')
    );
  }

  // ================= SESSION =================

  setCurrentSession(session: Session): void {
    localStorage.setItem('currentSession', JSON.stringify(session));
    this.currentSession.next(session);
  }

  resetCurrentSession(): void {
    localStorage.removeItem('currentSession');
    this.currentSession.next(null);
  }

  getCurrentSession(): Session | null {
    return this.currentSession.value;
  }

  // ================= PATIENT =================

  setCurrentPatient(patient: Patient): void {
    localStorage.setItem('currentPatient', JSON.stringify(patient));
    this.currentPatient.next(patient);
  }

  resetCurrentPatient(): void {
    localStorage.removeItem('currentPatient');
    this.currentPatient.next(null);
  }

  getCurrentPatient(): Patient | null {
    return this.currentPatient.value;
  }

  // ================= CAREGIVER =================

  setCurrentCaregiver(caregiver: Caregiver): void {
    localStorage.setItem('currentCaregiver', JSON.stringify(caregiver));
    this.currentCaregiver.next(caregiver);
  }

  resetCurrentCaregiver(): void {
    localStorage.removeItem('currentCaregiver');
    this.currentCaregiver.next(null);
  }

  getCurrentCaregiver(): Caregiver | null {
    return this.currentCaregiver.value;
  }

  // ================= DURATION =================

  setCurrentDuration(duration: number): void {
    localStorage.setItem('currentDuration', JSON.stringify(duration));
    this.currentDuration.next(duration);
  }

  resetCurrentDuration(): void {
    localStorage.removeItem('currentDuration');
    this.currentDuration.next(null);
  }

  getCurrentDuration(): number | null {
    return this.currentDuration.value;
  }

  // ================= API =================

  async getSessionListByCaregiver(token: string): Promise<Session[]> {
    let sessions: Session[] = [];

    await this.http.get<SessionList>(
      `${getSessionListByCaregiverURL02}${token}`
    ).toPromise()
    .then(response => {
      if (response) sessions = response.sessions;
    });

    return sessions;
  }

  async getSessionListByCaregiverHistory(token: string): Promise<Session[]> {
    let sessions: Session[] = [];

    await this.http.get<SessionList>(
      `${getSessionListByCaregiverURL02}${token}${getSessionListByCaregiverURL03}`
    ).toPromise()
    .then(response => {
      if (response) sessions = response.sessions;
    });

    return sessions;
  }

  async getSessionListByDateCaregiver(
    token: string,
    filter: string,
    filterYear: string,
    patientId: string
  ): Promise<Session[]> {

    let sessions: Session[] = [];

    await this.http.get<SessionList>(
      `${getSessionListByDateCaregiverURL05}${token}${getSessionListByCaregiverURL03}${filter}${getSessionListByCaregiverURL04}${filterYear}${getSessionListByCaregiverURL06}${patientId}`
    ).toPromise()
    .then(response => {
      if (response) sessions = response.sessions;
    });

    return sessions;
  }

  async getSessionListByDatePatient(
    token: string,
    patientId: string,
    filterMonth: string,
    filterYear: string
  ): Promise<Session[]> {

    let sessions: Session[] = [];

    await this.http.get<SessionList>(
      `${getSessionListByDatePatientURL05}${token}${getSessionListByPatientURL06}${patientId}${getSessionListByPatientURL03}${filterMonth}${getSessionListByPatientURL04}${filterYear}`
    ).toPromise()
    .then(response => {
      if (response) sessions = response.sessions;
    });

    return sessions;
  }

  async getSessionListByPatient(token: string, patientId: string): Promise<Session[]> {
    let sessions: Session[] = [];

    await this.http.get<SessionList>(
      `${getSessionListByPatientURL01}${token}${getSessionListURL02}${patientId}`
    ).toPromise()
    .then(response => {
      if (response) sessions = response.sessions;
    });

    return sessions;
  }

  async getSessionFeedback(token: string, session_Id: string): Promise<SessionFeedback | null> {
    let sessionFeedback: SessionFeedback | null = null;

    await this.http.get<SessionFeedback>(
      `${getSessionFeedbackURL01}${token}${getSessionFeedbackURL02}${session_Id}`
    ).toPromise()
    .then(response => {
      if (response) sessionFeedback = response;
    })
    .catch(() => {
      sessionFeedback = null;
    });

    return sessionFeedback;
  }

  async updateSessionFeedback(token: string, sessionFeedback: SessionFeedback): Promise<boolean> {
    let success = true;

    await this.http.post(
      `${updateSessionFeedbackURL01}${token}`,
      sessionFeedback
    ).toPromise()
    .catch(() => success = false);

    return success;
  }

  async finishSession(
    token: string,
    templateSessionId: string,
    patientId: string,
    sessionFeedback: SessionFeedback
  ): Promise<boolean> {

    let success = true;

    await this.http.post(
      `${finishSessionURL01}${token}${finishSessionURL02}${templateSessionId}${finishSessionURL03}${patientId}`,
      sessionFeedback
    ).toPromise()
    .catch(() => success = false);

    return success;
  }

  async updateSessionDuration(token: string, sessionFeedback: SessionFeedback): Promise<boolean> {
    let success = true;

    await this.http.post(
      `${updateSessionDurationURL01}${token}`,
      sessionFeedback
    ).toPromise()
    .catch(() => success = false);

    return success;
  }
}