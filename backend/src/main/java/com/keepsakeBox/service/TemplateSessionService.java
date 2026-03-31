package com.keepsakeBox.service;

import java.util.ArrayList;
import java.util.List;

import javax.xml.ws.http.HTTPException;

import com.keepsakeBox.dto.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.ws.http.HTTPException;

import org.springframework.http.HttpStatus;

import com.keepsakeBox.dao.ImageDAO;
import com.keepsakeBox.dao.TemplateSessionDAO;
import com.keepsakeBox.dao.TemplateSessionImageDAO;

public class TemplateSessionService {
	
	Logger logger = Logger.getLogger(PatientService.class.getName());
	
	private CaregiverService caregiver = new CaregiverService();
	private TemplateSessionDAO templateSessionDAO = new TemplateSessionDAO();
	private ImageDAO imageDAO = new ImageDAO();
	private TemplateSessionImageDAO templateSessionImageDAO= new TemplateSessionImageDAO();
	
	//Database Connection
		private Connection con = connect();
		private Connection connect() {
			try {
				return DriverManager.getConnection("jdbc:postgresql://localhost:5432/", "postgres", "postgres");
			} catch (SQLException e) {
				logger.warning("Could not connect to Database.");
				throw new InternalServerErrorException(e.toString());
			}
		}

		/**
		 * Retrieves all sessions from a patient with a given patient ID
		 */
		public TemplateSessionList getTemplateSessionList(List<LoggedSession> loggedSessions, String token,
				String patientId, String filter, String count) {
			
			TemplateSessionList result = new TemplateSessionList();
			LoggedSession actual = new LoggedSession(null, null, null);
			for (int i = 0; i < loggedSessions.size(); i++) {
				if (loggedSessions.get(i).getToken().equals(token)) {
					actual = loggedSessions.get(i);
					break;
				}
			}
			
			try {
				if (actual.getToken() != null && !actual.getToken().isEmpty()) {
					
					PatientList pl = caregiver.getCaregiverPatientsByToken(loggedSessions, token, actual.getCaregiverID(), patientId);
					String spl = "";
					for (int i=0 ; i<pl.getPatients().size(); i++) {
						if (spl.length()==0) {
							spl = "'" + pl.getPatients().get(i).getId() + "'";
						} else {
							spl = spl + ", '" + pl.getPatients().get(i).getId() + "'";
						}
					}

					result.setTemplateSessions(templateSessionDAO.getTemplateSessionList(con, patientId, actual.getCaregiverID(),filter, count, spl));
					logger.info("getTemplateSessionList [patient_id: " + patientId
							  + ", caregiver_id: " + actual.getCaregiverID()
							  + "] responded 200:" + result.toString());
					return result;
				} else {
					throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
				}
			} catch (HTTPException e) {
				logger.warning("getTemplateSessionList [patient_id: " + patientId
						  + ", caregiver_id: " + actual.getCaregiverID()
						  + "] responded 401:" + e.toString());
					throw new UnauthorizedException("user or password incorrect");
				} catch (Exception e) {
					logger.warning("getTemplateSessionList [patient_id: " + patientId
							  + ", caregiver_id: " + actual.getCaregiverID()
							  + "] responded 500 with:" + e.toString());
					throw new InternalServerErrorException(e.toString());
				}
			
		}

