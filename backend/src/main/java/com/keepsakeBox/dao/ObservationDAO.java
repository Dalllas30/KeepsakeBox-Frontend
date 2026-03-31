/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.keepsakeBox.dto.PatientObservation;
import com.keepsakeBox.dto.AddPatientObservationData;

public class ObservationDAO {
	
	//Class Logger
	Logger logger = Logger.getLogger(ObservationDAO.class.getName());
	
	//DAO (Data Access Objects)
	private CaregiverDAO caregiverDAO = new CaregiverDAO();
	
	//Insers a new patient observation into the DB
	public void insertPatientObservation(Connection con, 
			AddPatientObservationData addPatientObservationData) 
			throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO patient_observation ("
				+ "patient_id, "
				+ "caregiver_id, "
				+ "observation, "
				+ "last_updated_date) "
				+ "VALUES('%s','%s','%s', now()) RETURNING id;",
				addPatientObservationData.getPatientId(), 
				addPatientObservationData.getCaregiverId(), 
				addPatientObservationData.getObservation());
		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("insertPatientObservation for patient [id: " 
				  + addPatientObservationData.getPatientId() + "] returned -> " 
				  + addPatientObservationData.toString());
		} catch (SQLException e) {
			logger.warning("insertPatientObservation for patient [id: " 
		          + addPatientObservationData.getPatientId() + "] returned error: " 
				  + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//Updates a patient observation data on the DB with given data
	public void updatePatientObservation(Connection con, 
			PatientObservation patientObservation) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"UPDATE patient_observation "
				+ "SET observation='%s', "
				+ "last_updated_date=now() "
				+ "WHERE id='%s' RETURNING id;",
				patientObservation.getObservation(), 
				patientObservation.getId());

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("updatePatientObservation with observation [id: " 
			      + patientObservation.getId() + "] returned 200");
		} catch (SQLException e) {
			logger.warning("updatePatientObservation with observation [id: " 
		          + patientObservation.getId() + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//Deletes a patient observation with given ID from the DB
	public void deletePatientObservationById(Connection con, 
			String observationId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"DELETE FROM patient_observation "
				+ "WHERE id='%s' RETURNING id;",
				observationId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("deletePatientObservationById [id: " 
			      + observationId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("deletePatientObservationById [id: " 
		          + observationId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//Retrieves a patient observation from DB with given ID
	public PatientObservation getPatientObservation(Connection con, String observationID) throws SQLException {
		PatientObservation result = new PatientObservation();
		Statement stmt = null;
		String query = String.format(
				"SELECT p.patient_id, "
				+ "p.caregiver_id, "
				+ "p.observation, "
				+ "p.last_updated_date "
				+ "FROM patient_observation p "
				+ "WHERE p.id = '%s';",observationID);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				PatientObservation observation = new PatientObservation();
				observation.setId(observationID);
				observation.setPatientId(rs.getString("patient_id"));
				observation.setCaregiver(
				caregiverDAO.getSimpleCaregiverById(con, 
						rs.getString("caregiver_id")));
				observation.setObservation(rs.getString("observation"));
				observation.setLastUpdatedDate(
						rs.getTimestamp("last_updated_date"));
				result = observation;
			}
			logger.info("getPatientObservation with observation [id: " 
			      + observationID + "] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getPatientObservation with observation [id: " 
		          + observationID + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//Retrieves all patient observations from DB with given patient ID
	public List<PatientObservation> getPatientObservationsByPatientID(
			Connection con, String patientID) throws SQLException {
		List<PatientObservation> result = new ArrayList<PatientObservation>();
		Statement stmt = null;
		String query = String.format(
				"SELECT p.id, "
				+ "p.caregiver_id, "
				+ "p.observation, "
				+ "p.last_updated_date "
				+ "FROM patient_observation p "
				+ "WHERE p.patient_id = '%s';",patientID);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				PatientObservation observation = new PatientObservation();
				observation.setId(rs.getString("id"));
				observation.setPatientId(patientID);
				observation.setCaregiver(
				caregiverDAO.getSimpleCaregiverById(con, 
						rs.getString("caregiver_id")));
				observation.setObservation(rs.getString("observation"));
				observation.setLastUpdatedDate(
						rs.getTimestamp("last_updated_date"));
				result.add(observation);
			}
			logger.info("getPatientObservationsByPatientID with patient [id: " 
				  + patientID + "] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getPatientObservationsByPatientID with patient [id: " 
		          + patientID + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

}
