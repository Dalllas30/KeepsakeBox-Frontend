/**
 * @author Pedro Neves - fc46430
 */

import { Time } from '@angular/common';
import { SessionFeedback } from './session-feedback.model'

export class Session {
  constructor(
      public id: string,
      public template_id: string,
      public caregiver_name: string,
      public caregiver_id: string,
      public patient_id: string,
      public patient_name: string,
      public full_name: string,
      public start_session: Date,
      public end_session: Date,
      public sessionFinished: boolean,
      public duration: Time,
      public total_images: number,
      public patient_feedback: number,
      public global_feedback: SessionFeedback, // Rever mais tarde
      public independent_user_id?: string
  ){}
}
