import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Caregiver } from '../models/caregiver.model';
import { Patient } from '../models/patient.model';
import { Session } from '../models/session.model';
import { SessionFeedback } from '../models/session-feedback.model';
import { SessionList } from '../models/session-list.model';
import { environment } from '../../../environments/environment';

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

  private async getSessions(): Promise<Session[]> {
    const sessions = await this.http.get<Session[]>(`${environment.apiUrl}/sessions`).toPromise().then(response => response ?? []);
    const sessionFeedbacks = await this.http.get<SessionFeedback[]>(`${environment.apiUrl}/sessionFeedbacks`).toPromise().then(response => response ?? []);
    const caregivers = await this.http.get<Caregiver[]>(`${environment.apiUrl}/caregivers`).toPromise().then(response => response ?? []);
    const patients = await this.http.get<Patient[]>(`${environment.apiUrl}/patients`).toPromise().then(response => response ?? []);

    const feedbackBySessionId = new Map<string, SessionFeedback>();
    sessionFeedbacks.forEach(feedback => {
      if (feedback.session_id) {
        feedbackBySessionId.set(feedback.session_id.toString(), feedback);
      }
    });

    const caregiverById = new Map(caregivers.map(caregiver => [caregiver.id?.toString() ?? '', caregiver]));
    const patientById = new Map(patients.map(patient => [patient.id?.toString() ?? '', patient]));

    return sessions.map(session => {
      const feedback = feedbackBySessionId.get(session.id?.toString() ?? '');
      const caregiver = caregiverById.get(session.caregiver_id?.toString() ?? '');
      const patient = patientById.get(session.patient_id?.toString() ?? '');
      const caregiverName = session.caregiver_name || caregiver?.name || '';
      const patientName = session.patient_name || patient?.name || patient?.displayName || '';
      if (!feedback) {
        return {
          ...session,
          caregiver_name: caregiverName,
          patient_name: patientName,
          full_name: session.full_name || patientName
        };
      }

      return {
        ...session,
        sessionFinished: true,
        global_feedback: feedback,
        patient_feedback: feedback.patient_feedback,
        duration: feedback.duration as any,
        caregiver_name: caregiverName,
        patient_name: patientName,
        full_name: session.full_name || patientName
      };
    });
  }

  private async getCurrentCaregiverId(token: string): Promise<string | null> {
    const caregivers = await this.http.get<any[]>(`${environment.apiUrl}/caregivers?token=${token}`).toPromise();
    return caregivers?.[0]?.id?.toString() ?? localStorage.getItem('currentCaregiverId');
  }

  private async upsertSessionFeedback(sessionFeedback: SessionFeedback): Promise<boolean> {
    const response = await this.http.get<any[]>(`${environment.apiUrl}/sessionFeedbacks?session_id=${sessionFeedback.session_id}`).toPromise();
    const existing = response?.[0];
    if (existing?.id) {
      await this.http.put(`${environment.apiUrl}/sessionFeedbacks/${existing.id}`, { ...existing, ...sessionFeedback }).toPromise();
      return true;
    }
    await this.http.post(`${environment.apiUrl}/sessionFeedbacks`, sessionFeedback).toPromise();
    return true;
  }

  private async upsertSession(session: Partial<Session> & { id?: string }): Promise<boolean> {
    if (session.id) {
      await this.http.put(`${environment.apiUrl}/sessions/${session.id}`, session).toPromise();
      return true;
    }
    await this.http.post(`${environment.apiUrl}/sessions`, session).toPromise();
    return true;
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
    const caregiverId = await this.getCurrentCaregiverId(token);
    const sessions = await this.getSessions();
    return sessions.filter(session =>
      session.caregiver_id?.toString() === caregiverId?.toString() &&
      session.sessionFinished &&
      session.global_feedback != null
    );
  }

  async getSessionListByCaregiverHistory(token: string): Promise<Session[]> {
    return this.getSessionListByCaregiver(token);
  }

  async getSessionListByDateCaregiver(
    token: string,
    filter: string,
    filterYear: string,
    patientId: string
  ): Promise<Session[]> {
    const caregiverId = await this.getCurrentCaregiverId(token);
    const sessions = await this.getSessions();
    return sessions.filter(session => {
      const startDate = new Date(session.start_session as any);
      const matchesCaregiver = session.caregiver_id?.toString() === caregiverId?.toString();
      const matchesPatient = !patientId || patientId === 'all' || session.patient_id?.toString() === patientId.toString();
      const matchesMonth = !filter || filter === 'all' || `${startDate.getMonth() + 1}` === filter;
      const matchesYear = !filterYear || filterYear === 'all' || `${startDate.getFullYear()}` === filterYear;
      return matchesCaregiver && matchesPatient && matchesMonth && matchesYear && session.sessionFinished && session.global_feedback != null;
    });
  }

  async getSessionListByDatePatient(
    token: string,
    patientId: string,
    filterMonth: string,
    filterYear: string
  ): Promise<Session[]> {
    const sessions = await this.getSessions();
    return sessions.filter(session => {
      const startDate = new Date(session.start_session as any);
      const matchesPatient = session.patient_id?.toString() === patientId.toString();
      const matchesMonth = !filterMonth || filterMonth === 'all' || `${startDate.getMonth() + 1}` === filterMonth;
      const matchesYear = !filterYear || filterYear === 'all' || `${startDate.getFullYear()}` === filterYear;
      return matchesPatient && matchesMonth && matchesYear && session.sessionFinished && session.global_feedback != null;
    });
  }

  async getSessionListByPatient(token: string, patientId: string): Promise<Session[]> {
    const sessions = await this.getSessions();
    return sessions.filter(session =>
      session.patient_id?.toString() === patientId.toString() &&
      session.sessionFinished &&
      session.global_feedback != null
    );
  }

  async getSessionFeedback(token: string, session_Id: string): Promise<SessionFeedback | null> {
    const response = await this.http.get<SessionFeedback[]>(`${environment.apiUrl}/sessionFeedbacks?session_id=${session_Id}`).toPromise().catch(() => []);
    return response?.[0] ?? null;
  }

  async updateSessionFeedback(token: string, sessionFeedback: SessionFeedback): Promise<boolean> {
    try {
      return await this.upsertSessionFeedback(sessionFeedback);
    } catch {
      return false;
    }
  }

  async finishSession(
    token: string,
    templateSessionId: string,
    patientId: string,
    sessionFeedback: SessionFeedback
  ): Promise<boolean> {
    try {
      const existing = await this.http.get<any>(`${environment.apiUrl}/sessions/${sessionFeedback.session_id}`).toPromise().catch(() => null);
      if (!existing?.id) {
        return false;
      }
      await this.upsertSession({
        ...existing,
        sessionFinished: true,
        end_session: new Date().toISOString(),
        global_feedback: sessionFeedback,
        patient_feedback: sessionFeedback.patient_feedback,
        duration: sessionFeedback.duration
      } as any);
      await this.upsertSessionFeedback(sessionFeedback);
      return true;
    } catch {
      return false;
    }
  }

  async updateSessionDuration(token: string, sessionFeedback: SessionFeedback): Promise<boolean> {
    try {
      const response = await this.http.get<any[]>(`${environment.apiUrl}/sessionFeedbacks?session_id=${sessionFeedback.session_id}`).toPromise();
      const existing = response?.[0];
      if (existing?.id) {
        await this.http.patch(`${environment.apiUrl}/sessionFeedbacks/${existing.id}`, { duration: sessionFeedback.duration }).toPromise();
      }
      return true;
    } catch {
      return false;
    }
  }
}