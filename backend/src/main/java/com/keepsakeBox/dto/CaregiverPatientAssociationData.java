/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class CaregiverPatientAssociationData {
	
	//Definition
	private String caregiverId;
	private String patientId;
	private String patientRelation;
	
	//Getter and setter for: caregiverId
	public String getCaregiverId() {
		return caregiverId;
	}
	public void setCaregiverId(String caregiverId) {
		this.caregiverId = caregiverId;
	}
	
	//Getter and setter for: patientId
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
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
				"CaregiverPatientAssociationData ["
				+ "caregiverId=%s, patientId=%s, "
				+ "patientRelation=%s]", 
				caregiverId, patientId, patientRelation);
	}
}