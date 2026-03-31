/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Date;

public class PatientRegisterData {
	
	//Definition
	private String name;
	private String displayName;
    private Date birthDate;
    private String education;
	private String profileImageURL;
	private String interests;
	private String cities;
	
	//Getter and setter for: name
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	//Getter and setter for: displayName
	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	//Getter and setter for: birthDate
	public Date getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(Date birthDate) {
		this.birthDate = birthDate;
	}
	
	//Getter and setter for: education
	public String getEducation() {
		return education;
	}
	public void setEducation(String education) {
		this.education = education;
	}

	//Getter and setter for: profileImageURL
	public String getProfileImageURL() {
		return profileImageURL;
	}

	public void setProfileImageURL(String profileImageURL) {
		this.profileImageURL = profileImageURL;
	}
	

	//For logging proposes
	@Override
	public String toString() {
		return  String.format(
			  "PatientRegisterData [name=%s, displayName=%s,"
			  + "birthDate=%s, education='%s', "
			  + "profileImageURL=%s]",
			  name, displayName, birthDate, 
			  education, profileImageURL);
	}

	public String getInterests() {
		return interests;
	}

	public void setInterests(String interests) {
		this.interests = interests;
	}

	public String getCities() {
		return cities;
	}

	public void setCities(String cities) {
		this.cities = cities;
	}
}