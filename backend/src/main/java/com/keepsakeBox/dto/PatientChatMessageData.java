/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Timestamp;

public class PatientChatMessageData{
	
	//Definition
	private String createdById;
	private String message;
	private Timestamp createdDate;
	
	//Getter and setter for: createdById
	public String getCreatedById() {
		return createdById;
	}
	public void setCreatedById(String createdById) {
		this.createdById = createdById;
	}
	
	//Getter and setter for: message
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	//Getter and setter for: createdDate
	public Timestamp getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Timestamp createdDate) {
		this.createdDate = createdDate;
	}
	
	//For logging Proposes
	@Override
	public String toString() {
		return String.format(
				"PatientChatMessageData [createdById=%s, "
				+ "message=%s, createdDate=%s]",
				createdById, message, createdDate);
	}
	
}