		/**
		 * create a template session with data passed through service 
		 */
		public ResponseBasic createTemplateSession(List<LoggedSession> loggedSessions,
				String token, TemplateSessionData templateSessionData) {
			
			ResponseBasic result = new ResponseBasic();
			LoggedSession actual = new LoggedSession(null, null, null);
			for (int i = 0; i < loggedSessions.size(); i++) {
				if (loggedSessions.get(i).getToken().equals(token)) {
					actual = loggedSessions.get(i);
					break;
				}
			}
			
			try {
				if (actual.getToken() != null && !actual.getToken().isEmpty()) {

					List<TemplateSessionImage> imageList = new ArrayList<TemplateSessionImage>();
					if (templateSessionData.getCreation_type()==1) { // Manual creation
						for (int i=0; i < templateSessionData.getTotal_images(); i++) {
							imageList.add(new TemplateSessionImage(templateSessionData.getImage_list()[i], i+1)); 
						}
					} else { // Automatic or Semi-Automatic creation
						List<PersonalImage> patientIimageList = imageDAO.getPatientPersonalImagesByPatientId(con, templateSessionData.getPatient_id());
						for (int i=0; i < templateSessionData.getTotal_images(); i++ ) {
							TemplateSessionImage tsi = new TemplateSessionImage();
							if (i < patientIimageList.size()) {
								tsi.setImage_id(patientIimageList.get(i).getImage().getId());
							} else {
								tsi.setImage_id(patientIimageList.get(patientIimageList.size()-1).getImage().getId());
							}
							tsi.setPosition_image(i+1);
							imageList.add(tsi);
						}
					}
					String templateSessionId = templateSessionDAO.
							createTemplateSession(con,actual.getCaregiverID(), templateSessionData, imageList);
					logger.info("createTemplateSession with caregiver id " + templateSessionData.getCaregiver_id() + " [new template_session_id: " + templateSessionId
							  + "] responded 200:" + result.toString());
					result.setResult(templateSessionId);
					return result;
				} else {
					throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
				}
			} catch (HTTPException e) {
				logger.warning("createTemplateSession with caregiver id " + templateSessionData.getCaregiver_id()
						  + " responded 401:" + e.toString());
					throw new UnauthorizedException("user or password incorrect");
				} catch (Exception e) {
					logger.warning("createTemplateSession with caregiver id " + templateSessionData.getCaregiver_id()
							  + "] responded 500 with:" + e.toString());
					throw new InternalServerErrorException(e.toString());
				}
			
		}
		
		/**
		 * update a template session with data passed through service 
		 */
		public ResponseBasic updateTemplateSession(List<LoggedSession> loggedSessions,
				String token, TemplateSessionData templateSessionData, String templateSessionId) {
			
			ResponseBasic result = new ResponseBasic();
			LoggedSession actual = new LoggedSession(null, null, null);
			for (int i = 0; i < loggedSessions.size(); i++) {
				if (loggedSessions.get(i).getToken().equals(token)) {
					actual = loggedSessions.get(i);
					break;
				}
			}
			
			try {
				if (actual.getToken() != null && !actual.getToken().isEmpty()) {
					List<TemplateSessionImage> imageList = new ArrayList<TemplateSessionImage>();
					for (int i=0; i < templateSessionData.getTotal_images(); i++) {
						imageList.add(new TemplateSessionImage(templateSessionData.getImage_list()[i], i+1)); 
					}
					String rtemplateSessionId = templateSessionDAO.
							updateTemplateSession(con,actual.getCaregiverID(), templateSessionData, templateSessionId, imageList);
					logger.info("updateTemplateSession with caregiver id " + templateSessionData.getCaregiver_id() + " [template_session_id: " + templateSessionId
							  + "] responded 200:" + result.toString());
					result.setResult(rtemplateSessionId);
					return result;
				} else {
					throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
				}
			} catch (HTTPException e) {
				logger.warning("updateTemplateSession with caregiver id " + templateSessionData.getCaregiver_id()
						  + " responded 401:" + e.toString());
					throw new UnauthorizedException("user or password incorrect");
				} catch (Exception e) {
					logger.warning("updateTemplateSession with caregiver id " + templateSessionData.getCaregiver_id()
							  + "] responded 500 with:" + e.toString());
					throw new InternalServerErrorException(e.toString());
				}
			
		}

