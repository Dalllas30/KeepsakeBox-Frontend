/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Timestamp;

public class PatientObservation {

	//Definition
	private String id;
	private String patientId;
	private SimpleCaregiver caregiver;
	private String observation;
    private Timestamp lastUpdatedDate;
    
    //Getter and setter for: id
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	//Getter and setter for: patientId
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	
	//Getter and setter for: caregiver
	public SimpleCaregiver getCaregiver() {
		return caregiver;
	}
	public void setCaregiver(SimpleCaregiver caregiver) {
		this.caregiver = caregiver;
	}

	//Getter and setter for: observation
	public String getObservation() {
		return observation;
	}

	public void setObservation(String observation) {
		this.observation = observation;
	}

	//Getter and setter for: lastUpdatedDate
	public Timestamp getLastUpdatedDate() {
		return lastUpdatedDate;
	}

	public void setLastUpdatedDate(Timestamp lastUpdatedDate) {
		this.lastUpdatedDate = lastUpdatedDate;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"PatientObservation [id=%s, patientId=%s, "
				+ "caregiver=%s, observation=%s, lastUpdatedDate=%s]",
			    id,patientId,caregiver,observation,lastUpdatedDate);
	}

	
}