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

// Configuração centralizada para facilitar a manutenção
//const SERVER_URL = "194.117.20.219";
const SERVER_URL = "localhost";
const BASE_API = `http://${SERVER_URL}:8080/patient`;

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
      const url = `${BASE_API}/observations?token=${token}&patientId=${patientId}`;
      
      // firstValueFrom substitui o antigo .toPromise()
      const response = await firstValueFrom(this.http.get<PatientObservationList>(url));
      
      if (response?.observations) {
        return response.observations.sort(
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
      const url = `${BASE_API}/observation?token=${token}`;
      await firstValueFrom(this.http.post(url, data));
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
      const url = `${BASE_API}/observation/delete?token=${token}&observationId=${observationId}`;
      await firstValueFrom(this.http.get(url));
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
      const url = `${BASE_API}/observation/update?token=${token}`;
      await firstValueFrom(this.http.post(url, observation));
      return true;
    } catch (error) {
      return false;
    }
  }
}