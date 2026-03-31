/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.util.List;

public class PatientCaregiverList {
	
	//Definition
	private List<PatientCaregiver> caregivers;

	//Getter and setter for: caregivers
	public List<PatientCaregiver> getCaregivers() {
		return caregivers;
	}
	public void setCaregivers(List<PatientCaregiver> caregivers) {
		this.caregivers = caregivers;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"PatientCaregiverList [caregivers=%s]", 
				caregivers);
	}

}
