/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 * @author Bruna Vieites - fc55792
 */

package com.keepsakeBox.dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.keepsakeBox.dto.*;
import com.keepsakeBox.service.FileStorageService;

public class PatientDAO {
	
	//Logger
	Logger logger = Logger.getLogger(PatientDAO.class.getName());
	
	//Services
	private FileStorageService fileStorageService = new FileStorageService();
	
	//Inserts a new patient into the DB with given patient register data
	public String insertPatient(Connection con, 
			PatientRegisterData patientRegisterData) 
			throws SQLException {
		String result = null;
		Statement stmt = null;
		String query = String.format("INSERT INTO "
				+ "patient(name, "
				+ "display_name, "
				+ "birth_date, "
				+ "education, "
				+ "created_date, "
				+ "last_updated_date, "
				+ "interests, "
				+ "cities) "
				+ "VALUES('%s', '%s', '%s', '%s', "
				+ "now(), now(), '%s', '%s') RETURNING id;", 
				patientRegisterData.getName(), 
				patientRegisterData.getDisplayName(), 
				patientRegisterData.getBirthDate(),
				patientRegisterData.getEducation(),
				patientRegisterData.getInterests(),
				patientRegisterData.getCities());

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result = rs.getString("id");
			}
			logger.info("insertPatient " + patientRegisterData.getName() 
				  + " ] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("insertPatient " + patientRegisterData.getName()  
				  + " ] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//Retrieves all caregivers associated to the given patient ID from the DB
	public List<PatientCaregiver> getPatientCaregiversById(Connection con, 
			String patientId) throws SQLException {
		List<PatientCaregiver> result = new ArrayList<PatientCaregiver>();
		Statement stmt = null;
		String query = String.format(
				"SELECT p.caregiver_id, "
				+ "p.is_primary, "
				+ "p.patient_relation, "
				+ "c.name, "
				+ "c.email, "
				+ "c.phone, "
				+ "c.birth_date, "
				+ "c.type, "
				+ "c.speciality, "
				+ "c.is_active "
				+ "FROM caregiver_patient p "
				+ "inner join caregiver c "
				+ "on c.id = p.caregiver_id "
				+ "WHERE p.patient_id = '%s';",patientId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				Caregiver caregiver = new Caregiver();
				caregiver.setId(rs.getString("caregiver_id"));
				caregiver.setName(rs.getString("name"));
				caregiver.setEmail(rs.getString("email"));
				caregiver.setPhone(rs.getString("phone"));
				caregiver.setBirthDate(rs.getDate("birth_date"));
				caregiver.setProfileImageURL(
				fileStorageService.loadCaregiverProfileImage(
						rs.getString("caregiver_id") + ".jpeg"));
				caregiver.setType(rs.getString("type"));
				caregiver.setSpeciality(rs.getString("speciality"));
				caregiver.setIsActive(rs.getBoolean("is_active"));
				PatientCaregiver patientCaregiver = new PatientCaregiver();
				patientCaregiver.setCaregiver(caregiver);
				patientCaregiver.setIsPrimary(rs.getBoolean("is_primary"));
				patientCaregiver.setPatientRelation(rs.getString("patient_relation"));
				result.add(patientCaregiver);
			}
			logger.info("getPatientCaregiversById wuth patient [id:" + patientId 
				  + "] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getPatientCaregiversById with patient [id:" + patientId
				  + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	/**
	 * Retrieves from the DB all IDs from the caregivers 
	 * associated to the given patient ID 
	 */
	public List<String> getPatientCaregiversIDsById(Connection con, 
			String patientId) throws SQLException {
		List<String> result = new ArrayList<String>();
		Statement stmt = null;
		String query = String.format(
				"SELECT c.caregiver_id "
				+ "FROM caregiver_patient c "
				+ "WHERE c.patient_id = '%s';",patientId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result.add(rs.getString("caregiver_id"));
			}
			logger.info("getPatientCaregiversIDsById wuth patient [id:" + patientId 
				  + "] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getPatientCaregiversIDsById with patient [id:" + patientId 
				  + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	/**
	 * Retrieves a patient from the DB with given ID
	 * and also the caregiver ID so we can also retrieve his chat data
	 */
	public Patient getPatientById(
			Connection con, String patientId, String caregiverId) throws SQLException {
		Patient patient = new Patient();
		Statement stmt = null;
		String query = String.format("select "
				+ "	patient.name,"
				+ "	patient.display_name,"
				+ "	patient.birth_date,"
				+ "	patient.education,"
				+ "	patient.is_active,"
				+ "	(select max(s.start_session_date)"
				+ " from session s where s.patient_id = patient.id)"
				+ " start_session_date,"
				+ "	patient_chat.id as chat_id,"
				+ "	patient_chat.last_message_sent_date,"
				+ "	caregiver_patient_chat.last_message_read_date"
				+ " from patient"
				+ " join caregiver_patient"
				+ "	on patient.id = caregiver_patient.patient_id"
				+ " join patient_chat"
				+ "	on patient.id = patient_chat.patient_id"
				+ " join caregiver_patient_chat"
				+ "	on caregiver_patient_chat.caregiver_id = caregiver_patient.caregiver_id"
				+ " and caregiver_patient_chat.patient_chat_id = patient_chat.id"
				+ " where caregiver_patient.caregiver_id = '%s' and patient.id='%s';",
				caregiverId,
				patientId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				patient.setId(patientId);
				patient.setName(rs.getString("name"));
				patient.setDisplayName(rs.getString("display_name"));
				patient.setBirthDate(rs.getDate("birth_date"));
				patient.setEducation(rs.getString("education"));
				patient.setProfileImageURL(
				fileStorageService.loadPatientProfileImage(patientId + ".jpeg"));
				patient.setIsActive(rs.getBoolean("is_active"));
				patient.setLastSession(rs.getDate("start_session_date"));
				PatientChat chat =  new PatientChat();
				chat.setId(rs.getString("chat_id"));
				chat.setLastMessageSentDate(
						rs.getTimestamp("last_message_sent_date"));
				chat.setLastMessageReadDate(
						rs.getTimestamp("last_message_read_date"));
				patient.setChat(chat);
			}
			logger.info("getPatientByID [id: " + patientId 
				  + "] returned -> " + patient.toString());
			return patient;
		} catch (SQLException e) {
			logger.warning("getPatientByID [id: " + patientId 
				  + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Retrieves a patient from the DB with given ID
	 * and also the caregiver ID so we can also retrieve his chat data
	 */
	public String getPatientNameById(
			Connection con, String patientId) throws SQLException {
		String patient_name = "";
		Statement stmt = null;
		String query = String.format("SELECT "
				+ "p.name, "
				+ "p.display_name "
				+ "FROM patient p "
				+ "WHERE p.id='%s';",
				patientId);

		try {
			stmt = con.createStatement();
			logger.info(" >>>>>>LOG INFO TO DELETE >>>>>>>>>>> getImagesByCategory SQL Query: " + query);
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				if (rs.getString("display_name").equals("")) {
					patient_name = rs.getString("name");
				} else {
					patient_name = rs.getString("display_name");
				}
			}
			logger.info("getPatientNameByID [id: " + patientId 
				  + "] returned -> " + patient_name);
			return patient_name;
		} catch (SQLException e) {
			logger.warning("getPatientNameByID [id: " + patientId 
				  + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	/**
	 * Updates a patient info with given patient data
	 */
	public void updatePatientInfo(Connection con, Patient patient) 
			throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"UPDATE patient SET "
				+ "name='%s', "
				+ "display_name='%s', "
				+ "birth_date='%s', "
				+ "education='%s', "
				+ "last_updated_date= now() WHERE id='%s' "
				+ "RETURNING id;", 
				patient.getName(),
				patient.getDisplayName(),
				patient.getBirthDate(),
				patient.getEducation(),
				patient.getId());

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("updatePatientInfo for patient "
				  + "[id: " + patient.getId()
				  + "] returned 200.");
		} catch (SQLException e) {
			logger.warning("updatePatientInfo for patient " 
				  + "[id: " + patient.getId()
			  	  + "] returned error:" + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		
	}

	/**
	 * Removes a caregiver from a patient
	 */
	public void removeCaregiverFromPatient(Connection con, 
			String caregiverId, String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"DELETE FROM caregiver_patient "
				+ "WHERE caregiver_id='%s' AND patient_id='%s' "
				+ "RETURNING caregiver_id;",
				caregiverId,
				patientId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("removeCaregiverFromPatient with caregiver [id: " 
			      + caregiverId + "] and patient with [id: "
			      + patientId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("removeCaregiverFromPatient with caregiver [id: " 
				      + caregiverId + "] and patient with [id: "
				      + patientId + "] returned error: " 
				  + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		
	}

	//Retrieves from the DB simple caregiver data associated to given ID
	public SimplePatient getSimplePatientById(Connection con, String patientId)
			throws SQLException {
		SimplePatient patient = new SimplePatient();
		Statement stmt = null;
		String query = String.format(
				"SELECT name, display_name "
				+ "FROM patient WHERE id = '%s';",
				patientId);
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				patient.setId(patientId);
				patient.setName(rs.getString("name"));
				patient.setDisplayName(rs.getString("display_name"));
				patient.setProfileImageURL(
						fileStorageService.loadPatientProfileImage(patientId + ".jpeg"));
				System.out.println(patient);
			}
			logger.info("getSimplePatientById with patient "
					+ "[id: " + patientId + "] returned -> " + patient);
			return patient;
		} catch (SQLException e) {
			logger.warning("getSimplePatientById with patient "
					+ "[id: " + patientId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
}
