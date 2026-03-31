/**
 * V3
 * @author Pedro Neves - fc46430
 */

package com.keepsakeBox.dto;

import java.sql.Date;

public class SessionFeedback {
	private String id;
	private String session_id;
	private String created_by;
	private Date created_date;
	private Integer patient_feedback;
	private Integer anxiety;
	private Integer agressivity;
	private Integer irritability;
	private Integer commitment;
	private Integer joy;
	private Integer enthusiasm;
	private Integer communication;
	private Integer apathy;
	private Integer patient_agressivity;
	private Integer patient_sadness;
	private Integer patient_isolation;
	private String patient_observation;
	private int duration;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getSession_id() {
		return session_id;
	}
	public void setSession_id(String session_id) {
		this.session_id = session_id;
	}
	public String getCreated_by() {
		return created_by;
	}
	public void setCreated_by(String created_by) {
		this.created_by = created_by;
	}
	public Date getCreated_date() {
		return created_date;
	}
	public void setCreated_date(Date created_date) {
		this.created_date = created_date;
	}
	public Integer getPatient_feedback() {
		return patient_feedback;
	}
	public void setPatient_feedback(Integer patient_feedback) {
		this.patient_feedback = patient_feedback;
	}
	public Integer getAnxiety() {
		return anxiety;
	}
	public void setAnxiety(Integer anxiety) {
		this.anxiety = anxiety;
	}
	public Integer getAgressivity() {
		return agressivity;
	}
	public void setAgressivity(Integer agressivity) {
		this.agressivity = agressivity;
	}
	public Integer getIrritability() {
		return irritability;
	}
	public void setIrritability(Integer irritability) {
		this.irritability = irritability;
	}
	public Integer getCommitment() {
		return commitment;
	}
	public void setCommitment(Integer commitment) {
		this.commitment = commitment;
	}
	public Integer getJoy() {
		return joy;
	}
	public void setJoy(Integer joy) {
		this.joy = joy;
	}
	public Integer getEnthusiasm() {
		return enthusiasm;
	}
	public void setEnthusiasm(Integer enthusiasm) {
		this.enthusiasm = enthusiasm;
	}
	public Integer getCommunication() {
		return communication;
	}
	public void setCommunication(Integer communication) {
		this.communication = communication;
	}
	public Integer getApathy() {
		return apathy;
	}
	public void setApathy(Integer apathy) {
		this.apathy = apathy;
	}
	public Integer getPatient_agressivity() {
		return patient_agressivity;
	}
	public void setPatient_agressivity(Integer patient_agressivity) {
		this.patient_agressivity = patient_agressivity;
	}
	public Integer getPatient_sadness() {
		return patient_sadness;
	}
	public void setPatient_sadness(Integer patient_sadness) {
		this.patient_sadness = patient_sadness;
	}
	public Integer getPatient_isolation() {
		return patient_isolation;
	}
	public void setPatient_isolation(Integer patient_isolation) {
		this.patient_isolation = patient_isolation;
	}
	public String getPatient_observation() {
		return patient_observation;
	}
	public void setPatient_observation(String patient_observation) {
		this.patient_observation = patient_observation;
	}
	public int getDuration() {
		return duration;
	}
	public void setDuration(int duration) {
		this.duration = duration;
	}
	
	//For Logging Proposes
	@Override
	public String toString() {
		return String.format(
				"Sessionfeedback [session_id=%s, created_by=%s, created_date=%s, patient_feedback=%s, patient_agressivity=%s, patient_sadness=%s, patient_isolation=%s, patient_observation=%s]",
				session_id, created_by, created_date, patient_feedback, patient_agressivity, patient_sadness, patient_isolation, patient_observation);
	}	

}
