package com.keepsakeBox.dto;

import java.util.List;

public class CaregiverList {
	
	private List<Caregiver> caregivers;

	public List<Caregiver> getCaregivers() {
		return caregivers;
	}

	public void setCaregivers(List<Caregiver> caregivers) {
		this.caregivers = caregivers;
	}
	
	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"CaregiverList [caregivers=%s]", 
				caregivers);
	}


}
