/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Date;

public class CaregiverRegisterData {
	
	//Definition
	private String name;
	private String email;
	private String phone;
	private String password;
	private Date birthDate;
	private String profileImageURL;
	private String type;
	private String speciality;

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

	//Getter and setter for: password
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
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

	//Logging Proposes
	@Override
	public String toString() {
	  return String.format(
	      "CaregiverRegisterData[name=%s, email='%s', "
	      + "phone='%s', birthDate='%s', profileImageURL='%s', "
	      + "type='%s', speciality='%s']",
	      name, email, phone, birthDate, 
	      profileImageURL, type, speciality);
	}
	

}
