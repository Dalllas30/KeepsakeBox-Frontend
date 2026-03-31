package com.keepsakeBox.dto;

import java.sql.Date;
import java.sql.Time;

/**
 * @author pedro
 *
 */
public class TemplateSession {
	
	private String id;
	private String caregiver_id;
	private String caregiver_name;
	private String created_patient_id;
	private String patient_id;
	private String patient_name;
	private String session_id;
	private Integer current_image; 
	private Integer total_images;
	private String categories;
	private Date created_date;
	private Date last_updated_date;
	private Boolean isStarted;
	private Date start_session_date;
	private Time duration;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCaregiver_id() {
		return caregiver_id;
	}
	public void setCaregiver_id(String caregiver_id) {
		this.caregiver_id = caregiver_id;
	}
	public String getCaregiver_name() {
		return caregiver_name;
	}
	public void setCaregiver_name(String caregiver_name) {
		this.caregiver_name = caregiver_name;
	}
	public String getCreated_patient_id() {
		return created_patient_id;
	}
	public void setCreated_patient_id(String created_patient_id) {
		this.created_patient_id = created_patient_id;
	}
	public String getPatient_id() {
		return patient_id;
	}
	public void setPatient_id(String patient_id) {
		this.patient_id = patient_id;
	}
	public String getPatient_name() {
		return patient_name;
	}
	public void setPatient_name(String patient_name) {
		this.patient_name = patient_name;
	}	
	public String getSession_id() {
		return session_id;
	}
	public void setSession_id(String session_id) {
		this.session_id = session_id;
	}
	public Integer getTotal_images() {
		return total_images;
	}
	public void setTotal_images(Integer total_images) {
		this.total_images = total_images;
	}
	public String getCategories() {
		return categories;
	}
	public void setCategories(String categories) {
		this.categories = categories;
	}
	public Date getCreated_date() {
		return created_date;
	}
	public void setCreated_date(Date created_date) {
		this.created_date = created_date;
	}
	public Date getLast_updated_date() {
		return last_updated_date;
	}
	public void setLast_updated_date(Date last_updated_date) {
		this.last_updated_date = last_updated_date;
	}
	public Boolean getIsStarted() {
		return isStarted;
	}
	public void setIsStarted(Boolean isStarted) {
		this.isStarted = isStarted;
	}
	
	public Integer getCurrent_image() {
		return current_image;
	}
	public void setCurrent_image(Integer current_image) {
		this.current_image = current_image;
	}
	public Date getStart_session_date() {
		return start_session_date;
	}
	public void setStart_session_date(Date start_session_date) {
		this.start_session_date = start_session_date;
	}
	public Time getDuration() {
		return duration;
	}
	public void setDuration(Time duration) {
		this.duration = duration;
	}
	@Override
	public String toString() {
		return String.format(
				"TemplateSession [id=%s, caregiver_id=%s, caregiver_name=%s, "
						+ "patient_id=%s, patient_name=%s, session_id=%s, current_image=%s, total_images=%s, isStarted=%s, start_session_date=%s]",
					    id, caregiver_id, caregiver_name, patient_id, patient_name, session_id, current_image, total_images, isStarted, start_session_date);
	}
		
}
