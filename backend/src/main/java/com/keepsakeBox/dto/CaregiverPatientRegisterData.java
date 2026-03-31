/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class CaregiverPatientRegisterData {
	
	//Definition
	private PatientRegisterData patient;
	private String patientRelation;
	
	//Getter and setter for: patient
	public PatientRegisterData getPatient() {
		return patient;
	}
	public void setPatient(PatientRegisterData patient) {
		this.patient = patient;
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
			  "CaregiverPatientRegisterData "
			  + "[patient=%s, patientRelation=%s]",
			  patient.toString(), patientRelation);
	}
	
	
}
