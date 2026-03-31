/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Timestamp;

public class PatientChatMessage{
	
	//Definition
	private String id;
	private SimpleCaregiver createdBy;
	private String message;
	private Timestamp createdDate;
	
	//Getter and setter for: id
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	//Getter and setter for: createdBy
	public SimpleCaregiver getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(SimpleCaregiver createdBy) {
		this.createdBy = createdBy;
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
				"PatientChatMessage [id=%s, createdBy=%s, "
				+ "message=%s, createdDate=%s]",
				id, createdBy.toString(), 
				message, createdDate);
	}
	
}
