/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Timestamp;

public class PatientChat {
	
	//Definition
	private String id;
	private Timestamp lastMessageSentDate;
	private Timestamp lastMessageReadDate;
	
	//Getter and setter for: id
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	//Getter and setter for: lastMessageSentDate
	public Timestamp getLastMessageSentDate() {
		return lastMessageSentDate;
	}
	public void setLastMessageSentDate(Timestamp lastMessageSentDate) {
		this.lastMessageSentDate = lastMessageSentDate;
	}
	
	//Getter and setter for: lastMessageReadDate
	public Timestamp getLastMessageReadDate() {
		return lastMessageReadDate;
	}
	public void setLastMessageReadDate(Timestamp lastMessageReadDate) {
		this.lastMessageReadDate = lastMessageReadDate;
	}
	
	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"PatientChat [id=%s, lastMessageSentDate=%s, "
				+ "lastMessageReadDate=%s]",
			    id, lastMessageSentDate, lastMessageReadDate);
	}
}
