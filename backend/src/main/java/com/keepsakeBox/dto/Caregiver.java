/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Date;

public class Caregiver {
	
	//Definition
	private String id;
	private String name;
	private String email;
	private String phone;
	private Date birthDate;
	private String profileImageURL;
	private String type;
	private String speciality;
	private boolean isActive;
	
	//Getter and setter for: id
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	//Getter and setter for: name
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	//Getter and setter for: email
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	//Getter and setter for: phone
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}

	//Getter and setter for: birthDate
	public Date getBirthDate() {
		return birthDate;
	}
	public void setBirthDate(Date birthDate) {
		this.birthDate = birthDate;
	}

	//Getter and setter for: profileImageURL
	public String getProfileImageURL() {
		return profileImageURL;
	}
	public void setProfileImageURL(String profileImageURL) {
		this.profileImageURL = profileImageURL;
	}

	//Getter and setter for: type
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}

	//Getter and setter for: speciality
	public String getSpeciality() {
		return speciality;
	}
	public void setSpeciality(String speciality) {
		this.speciality = speciality;
	}

	//Getter and setter for: isActive
	public boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(boolean isActive) {
		this.isActive = isActive;
	}
	
	//Logging Proposes
	@Override
	public String toString() {
	  return String.format(
	      "Caregiver[id=%s, name=%s, email='%s', "
	      + "phone='%s', birthDate='%s', profileImageURL='%s', "
	      + "type='%s', speciality='%s', isActive='%s']",
	      id, name, email, phone, birthDate, profileImageURL, 
	      type, speciality, isActive);
	}

}
