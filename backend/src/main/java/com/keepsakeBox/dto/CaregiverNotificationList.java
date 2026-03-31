/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.util.List;

public class CaregiverNotificationList {
	
	//Definition
	private List<CaregiverNotification> notifications;

	//Getter and setter for: notifications
	public List<CaregiverNotification> getNotifications() {
		return notifications;
	}
	public void setNotifications(List<CaregiverNotification> notifications) {
		this.notifications = notifications;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"CaregiverNotificationList [notifications=%s]", 
				notifications.toString());
	}

}
