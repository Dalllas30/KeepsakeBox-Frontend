/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.util.List;

public class PatientChatMessageList {
	
	//Definition
	private List<PatientChatMessage> messages;

	//Getter and setter for: messages
	public List<PatientChatMessage> getMessages() {
		return messages;
	}
	public void setMessages(List<PatientChatMessage> messages) {
		this.messages = messages;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format("PatientChatMessageList [messages=%s]", 
							 messages.toString());
	}

}
