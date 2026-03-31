/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class AddPatientObservationData {

	//Definition
	private String patientId;
	private String caregiverId;
	private String observation;
    
    //Getter and setter for: patientId
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	
	//Getter and setter for: caregiverId
	public String getCaregiverId() {
		return caregiverId;
	}
	public void setCaregiverId(String caregiverId) {
		this.caregiverId = caregiverId;
	}

	//Getter and setter for: observation
	public String getObservation() {
		return observation;
	}
	public void setObservation(String observation) {
		this.observation = observation;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"PatientObservationData [patientId=%s, "
				+ "caregiverId=%s, observation=%s]",
				patientId,caregiverId,observation);
	}

	
}