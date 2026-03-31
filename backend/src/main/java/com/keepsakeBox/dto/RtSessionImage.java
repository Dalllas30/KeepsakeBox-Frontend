/**
 * V3
 * @author Pedro Neves - fc46430
 */

package com.keepsakeBox.dto;

public class RtSessionImage {
	private String id;
	private String image_id;
	private String imageURL;
	private Integer current_image;
	private Integer total_images;
	private Integer patient_feedback;
	private Integer anxiety;
	private Integer agressivity;
	private Integer irritability;
	private Integer commitment;
	private Integer joy;
	private Integer enthusiasm;
	private Integer communication;
	private Integer apathy;
	private String observation;
	private Integer patient_agressivity;
	private Integer patient_sadness;
	private Integer patient_isolation;
	private String category;

	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}


	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getImage_id() {
		return image_id;
	}
	public void setImage_id(String image_id) {
		this.image_id = image_id;
	}
	public String getImageURL() {
		return imageURL;
	}
	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}
	public Integer getCurrent_image() {
		return current_image;
	}
	public void setCurrent_image(Integer current_image) {
		this.current_image = current_image;
	}
	public Integer getTotal_images() {
		return total_images;
	}
	public void setTotal_images(Integer total_images) {
		this.total_images = total_images;
	}
	public String getObservation() {
		return observation;
	}
	public void setObservation(String observation) {
		this.observation = observation;
	}
	
	public Integer getPatient_feedback() {
		return patient_feedback;
	}
	public void setPatient_feedback(Integer patient_feedback) {
		this.patient_feedback = patient_feedback;
	}
	public Integer getPatient_agressivity() {
		return patient_agressivity;
	}
	public void setPatient_agressivity(Integer patient_agressivity) {
		this.patient_agressivity = patient_agressivity;
	}
	public Integer getPatient_sadness() {
		return patient_sadness;
	}
	public void setPatient_sadness(Integer patient_sadness) {
		this.patient_sadness = patient_sadness;
	}
	public Integer getPatient_isolation() {
		return patient_isolation;
	}
	public void setPatient_isolation(Integer patient_isolation) {
		this.patient_isolation = patient_isolation;
	}
	public Integer getAnxiety() {
		return anxiety;
	}
	public void setAnxiety(Integer anxiety) {
		this.anxiety = anxiety;
	}
	public Integer getAgressivity() {
		return agressivity;
	}
	public void setAgressivity(Integer agressivity) {
		this.agressivity = agressivity;
	}
	public Integer getIrritability() {
		return irritability;
	}
	public void setIrritability(Integer irritability) {
		this.irritability = irritability;
	}
	public Integer getCommitment() {
		return commitment;
	}
	public void setCommitment(Integer commitment) {
		this.commitment = commitment;
	}
	public Integer getJoy() {
		return joy;
	}
	public void setJoy(Integer joy) {
		this.joy = joy;
	}
	public Integer getEnthusiasm() {
		return enthusiasm;
	}
	public void setEnthusiasm(Integer enthusiasm) {
		this.enthusiasm = enthusiasm;
	}
	public Integer getCommunication() {
		return communication;
	}
	public void setCommunication(Integer communication) {
		this.communication = communication;
	}
	public Integer getApathy() {
		return apathy;
	}
	public void setApathy(Integer apathy) {
		this.apathy = apathy;
	}
	//For Logging Proposes
	@Override
	public String toString() {
		return String.format(
				"RtSessionImage [session_id=%s, image_id=%s, imageURL=%s, current_image=%s, total_images=%s, observation=%s, patient_feedback=%s, patient_agressivity=%s, patient_sadness=%s, patient_isolation=%s]",
				id, image_id, imageURL, current_image, total_images, observation, patient_feedback, patient_agressivity, patient_sadness, patient_isolation);
	}	
}
