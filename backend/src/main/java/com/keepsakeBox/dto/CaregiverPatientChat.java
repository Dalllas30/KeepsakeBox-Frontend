/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Timestamp;

public class CaregiverPatientChat {
	
	//Definition
	private PatientChat chat;
	private Timestamp lastMessageReadDate;
	
	//Getter and setter for: chat
	public PatientChat getChat() {
		return chat;
	}
	public void setChat(PatientChat chat) {
		this.chat = chat;
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
				"CaregiverPatientChat "
				+ "[chat=%s, lastMessageReadDate=%s]",
			    chat.toString(), lastMessageReadDate);
	}

}
