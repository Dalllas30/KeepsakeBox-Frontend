/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class LoggedSession {
	
	//Current Logged Sesssion token
	private String token;

	//CaregiverID associated to this Logged Session
	private String caregiverID;
	
	//CaregiverID associated to this Logged Session
	private String caregiverEmail;
	
	//Constructor for LoggedSession
	public LoggedSession(String token, String caregiverID, String caregiverEmail) {
		this.token = token;
		this.caregiverEmail = caregiverEmail;
		this.caregiverID = caregiverID;
	}
	
	//Getter and setter for: token
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	//Getter and setter for: caregiverID
	public String getCaregiverID() {
		return caregiverID;
	}
	public void setCaregiverID(String caregiverID) {
		this.caregiverID = caregiverID;
	}
	
	//Getter and setter for: caregiverEmail
	public String getCaregiverEmail() {
		return caregiverEmail;
	}
	public void setCaregiverEmail(String caregiverEmail) {
		this.caregiverEmail = caregiverEmail;
	}
	
	//Logging Proposes
	@Override
	public String toString() {
	  return String.format(
			  "LoggedSession [token=%s, "
			  + "caregiverID='%s', caregiverEmail='%s']",
			  token, caregiverID, caregiverEmail);
	}

}
