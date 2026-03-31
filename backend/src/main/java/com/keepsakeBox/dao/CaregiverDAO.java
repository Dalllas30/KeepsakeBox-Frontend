/**
 * V2
 * @author Madalena Vagos - fc48667
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

import com.keepsakeBox.dto.*;
import com.keepsakeBox.service.FileStorageService;

public class CaregiverDAO {

	// Class Logger
	Logger logger = Logger.getLogger(CaregiverDAO.class.getName());

	// Services
	private FileStorageService fileStorageService = new FileStorageService();

	// Retrieves from database the password associated to the given caregiver email
	public String getPasswordByEmail(Connection con, String email) throws SQLException {
		String result = null;
		Statement stmt = null;
		String query = String.format("SELECT password FROM caregiver  " + "WHERE email = '%s' AND is_active = true;",
				email);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result = rs.getString("password");
			}
			logger.info("getPasswordByEmail from caregiver " + "[email: " + email + "] succeeded");
			return result;
		} catch (Exception e) {
			logger.warning(
					"getPasswordByEmail from caregiver " + "[email: " + email + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from database the caregiver ID associated to the given email
	public String getCaregiverIdByEmail(Connection con, String email) throws SQLException {
		String result = null;
		Statement stmt = null;
		String query = String.format("SELECT id FROM caregiver WHERE email = '%s';", email);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result = rs.getString("id");
			}
			logger.info("getCaregiverIDByEmail with caregiver " + "[email: " + email + "] returned -> " + result);
			return result;
		} catch (Exception e) {
			logger.warning(
					"getCaregiverIDByEmail with caregiver " + "[email: " + email + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Inserts a new caregiver into the database and returns caregiver ID
	public String insertCaregiver(Connection con, CaregiverRegisterData caregiverRegisterData) throws SQLException {
		String result = null;
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver(name, email, phone, " + "password, birth_date, "
						+ "type, speciality, created_date, " + "last_updated_date, last_login_date) "
						+ "VALUES('%s', '%s', '%s', '%s', '%s', '%s', '%s', " + "now(), now(), now()) RETURNING id;",
				caregiverRegisterData.getName(), caregiverRegisterData.getEmail(), caregiverRegisterData.getPhone(),
				caregiverRegisterData.getPassword(), caregiverRegisterData.getBirthDate().toString(),
				caregiverRegisterData.getType(), caregiverRegisterData.getSpeciality());

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result = rs.getString("id");
			}
			logger.info("insertCaregiver with caregiver " + "[email " + caregiverRegisterData.getEmail() + "]");
			return result;
		} catch (SQLException e) {
			logger.warning("insertCaregiver with caregiver " + "[email " + caregiverRegisterData.getEmail()
					+ "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Updates the DB with a caregiver last login date
	public void updateCaregiverLastLoginDate(Connection con, String email) throws SQLException {
		Statement stmt = null;
		String query = String.format("UPDATE caregiver SET last_login_date=now() " + "WHERE email='%s' RETURNING id;",
				email);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("updateCaregiverLastLoginDate with caregiver " + "[email: " + email + "] succeeded");
		} catch (SQLException e) {
			logger.warning("updateCaregiverLastLoginDate with caregiver " + "[email: " + email + "], "
					+ "returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB the caregiver with the given email associated
	public Caregiver getCaregiverByEmail(Connection con, String email) throws SQLException {
		Caregiver caregiver = new Caregiver();
		Statement stmt = null;
		String query = String.format("SELECT id, name, phone, birth_date, " + "type, speciality, is_active "
				+ "FROM caregiver WHERE email = '%s';", email);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				caregiver.setId(rs.getString("id"));
				caregiver.setName(rs.getString("name"));
				caregiver.setEmail(email);
				caregiver.setPhone(rs.getString("phone"));
				caregiver.setBirthDate(rs.getDate("birth_date"));
				caregiver
						.setProfileImageURL(fileStorageService.loadCaregiverProfileImage(rs.getString("id") + ".jpeg"));
				caregiver.setType(rs.getString("type"));
				caregiver.setSpeciality(rs.getString("speciality"));
				caregiver.setIsActive(rs.getBoolean("is_active"));
			}
			logger.info("getCaregiverByEmail with caregiver " + "[email: " + email + "] returned -> " + caregiver);
			return caregiver;
		} catch (SQLException e) {
			logger.warning(
					"getCaregiverByEmail with caregiver " + "[email: " + email + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB the caregiver with the given ID associated
	public Caregiver getCaregiverById(Connection con, String caregiverId) throws SQLException {
		Caregiver caregiver = new Caregiver();
		Statement stmt = null;
		String query = String.format("SELECT name, email, phone, birth_date, " + "type, speciality, is_active "
				+ "FROM caregiver WHERE id = '%s';", caregiverId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				caregiver.setId(caregiverId);
				caregiver.setName(rs.getString("name"));
				caregiver.setEmail(rs.getString("email"));
				caregiver.setPhone(rs.getString("phone"));
				caregiver.setBirthDate(rs.getDate("birth_date"));
				caregiver.setProfileImageURL(fileStorageService.loadCaregiverProfileImage(caregiverId + ".jpeg"));
				caregiver.setType(rs.getString("type"));
				caregiver.setSpeciality(rs.getString("speciality"));
				caregiver.setIsActive(rs.getBoolean("is_active"));
			}
			logger.info("getCaregiverById with caregiver " + "[id: " + caregiverId + "] returned -> " + caregiver);
			return caregiver;
		} catch (SQLException e) {
			logger.warning(
					"getCaregiverById with caregiver " + "[id: " + caregiverId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB the caregiver without token
	public Caregiver getCaregiverOutsideById(Connection con, String caregiverId) throws SQLException {
		Caregiver caregiver = new Caregiver();
		Statement stmt = null;
		String query = String.format("SELECT name, email, phone, birth_date, " + "type, speciality, is_active "
				+ "FROM caregiver WHERE id = '%s';", caregiverId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				caregiver.setId(caregiverId);
				caregiver.setName(rs.getString("name"));
				caregiver.setEmail(rs.getString("email"));
				caregiver.setPhone(rs.getString("phone"));
				caregiver.setBirthDate(rs.getDate("birth_date"));
				caregiver.setProfileImageURL(fileStorageService.loadCaregiverProfileImage(caregiverId + ".jpeg"));
				caregiver.setType(rs.getString("type"));
				caregiver.setSpeciality(rs.getString("speciality"));
				caregiver.setIsActive(rs.getBoolean("is_active"));
			}
			logger.info("getCaregiverOutsidetById with caregiver " + "[id: " + caregiverId + "] returned -> " + caregiver);
			return caregiver;
		} catch (SQLException e) {
			logger.warning(
					"getCaregiverOutsidetById with caregiver " + "[id: " + caregiverId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB simple caregiver data associated to given ID
	public SimpleCaregiver getSimpleCaregiverById(Connection con, String caregiverId) throws SQLException {
		SimpleCaregiver caregiver = new SimpleCaregiver();
		Statement stmt = null;
		String query = String.format("SELECT name, email " + "FROM caregiver WHERE id = '%s';", caregiverId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				caregiver.setId(caregiverId);
				caregiver.setName(rs.getString("name"));
				caregiver.setEmail(rs.getString("email"));
			}
			logger.info(
					"getSimpleCaregiverById with caregiver " + "[id: " + caregiverId + "] returned -> " + caregiver);
			return caregiver;
		} catch (SQLException e) {
			logger.warning("getSimpleCaregiverById with caregiver " + "[id: " + caregiverId + "] returned error: "
					+ e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB simple caregiver data associated to given email
	public SimpleCaregiver getSimpleCaregiverByEmail(Connection con, String caregiverEmail) throws SQLException {
		SimpleCaregiver caregiver = new SimpleCaregiver();
		Statement stmt = null;
		String query = String.format("SELECT id, name " + "FROM caregiver WHERE email = '%s';", caregiverEmail);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				caregiver.setId(rs.getString("id"));
				caregiver.setName(rs.getString("name"));
				caregiver.setEmail(caregiverEmail);
			}
			logger.info("getSimpleCaregiverByEmail with caregiver " + "[email: " + caregiverEmail + "] returned -> "
					+ caregiver);
			return caregiver;
		} catch (SQLException e) {
			logger.warning("getSimpleCaregiverByEmail with caregiver " + "[email: " + caregiverEmail
					+ "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB all patients associated to a caregiver ID
	public List<Patient> getCaregiverPatientsById(Connection con, String caregiverId, String patientId)
			throws SQLException {
		List<Patient> result = new ArrayList<Patient>();
		Statement stmt = null;
		String query = String.format("select " + "	patient.id," + "	patient.name," + "	patient.display_name,"
				+ "	patient.birth_date," + "	patient.education," + "	patient.is_active," + " patient.interests," + " patient.cities,"
				+ "	(select max(s.start_session_date)" + " from session s where s.patient_id = patient.id)"
				+ " start_session_date," + "	patient_chat.id as chat_id,"
				+ "	patient_chat.last_message_sent_date," + "	caregiver_patient_chat.last_message_read_date"
				+ " from patient" + " join caregiver_patient" + "	on patient.id = caregiver_patient.patient_id"
				+ " join patient_chat" + "	on patient.id = patient_chat.patient_id" + " join caregiver_patient_chat"
				+ "	on caregiver_patient_chat.caregiver_id = caregiver_patient.caregiver_id"
				+ " and caregiver_patient_chat.patient_chat_id=patient_chat.id"
				+ " where caregiver_patient.caregiver_id = '%s';", caregiverId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				if (!rs.getString("id").equals(patientId)) {
					Patient patient = new Patient();
					patient.setId(rs.getString("id"));
					patient.setName(rs.getString("name"));
					patient.setDisplayName(rs.getString("display_name"));
					patient.setBirthDate(rs.getDate("birth_date"));
					patient.setEducation(rs.getString("education"));
					patient.setProfileImageURL(
							fileStorageService.loadPatientProfileImage(rs.getString("id") + ".jpeg"));
					patient.setIsActive(rs.getBoolean("is_active"));
					patient.setLastSession(rs.getDate("start_session_date"));
					patient.setInterests(rs.getString("interests"));
					patient.setCities(rs.getString("cities"));
					PatientChat chat = new PatientChat();
					chat.setId(rs.getString("chat_id"));
					chat.setLastMessageSentDate(rs.getTimestamp("last_message_sent_date"));
					chat.setLastMessageReadDate(rs.getTimestamp("last_message_read_date"));
					patient.setChat(chat);
					result.add(patient);
				}
			}
			logger.info("getCaregiverPatients from caregiver " + "[id: " + caregiverId + "] returned -> " + result);
			return result;
		} catch (SQLException e) {
			logger.warning("getCaregiverPatients from caregiver " + "[id: " + caregiverId + "] returned error: "
					+ e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Creates a new association on the DB from a new patient and the caregiver who
	 * added the patient into the application
	 */
	public void associateNewPatient(Connection con, String caregiverId, String patientId,
			CaregiverPatientRegisterData caregiverPatientRegisterData) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_patient (caregiver_id, " + "patient_id, patient_relation) "
						+ "VALUES('%s', '%s', '%s') RETURNING patient_id;",
				caregiverId, patientId, caregiverPatientRegisterData.getPatientRelation());

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("associateNewPatient for patient [id:" + patientId + "] " + "to caregiver [id: " + caregiverId
					+ "] returned 200");
		} catch (SQLException e) {
			logger.warning("associateNewPatient for patient " + "[id:" + patientId + "] to caregiver " + "[id: "
					+ caregiverId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Creates a new association on the DB from an existing patient to a caregiver
	 * registered into the application with given ID
	 */
	public void associateExistingPatient(Connection con, String caregiverId,
			CaregiverPatientAssociationData caregiverPatientAssociationData) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_patient (caregiver_id, patient_id, " + "is_primary, patient_relation) "
						+ "VALUES('%s', '%s', '%b', '%s') RETURNING patient_id;",
				caregiverId, caregiverPatientAssociationData.getPatientId(), false,
				caregiverPatientAssociationData.getPatientRelation());

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info(
					"associateExistingPatient for patient " + "[id:" + caregiverPatientAssociationData.getPatientId()
							+ "] to caregiver [id: " + caregiverId + "] returned 200");
		} catch (SQLException e) {
			logger.warning(
					"associateExistingPatient for patient " + "[id:" + caregiverPatientAssociationData.getPatientId()
							+ "] to caregiver [id: " + caregiverId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Updates the caregiver on the DB with the given data
	public void updateCaregiver(Connection con, String imageName, Caregiver updatedCaregiver) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"UPDATE caregiver SET name='%s', email='%s', " + "phone='%s', birth_date='%s', "
						+ "type='%s', speciality='%s', " + "is_active='%b', last_updated_date= now() WHERE id='%s' "
						+ "RETURNING id;",
				updatedCaregiver.getName(), updatedCaregiver.getEmail(), updatedCaregiver.getPhone(),
				updatedCaregiver.getBirthDate(), updatedCaregiver.getType(), updatedCaregiver.getSpeciality(),
				updatedCaregiver.getIsActive(), updatedCaregiver.getId());

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("updateCaregiver for caregiver " + "[id: " + updatedCaregiver.getId() + "] returned 200 ->"
					+ updatedCaregiver.toString());
		} catch (SQLException e) {
			logger.warning("updateCaregiver for caregiver [id: " + updatedCaregiver.getId() + "] returned error:"
					+ e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Gets caregiver password with given caregiver ID
	public String getCaregiverPasswordById(Connection con, String caregiverId) throws SQLException {
		String result = null;
		Statement stmt = null;
		String query = String.format("SELECT password " + "FROM caregiver WHERE id = '%s';", caregiverId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result = rs.getString("password");
			}
			logger.info("getCaregiverPasswordById with caregiver " + "[id: " + caregiverId + "] returned 200.");
			return result;
		} catch (SQLException e) {
			logger.warning("getCaregiverPasswordById with caregiver " + "[id: " + caregiverId + "] returned error: "
					+ e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Changes caregiver password with given caregiver ID and new password
	 * 
	 * @throws SQLException
	 */
	public void changeCaregiverPasswordById(Connection con, String caregiverId, String password) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"UPDATE caregiver SET password='%s', " + "last_updated_date= now() WHERE id='%s' " + "RETURNING id;",
				password, caregiverId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("changeCaregiverPasswordById for caregiver " + "[id: " + caregiverId + "] returned 200.");
		} catch (SQLException e) {
			logger.warning("changeCaregiverPasswordById for caregiver " + "[id: " + caregiverId + "] returned error:"
					+ e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Removes a primary caregiver stat for a patient
	 */
	public void unsetPrimaryCaregiver(Connection con, String caregiverId, String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format("UPDATE caregiver_patient SET is_primary=false "
				+ "WHERE caregiver_id='%s' AND patient_id='%s'" + "RETURNING caregiver_id;", caregiverId, patientId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("unsetPrimaryCaregiver for caregiver [id: " + caregiverId + "] and patient [id: " + patientId
					+ "] returned 200.");
		} catch (SQLException e) {
			logger.warning("unsetPrimaryCaregiver for caregiver [id: " + caregiverId + "] and patient [id: " + patientId
					+ " returned error:" + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Adds a new primary caregiver to a patient
	 */
	public void newPrimaryCaregiver(Connection con, String caregiverId, String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format("UPDATE caregiver_patient SET is_primary=true "
				+ "WHERE caregiver_id='%s' AND patient_id='%s'" + "RETURNING caregiver_id;", caregiverId, patientId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("newPrimaryCaregiver for caregiver [id: " + caregiverId + "] and patient [id: " + patientId
					+ "] returned 200.");
		} catch (SQLException e) {
			logger.warning("newPrimaryCaregiver for caregiver [id: " + caregiverId + "] and patient [id: " + patientId
					+ " returned error:" + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	public List<Caregiver> getAllCaregivers(Connection con, Caregiver currentCaregiver) throws SQLException {
		List<Caregiver> result = new ArrayList<Caregiver>();
		Statement stmt = null;
		String query = "SELECT id, name, email, phone, birth_date,"
				+ "type, speciality, is_active FROM caregiver WHERE is_active=true ORDER BY name;";
		result.add(currentCaregiver);
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				if (!currentCaregiver.getId().equals(rs.getString("id"))) {
					Caregiver caregiver = new Caregiver();
					caregiver.setId(rs.getString("id"));
					caregiver.setName(rs.getString("name"));
					caregiver.setEmail(rs.getString("email"));
					caregiver.setPhone(rs.getString("phone"));
					caregiver.setBirthDate(rs.getDate("birth_date"));
					caregiver.setProfileImageURL(
							fileStorageService.loadCaregiverProfileImage(caregiver.getId() + ".jpeg"));
					caregiver.setType(rs.getString("type"));
					caregiver.setSpeciality(rs.getString("speciality"));
					caregiver.setIsActive(rs.getBoolean("is_active"));
					result.add(caregiver);
				}
			}
			logger.info("getCaregivers returned -> " + result);
			return result;
		} catch (SQLException e) {
			logger.warning("getCaregivers returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
}
