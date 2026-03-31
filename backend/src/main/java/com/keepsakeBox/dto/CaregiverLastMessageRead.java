/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Timestamp;

public class CaregiverLastMessageRead {
	
	//Definition
	private String caregiverId;
	private String chatId;
	private Timestamp lastReadDate;
	
	//Getter and setter for: caregiverId
	public String getCaregiverId() {
		return caregiverId;
	}
	public void setCaregiverId(String caregiverId) {
		this.caregiverId = caregiverId;
	}

	//Getter and setter for: chatId
	public String getChatId() {
		return chatId;
	}
	public void setChatId(String chatId) {
		this.chatId = chatId;
	}
	
	//Getter and setter for: lastReadDate
	public Timestamp getLastReadDate() {
		return lastReadDate;
	}
	public void setLastReadDate(Timestamp lastReadDate) {
		this.lastReadDate = lastReadDate;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"CaregiverLastMessageRead [caregiverId=%s, "
				+ "chatId=%s, lastReadDate=%s]",
				caregiverId, chatId, lastReadDate);
	}
}
