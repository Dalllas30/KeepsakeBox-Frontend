/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class PatientTag {

	//Definition
	private String patientId;
	private String tagId;
	private int nrNegative;
	private int nrNeutral;
	private int nrPositive;

	//Getter and setter for: tagId
	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
		
	//Getter and setter for: tagId
	public String getTagId() {
		return tagId;
	}

	public void setTagId(String tagId) {
		this.tagId = tagId;
	}
	
	//Getter and setter for: nrNegative
	public int getNrNegative() {
		return nrNegative;
	}

	public void setNrNegative(int nrNegative) {
		this.nrNegative = nrNegative;
	}
	
	//Getter and setter for: nrNeutral
	public int getNrNeutral() {
		return nrNeutral;
	}

	public void setNrNeutral(int nrNeutral) {
		this.nrNeutral = nrNeutral;
	}

	//Getter and setter for: nrPositive
	public int getNrPositive() {
		return nrPositive;
	}

	public void setNrPositive(int nrPositive) {
		this.nrPositive = nrPositive;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"PatientTag [patientId=%s, tagId=%s, "
				+ "nrNegative=%d, nrNeutral=%d, nrPositive=%d]",
				patientId,tagId,nrNegative,nrNeutral,nrPositive);
	}
}