		/**
		 * remove a template session with data passed through service 
		 */
		public void removeTemplateSession(List<LoggedSession> loggedSessions, 
				String token, String templateSessionId, String patientId) {
			
			LoggedSession actual = new LoggedSession(null, null, null);
			for (int i = 0; i < loggedSessions.size(); i++) {
				if (loggedSessions.get(i).getToken().equals(token)) {
					actual = loggedSessions.get(i);
					break;
				}
			}
			try {
				if (actual.getToken() != null && !actual.getToken().isEmpty()) {
					
					templateSessionDAO.removeTemplateSession(con, templateSessionId, patientId);
					logger.info("removeTemplateSession with [id: " 
					      + templateSessionId + "] returned 200");
				} else {
					throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
				}
			} catch (HTTPException e) {
				logger.warning("removeTemplateSession with [id: "  
					      + templateSessionId + "] returned 401");
				throw new UnauthorizedException("user or password incorrect");
			} catch (Exception e) {
				logger.warning("removeTemplateSession with [id: " 
					      + templateSessionId + "] returned 500 with: " + e.toString());
				throw new InternalServerErrorException(e.toString());
			}
			
		}

		/**
		 * start a RT Session based on a given template session id
		 */
		public ResponseBasic startSessionFromTemplateSession(List<LoggedSession> loggedSessions,
				String token, String templateSessionId, String patientId) {
			
			ResponseBasic result = new ResponseBasic();
			LoggedSession actual = new LoggedSession(null, null, null);
			for (int i = 0; i < loggedSessions.size(); i++) {
				if (loggedSessions.get(i).getToken().equals(token)) {
					actual = loggedSessions.get(i);
					break;
				}
			}
			
			try {
				if (actual.getToken() != null && !actual.getToken().isEmpty()) {
					List<TemplateSessionImage> imageList = templateSessionImageDAO.getTemplateSessionImagesByTemplateSessionId(con, templateSessionId);					
					String sessionId = templateSessionDAO.
							createRunningSessionFromTemplateSession(con, templateSessionId, actual.getCaregiverID(), patientId, imageList);
					logger.info("startSessionFromTemplateSession with template session id " + templateSessionId
							  + "] responded 200:" + result.toString());
					result.setResult(sessionId);
					return result;
				} else {
					throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
				}
			} catch (HTTPException e) {
				logger.warning("startSessionFromTemplateSession with template session id " + templateSessionId
						  + " responded 401:" + e.toString());
					throw new UnauthorizedException("user or password incorrect");
				} catch (Exception e) {
					logger.warning("startSessionFromTemplateSession with template session id " + templateSessionId
							  + "] responded 500 with:" + e.toString());
					throw new InternalServerErrorException(e.toString());
				}
			
		}
		
		/**
		 * Gets a list of patients associated to the template session for a caregiver with
		 * the given session token
		 */
		public PatientList getCaregiverPatientsByTemplateSessionId(
				List<LoggedSession> loggedSessions, String token, String caregiverId, String templateSessionId) {
			PatientList result = new PatientList();
			LoggedSession actual = new LoggedSession(null, null, null);
			for (int i = 0; i < loggedSessions.size(); i++) {
				if (loggedSessions.get(i).getToken().equals(token)) {
					actual = loggedSessions.get(i);
					break;
				}
			}
			try {
				if (actual.getToken() != null && !actual.getToken().isEmpty()) {
					result.setPatients(templateSessionDAO
							.getCaregiverPatientsByTemplateSessionId(con, actual.getCaregiverID(), templateSessionId));
					logger.info("getCaregiverPatientsByTemplateSessionId for templateSession [templateSession: " 
						  + templateSessionId + ", caregiver: " + caregiverId + "] returned 200: " + result.toString());
					return result;
				} else {
					throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
				}
			} catch (HTTPException e) {
				logger.warning("getCaregiverPatientsByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + ", caregiver: " + caregiverId + "] responded 401");
				throw new UnauthorizedException("user or password incorrect");
			} catch (Exception e) {
				logger.warning("getCaregiverPatientsByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + ", caregiver: " + caregiverId + "] responded 500 with: " + e.toString());
				throw new InternalServerErrorException(e.toString());
			}
		}
		
