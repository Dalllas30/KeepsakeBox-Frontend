package com.keepsakeBox.dto;

import java.util.List;

public class TemplateSessionList {
	
	private List<TemplateSession> templateSessions;
	
	public List<TemplateSession> getTemplateSessions() {
		return templateSessions;
	}

	public void setTemplateSessions(List<TemplateSession> templateSessions) {
		this.templateSessions = templateSessions;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"TemplateSessionList [templateSessions=%s]", 
				templateSessions);
	}

}
