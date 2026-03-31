/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.util.List;

public class PatientList {

	//Definition
	private List<Patient> patients;

	//Getter and setter for: patients
	public List<Patient> getPatients() {
		return patients;
	}

	public void setPatients(List<Patient> patients) {
		this.patients = patients;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"PatientList [patients=%s]", 
				patients);
	}
}
