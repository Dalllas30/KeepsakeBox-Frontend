/**
 * V3
 * @author Pedro Neves - fc46430
 */
package com.keepsakeBox.dto;

import java.sql.Date;
import java.sql.Time;

public class Session {
	
	//Definition
		private String id;
		private String caregiver_name;
		private String caregiver_id;
		private String patient_id;
		private String patient_name;

		private String full_name;
		private Date start_session;
	    private Date end_session;
	    private boolean session_finished;
	    private Time duration;
	    private Integer total_images;
	    private Integer patient_feedback;
		private SessionFeedback global_feedback;


		public SessionFeedback getGlobal_feedback() { return global_feedback; }
		public void setGlobal_feedback(SessionFeedback global_feedback) { this.global_feedback = global_feedback;}

		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
		
		public String getCaregiver_name() {
			return caregiver_name;
		}
		public void setCaregiver_name(String caregiver_name) {
			this.caregiver_name = caregiver_name;
		}

		public String getCaregiver_id() {
			return caregiver_id;
		}

		public void setCaregiver_id(String caregiver_id) {
			this.caregiver_id = caregiver_id;
		}
		public String getFull_name() {
			return full_name;
		}

		public void setFull_name(String full_name) {
			this.full_name = full_name;
		}
		public String getPatient_id() {
			return patient_id;
		}
		public void setPatient_id(String patient_id) {
			this.patient_id = patient_id;
		}
		public String getPatient_name() {
			return patient_name;
		}
		public void setPatient_name(String patient_name) {this.patient_name = patient_name;	}
		public boolean isSession_finished() {
			return session_finished;
		}
		public void setSession_finished(boolean session_finished) {
			this.session_finished = session_finished;
		}
		public Time getDuration() {
			return duration;
		}
		public void setDuration(Time duration) {
			this.duration = duration;
		}
		public Integer getTotal_images() {
			return total_images;
		}
		public void setTotal_images(Integer total_images) {
			this.total_images = total_images;
		}
		public Date getStart_session() {
			return start_session;
		}
		public void setStart_session(Date start_session) {
			this.start_session = start_session;
		}
		public Date getEnd_session() {
			return end_session;
		}
		public void setEnd_session(Date end_session) {
			this.end_session = end_session;
		}
		
		public Integer getPatient_feedback() {
			return patient_feedback;
		}
		public void setPatient_feedback(Integer patient_feedback) {
			this.patient_feedback = patient_feedback;
		}
		@Override
		public String toString() {
			return String.format(
					"Session [id=%s, caregiver_name=%s, "
							+ "patient_id=%s, patient_name=%s, start_session=%s, "
							+ "end_session=%s, session_finished=%s, duration=%s, total_images=%s]",
						    id, caregiver_name, patient_id, patient_name, 
						    start_session, end_session, session_finished, duration, total_images);
		}
	    
}