		/**
		 * updates a list of patients associated to the template session for a caregiver with
		 * the given session token
		 */
		public ResponseBasic updateCaregiverPatientsByTemplateSessionId(
				List<LoggedSession> loggedSessions, String token, String templateSessionId, String[] patientList) {
			ResponseBasic result = new ResponseBasic();
			LoggedSession actual = new LoggedSession(null, null, null);
			for (int i = 0; i < loggedSessions.size(); i++) {
				if (loggedSessions.get(i).getToken().equals(token)) {
					actual = loggedSessions.get(i);
					break;
				}
			}
			try {
				if (actual.getToken() != null && !actual.getToken().isEmpty()) {
					String rtemplateSessionId = templateSessionDAO
							.updateCaregiverPatientsByTemplateSessionId(con, templateSessionId, patientList);
					logger.info("updateCaregiverPatientsByTemplateSessionId for templateSession [templateSession: " 
						  + templateSessionId + "] returned 200: " + result.toString());
					result.setResult(rtemplateSessionId);
					return result;
				} else {
					throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
				}
			} catch (HTTPException e) {
				logger.warning("updateCaregiverPatientsByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + "] responded 401");
				throw new UnauthorizedException("user or password incorrect");
			} catch (Exception e) {
				logger.warning("updateCaregiverPatientsByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + "] responded 500 with: " + e.toString());
				throw new InternalServerErrorException(e.toString());
			}
		}
		
		/**
		 * Gets a list of caregivers associated to the patient of a selected template session Id with
		 * the given session token
		 */
		public PatientCaregiverList getCaregiversByTemplateSessionId(
				List<LoggedSession> loggedSessions, String token, String templateSessionId, String patientId) {
			PatientCaregiverList result = new PatientCaregiverList();
			LoggedSession actual = new LoggedSession(null, null, null);
			for (int i = 0; i < loggedSessions.size(); i++) {
				if (loggedSessions.get(i).getToken().equals(token)) {
					actual = loggedSessions.get(i);
					break;
				}
			}
			try {
				if (actual.getToken() != null && !actual.getToken().isEmpty()) {
					result.setCaregivers(templateSessionDAO
							.getCaregiversByTemplateSessionId(con, actual.getCaregiverID(), templateSessionId, patientId));
					logger.info("getCaregiversByTemplateSessionId for templateSession [templateSession: " 
						  + templateSessionId + "] returned 200: " + result.toString());
					return result;
				} else {
					throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
				}
			} catch (HTTPException e) {
				logger.warning("getCaregiversByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + "] responded 401");
				throw new UnauthorizedException("user or password incorrect");
			} catch (Exception e) {
				logger.warning("getCaregiversByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + "] responded 500 with: " + e.toString());
				throw new InternalServerErrorException(e.toString());
			}
		}
		
		/**
		 * updates a list of caregivers associated to the template session with
		 * the given session token
		 */
		public ResponseBasic updateCaregiversByTemplateSessionId(
				List<LoggedSession> loggedSessions, String token, String templateSessionId, String[] caregiverList) {
			ResponseBasic result = new ResponseBasic();
			LoggedSession actual = new LoggedSession(null, null, null);
			for (int i = 0; i < loggedSessions.size(); i++) {
				if (loggedSessions.get(i).getToken().equals(token)) {
					actual = loggedSessions.get(i);
					break;
				}
			}
			try {
				if (actual.getToken() != null && !actual.getToken().isEmpty()) {
					String rtemplateSessionId = templateSessionDAO
							.updateCaregiversByTemplateSessionId(con, templateSessionId, caregiverList);
					logger.info("updateCaregiversByTemplateSessionId for templateSession [templateSession: " 
						  + templateSessionId + "] returned 200: " + result.toString());
					result.setResult(rtemplateSessionId);
					return result;
				} else {
					throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
				}
			} catch (HTTPException e) {
				logger.warning("updateCaregiversByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + "] responded 401");
				throw new UnauthorizedException("user or password incorrect");
			} catch (Exception e) {
				logger.warning("updateCaregiversByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + "] responded 500 with: " + e.toString());
				throw new InternalServerErrorException(e.toString());
			}
		}


}
