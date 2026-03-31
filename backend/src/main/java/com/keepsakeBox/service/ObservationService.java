/**
 * V2
 * @author André Santana - fc49451
 * 
 * A service created to manage all the general Observations of a patient.
 */

package com.keepsakeBox.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.ws.http.HTTPException;

import org.springframework.http.HttpStatus;

import com.keepsakeBox.dao.*;
import com.keepsakeBox.dto.AddPatientObservationData;
import com.keepsakeBox.dto.InternalServerErrorException;
import com.keepsakeBox.dto.LoggedSession;
import com.keepsakeBox.dto.PatientObservation;
import com.keepsakeBox.dto.PatientObservationList;
import com.keepsakeBox.dto.UnauthorizedException;

public class ObservationService {
	
	//Class Logger
	Logger logger = Logger.getLogger(ObservationService.class.getName());
	
	//DAO (Data Access Object)
	private ObservationDAO observationDAO = new ObservationDAO();
	
	//Database Connection
	private Connection con = connect();
	private Connection connect() {
		try {
			return DriverManager.getConnection("jdbc:postgresql://localhost:5432/", "postgres", "postgres");
		} catch (SQLException e) {
			logger.warning("Could not connect to the Database.");
			throw new InternalServerErrorException(e.toString());
		}
	}
	

	//Retrieves all patient Observations with given patient ID
	public PatientObservationList getPatientObservationsByPatientId(
			List<LoggedSession> loggedSessions, 
			String token, String patientId) {
		PatientObservationList result = new PatientObservationList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setObservations(observationDAO
						.getPatientObservationsByPatientID(con, patientId));
				logger.info("getPatientObservationsByPatientId [id: " 
					  + patientId + "] responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getPatientObservationsByPatientId [id: " 
		          + patientId + "] responded 401: " + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getPatientObservationsByPatientId [id: " 
		          + patientId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}
	
	//Adds a new patient observation with given data
	public void addPatientObservation(List<LoggedSession> loggedSessions, 
			String token , AddPatientObservationData addPatientObservationData) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				observationDAO
					  .insertPatientObservation(con, addPatientObservationData);
				logger.info("addPatientObservation for patient [id: " 
				      + addPatientObservationData.getPatientId() + "] responded 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("addPatientObservation for patient [id: " 
		          + addPatientObservationData.getPatientId() + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("addPatientObservation for patient [id: " 
		          + addPatientObservationData.getPatientId() + "] responded 500 with: " 
				  + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	//Deletes the patient observation with given ID
	public void deletePatientObservationById(List<LoggedSession> loggedSessions, 
			String token, String observationId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				observationDAO.deletePatientObservationById(con, observationId);
				logger.info("deletePatientObservationById [id: " 
				      + observationId + "] responded 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("deletePatientObservationById [id: " 
		          + observationId + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("deletePatientObservationById [id: " 
		          + observationId + "] responded 500 with: " 
				  + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	//Updates a patient observation with given data
	public void updatePatientObservation(List<LoggedSession> loggedSessions, 
			String token, PatientObservation patientObservation) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				observationDAO.updatePatientObservation(con, patientObservation);
				logger.info("updatePatientObservation [id: " 
				      + patientObservation.getId() + "] responded 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("updatePatientObservation [id: " 
		          + patientObservation.getId() + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("updatePatientObservation [id: " 
		          + patientObservation.getId() + "] responded 500 with: " 
				  + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
		
	}

}
