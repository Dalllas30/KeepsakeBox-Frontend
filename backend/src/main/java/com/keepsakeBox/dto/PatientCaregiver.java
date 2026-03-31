/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class PatientCaregiver {
	
	//Definition
	private Caregiver caregiver;
	private boolean isPrimary;
	private String patientRelation;
	
	//Getter and setter for: caregiver
	public Caregiver getCaregiver() {
		return caregiver;
	}
	public void setCaregiver(Caregiver caregiver) {
		this.caregiver = caregiver;
	}
	
	//Getter and setter for: isPrimary
	public boolean getIsPrimary() {
		return isPrimary;
	}
	public void setIsPrimary(boolean isPrimary) {
		this.isPrimary = isPrimary;
	}
	
	//Getter and setter for: patientRelation
	public String getPatientRelation() {
		return patientRelation;
	}

	public void setPatientRelation(String patientRelation) {
		this.patientRelation = patientRelation;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"PatientCaregiver [caregiver=%s, "
				+ "isPrimary=%b, patientRelation=%s]",
				caregiver.toString(), isPrimary, patientRelation);
	}
	
}