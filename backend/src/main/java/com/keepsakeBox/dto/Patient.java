/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Date;

public class Patient {
	
	//Definition
	private String id;
	private String name;
	private String displayName;
    private Date birthDate;
    private String education;
	private String profileImageURL;
	private boolean isActive;
	private Date lastSession;
	private PatientChat chat;
	private String interests;
	private String cities;
	
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
	
	//Getter and setter for: isActive
	public boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(boolean isActive) {
		this.isActive = isActive;
	}
	
	//Getter and setter for: lastSession
	public Date getLastSession() {
		return lastSession;
	}
	public void setLastSession(Date lastSession) {
		this.lastSession = lastSession;
	}
	
	//Getter and setter for: chat
	public PatientChat getChat() {
		return chat;
	}
	public void setChat(PatientChat chat) {
		this.chat = chat;
	}
	
	//For logging proposes
	@Override
	public String toString() {
		return  String.format(
				"Patient [id=%s, name=%s, "
				+ "displayName=%s, birthDate=%s, "
				+ "education='%s', profileImageURL=%s, "
				+ "isActive=%b, lastSession=%s, chat=%s]",
			    id, name, displayName, 
			    birthDate, education, profileImageURL, 
			    isActive, lastSession, chat.toString());
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