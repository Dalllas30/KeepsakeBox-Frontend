package com.keepsakeBox.dto;

import java.sql.Date;

public class Request {

	//Definition
	private String id;
	private String expirationDate;
	private String caregiverID;
	private String targetID;
	
	public String getExpirationDate() {
		return expirationDate;
	}
	public void setExpirationDate(String expirationDate) {
		this.expirationDate = expirationDate;
	}
	public String getCaregiverID() {
		return caregiverID;
	}
	public void setCaregiverID(String caregiverID) {
		this.caregiverID = caregiverID;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTargetID() {
		return targetID;
	}
	public void setTargetID(String patientID) {
		this.targetID = patientID;
	}

}
