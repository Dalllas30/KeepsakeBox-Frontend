/**
 * V3
 * @author Pedro Neves - fc46430
 */
package com.keepsakeBox.dto;

import java.util.List;

public class SessionList {
	
	private List<Session> sessions;

	public List<Session> getSessions() {
		return sessions;
	}

	public void setSessions(List<Session> sessions) {
		this.sessions = sessions;
	}
	
	//For logging proposes
		@Override
		public String toString() {
			return String.format(
					"SessionList [sessions=%s]", 
					sessions);
		}

}
