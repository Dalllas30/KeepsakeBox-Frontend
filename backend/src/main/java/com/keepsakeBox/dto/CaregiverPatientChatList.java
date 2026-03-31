/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.util.List;

public class CaregiverPatientChatList {
	
	//Definition
	private List<CaregiverPatientChat> chats;

	//Getter and setter for: chats
	public List<CaregiverPatientChat> getChats() {
		return chats;
	}
	public void setChats(List<CaregiverPatientChat> chats) {
		this.chats = chats;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"CaregiverPatientChatList [chats=%s]", 
				chats.toString());
	}
	

}
