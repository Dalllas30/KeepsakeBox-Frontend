/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Timestamp;

public class CaregiverNotification {
	
	//Definition
	private String id;
	private SimpleCaregiver sender;
	private SimpleCaregiver receiver;
	private Patient patient;
	private String messageType;
	private Timestamp createdDate;
	
	//Getter and setter for: id
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	//Getter and setter for: sender
	public SimpleCaregiver getSender() {
		return sender;
	}
	public void setSender(SimpleCaregiver sender) {
		this.sender = sender;
	}
	
	//Getter and setter for: receiver
	public SimpleCaregiver getReceiver() {
		return receiver;
	}
	public void setReceiver(SimpleCaregiver receiver) {
		this.receiver = receiver;
	}
	
	//Getter and setter for: patient
	public Patient getPatient() {
		return patient;
	}
	public void setPatient(Patient patient) {
		this.patient = patient;
	}
	
	//Getter and setter for: messageType
	public String getMessageType() {
		return messageType;
	}
	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}
	
	//Getter and setter for: createdDate
	public Timestamp getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Timestamp createdDate) {
		this.createdDate = createdDate;
	}
	
	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"CaregiverNotification [id=%s, sender=%s, receiver=%s, "
				+ "patient=%s, messageType=%s, createdDate=%s]",
				id, sender.toString(), receiver.toString(), 
				patient.toString(), messageType, createdDate);
	}
	
}
