
export class RtSessionImage {
  constructor(
    public id: string,
  	public image_id: string,
    public imageURL: string,
  	public current_image: number,
  	public total_images: number,
    public patient_feedback: number,
    public anxiety: number,
    public agressivity: number,
    public irritability: number,
    public commitment: number,
    public joy: number,
    public enthusiasm: number,
    public communication: number,
    public apathy: number,
    public observation: string,
    public patient_agressivity: number,
    public patient_sadness: number,
    public patient_isolation: number,
    public category: string,
    public thumbnailPath?: string
  ){}
}
