/**
 * @author Pedro Neves - fc46430
 */

export class TemplateSessionData {
  constructor(
      public id: string,
      public caregiver_id: string,
      public patient_id: string,
      public creation_type: number, // 1 = Manual | 2 = semi-automatico | 3 = automatico
      public total_images: number,
      public categories: string,
      public created_date: Date,
      public last_updated_date: Date,
      public image_list: string[]
  ){}
}
