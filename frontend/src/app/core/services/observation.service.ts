/**
 * @author André Santana - fc49451
 * @updated for KeepsakeBox - Angular 21
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs'; // Importação essencial para Angular 21
import { AddPatientObservationData } from '../models/add-patient-observation-data.model';
import { PatientObservationList } from '../models/patient-observation-list.model';
import { PatientObservation } from '../models/patient-observation.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObservationService {
  // Uso do inject() em vez do constructor (padrão moderno Angular)
  private http = inject(HttpClient);

  /**
   * Obtém todas as observações de um paciente.
   * Ordena por data de atualização (mais recente primeiro) - NFR-15
   */
  async getPatientObservations(token: string, patientId: string): Promise<PatientObservation[]> {
    try {
      const response = await firstValueFrom(this.http.get<PatientObservation[]>(`${environment.apiUrl}/observations?patientId=${patientId}`));
      
      if (response) {
        return response.sort(
          (a, b) => (b.lastUpdatedDate?.getTime() ?? 0) - (a.lastUpdatedDate?.getTime() ?? 0)
        );
      }
      return [];
    } catch (error) {
      console.error("Erro ao procurar observações:", error);
      return [];
    }
  }

  /**
   * Adiciona uma nova observação.
   */
  async addPatientObservation(token: string, data: AddPatientObservationData): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/observations`, data));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Apaga uma observação.
   * Nota: Idealmente o backend deveria usar DELETE, mas mantivemos o GET original para compatibilidade.
   */
  async deletePatientObservation(token: string, observationId: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`${environment.apiUrl}/observations/${observationId}`));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Atualiza uma observação existente.
   */
  async updatePatientObservation(token: string, observation: PatientObservation): Promise<boolean> {
    try {
      await firstValueFrom(this.http.put(`${environment.apiUrl}/observations/${observation.id}`, observation));
      return true;
    } catch (error) {
      return false;
    }
  }
}