/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.util.List;

public class PatientObservationList {
	
	//Definition
	private List<PatientObservation> observations;

	//Getter and setter for: observations
	public List<PatientObservation> getObservations() {
		return observations;
	}
	public void setObservations(List<PatientObservation> observations) {
		this.observations = observations;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"PatientObservationList [observations=%s]", 
				observations);
	}

}
