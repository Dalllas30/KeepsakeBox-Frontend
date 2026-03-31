/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.ws.http.HTTPException;

import org.springframework.http.HttpStatus;

import com.keepsakeBox.dao.PatientDAO;
import com.keepsakeBox.dto.*;

public class PatientService {
	
	//Logger
	Logger logger = Logger.getLogger(PatientService.class.getName());
	
	//DAO (Data Access Objects)
	private PatientDAO patientDAO = new PatientDAO();
	
	//Services
	private FileStorageService fileStorageService = new FileStorageService();
	
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
	 * Retrieves all data from caregivers associated to a patient 
	 * with given patient ID
	 */
	public PatientCaregiverList getPatientCaregiversByPatientID(
			List<LoggedSession> loggedSessions, String token, String patientId) {
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
				Patient patient = patientDAO
						.getPatientById(con, patientId, actual.getCaregiverID());
				result.setCaregivers(patientDAO
						.getPatientCaregiversById(con, patient.getId()));
				logger.info("getPatientCaregiversByPatientID [id: " 
					  + patientId + "] responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getPatientCaregiversByPatientID [id: " 
		          + patientId + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getPatientCaregiversByPatientID [id: " 
		          + patientId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}
	
	//Retrieves a patient data with given patient ID
	public Patient getPatientByID(List<LoggedSession> loggedSessions, 
			String token, String patientId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				Patient patient = patientDAO
						.getPatientById(con, patientId, actual.getCaregiverID());
				logger.info("getPatientByID [id: " 
					  + patientId + "] responded 200: ");
				return patient;
			} else {
				logger.warning("getPatientByID [id: " 
					  + patientId + "] responded 401: ");
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getPatientByID [id: " 
				  + patientId + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getPatientByID [id: " 
				  + patientId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	//Retrieves a patient data with given patient ID
	public ResponseBasic getPatientNameByID(List<LoggedSession> loggedSessions, 
			String token, String patientId) {
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
				String patient_name = patientDAO
						.getPatientNameById(con, patientId);
				logger.info("getPatientNameByID [id: " 
					  + patientId + "] responded 200: ");
				result.setResult(patient_name);
				return result;
			} else {
				logger.warning("getPatientNameByID [id: " 
					  + patientId + "] responded 401: ");
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getPatientNameByID [id: " 
				  + patientId + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getPatientNameByID [id: " 
				  + patientId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}
	/**
	 * Updates a patient with given caregiver token and
	 * patient data needed for the update
	 */
	public void updatePatientInfo(List<LoggedSession> loggedSessions, 
			String token, Patient patient) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				String imageName = 
						patient.getId() + ".jpeg";
				fileStorageService.uploadPatientProfileImage(
						patient.getProfileImageURL(), imageName);
				patientDAO.updatePatientInfo(con, patient);
				logger.info("updatePatientInfo [id: " 
					  + patient.getId() + "] responded 200: ");
			} else {
				logger.warning("updatePatientInfo [id: " 
					  + patient.getId() + "] responded 401: ");
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("updatePatientInfo [id: " 
				  + patient.getId() + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("updatePatientInfo [id: " 
				  + patient.getId() + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
		
	}	
}
