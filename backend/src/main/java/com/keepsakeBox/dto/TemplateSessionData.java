/**
 * @author pedro
 *
 */

package com.keepsakeBox.dto;

import java.sql.Date;

public class TemplateSessionData {
	private String id;
	private String caregiver_id;
	private String patient_id;
	private Integer creation_type; // 1 = Manual | 2 = semi-automatico | 3 = automatico
	private Integer total_images;
	private String categories;
	private Date created_date;
	private Date last_updated_date;
	private String[] image_list;
	
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
	public String getPatient_id() {
		return patient_id;
	}
	public void setPatient_id(String patient_id) {
		this.patient_id = patient_id;
	}
	public Integer getTotal_images() {
		return total_images;
	}
	public void setTotal_images(Integer total_images) {
		this.total_images = total_images;
	}
	public Integer getCreation_type() {
		return creation_type;
	}
	public void setCreation_type(Integer creation_type) {
		this.creation_type = creation_type;
	}
	public String[] getImage_list() {
		return image_list;
	}
	public void setImage_list(String[] image_list) {
		this.image_list = image_list;
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
	@Override
	public String toString() {
		return String.format(
				"TemplateSessionData [id=%s, caregiver_id=%s, patient_id=%s, creation_type=%s, total_images=%s]",
				id, caregiver_id, patient_id, creation_type, total_images);
	}

}
