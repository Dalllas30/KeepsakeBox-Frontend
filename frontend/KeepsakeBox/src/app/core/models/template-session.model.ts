/**
 * @author Pedro Neves - fc46430
 */

import { Time } from '@angular/common';

export class TemplateSession {
  constructor(
      public id: string,
      public caregiver_id: string,
      public caregiver_name: string,
      public created_patient_id: string,
      public patient_id: string,
      public patient_name: string,
      public session_id: string,
      public current_image: number,
      public total_images: number,
      public categories: string,
      public created_date: Date,
      public last_updated_date: Date,
      public isStarted: boolean,
      public start_session_date: Date,
      public duration: Time,
      public independent_user_id?: string
  ){}
}
