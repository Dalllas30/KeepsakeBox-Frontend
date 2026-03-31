/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.ws.http.HTTPException;

import org.springframework.http.HttpStatus;

import com.keepsakeBox.dto.*;
import com.keepsakeBox.dao.*;

public class CaregiverService {

	// Class Logger
	Logger logger = Logger.getLogger(CaregiverService.class.getName());

	// DAO (Data Access Objects)
	private CaregiverDAO caregiverDAO = new CaregiverDAO();
	private PatientDAO patientDAO = new PatientDAO();
	private MessageDAO messageDAO = new MessageDAO();

	// Services
	private FileStorageService fileStorageService = new FileStorageService();

	// Database Connection
	private Connection con = connect();

	private Connection connect() {
		try {
			return DriverManager.getConnection("jdbc:postgresql://localhost:5432/", "postgres", "postgres");
		} catch (SQLException e) {
			logger.warning("Could not connect to Database.");
			throw new InternalServerErrorException(e.toString());
		}
	}

	// Retrieves caregiver ID with the given email
	public ResponseBasic getCaregiverIDByEmail(String email) {
		try {
			ResponseBasic response = new ResponseBasic();
			String id = caregiverDAO.getCaregiverIdByEmail(con, email);
			response.setResult(id);
			logger.info("getCaregiverIDByEmail with caregiver [email: " + email + "] responded:" + response.toString());
			return response;
		} catch (Exception e) {
			logger.warning("getCaregiverIDByEmail with caregiver [email: " + email + "] responded 500 " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	// Retrieves a caregiver with associated session token
	public Caregiver getCaregiverByToken(List<LoggedSession> loggedSessions, String token) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}

		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				Caregiver caregiver = caregiverDAO.getCaregiverByEmail(con, actual.getCaregiverEmail());
				logger.info("getCaregiver for caregiver [token: " + token + "] returned 200.");
				return caregiver;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getCaregiver for caregiver [token: " + token + "] responded 401.");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getCaregiver for caregiver [token: " + token + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	// Retrieves a caregiver by Id with associated session token
	public Caregiver getCaregiverById(List<LoggedSession> loggedSessions, String token, String caregiverId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}

		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				Caregiver caregiver = caregiverDAO.getCaregiverById(con, caregiverId);
				logger.info("getCaregiver for caregiver [id: " + caregiverId + "] returned 200.");
				return caregiver;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getCaregiver for caregiver [id: " + caregiverId + "] responded 401.");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getCaregiver for caregiver [id: " + caregiverId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	// Retrieves a caregiver by Id without token
	public Caregiver getCaregiverOutsideById(String caregiverId) {
		try {
			Caregiver caregiver = caregiverDAO.getCaregiverOutsideById(con, caregiverId);
			logger.info("getCaregiver for caregiver [id: " + caregiverId + "] returned 200.");
			return caregiver;
		} catch (HTTPException e) {
			logger.warning("getCaregiver for caregiver [id: " + caregiverId + "] responded 401.");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getCaregiver for caregiver [id: " + caregiverId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Gets a list of patients associated to the caregiver with the given session
	 * token
	 */
	public PatientList getCaregiverPatientsByToken(List<LoggedSession> loggedSessions, String token, String caregiverId,
			String patientId) {
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
				if (caregiverId == null) {
					result.setPatients(caregiverDAO.getCaregiverPatientsById(con, actual.getCaregiverID(), patientId));
				} else {
					result.setPatients(caregiverDAO.getCaregiverPatientsById(con, caregiverId, patientId));
				}
				logger.info(
						"getCaregiverPatients for caregiver [token: " + token + "] returned 200: " + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getCaregiverPatients for caregiver [token: " + token + "] responded 401");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning(
					"getCaregiverPatients for caregiver [token: " + token + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Adds a patient into the appliaction and associates him to the caregiver
	 * currently logged in (also associates patient chat)
	 */
	public ResponseBasic addCaregiverPatient(List<LoggedSession> loggedSessions, String token,
			CaregiverPatientRegisterData caregiverPatientRegisterData) {
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
				// Insert new patient
				String patientId = patientDAO.insertPatient(con, caregiverPatientRegisterData.getPatient());
				String imageName = patientId + ".jpeg";
				fileStorageService.uploadPatientProfileImage(
						caregiverPatientRegisterData.getPatient().getProfileImageURL(), imageName);

				// Create Patient Chat
				String chatId = messageDAO.createPatientChat(con, patientId);

				// Associates the patient and patient chat to the caregiver
				Caregiver caregiver = caregiverDAO.getCaregiverById(con, actual.getCaregiverID());
				caregiverDAO.associateNewPatient(con, caregiver.getId(), patientId, caregiverPatientRegisterData);

				PatientChatMessageData messageData = new PatientChatMessageData();
				messageData.setCreatedById(caregiver.getId());
				messageData.setMessage(caregiver.getName() + " adicionou o paciente.");
				messageData.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				messageDAO.insertPatientChatMessage(con, chatId, messageData);
				messageDAO.associateCaregiverToPatientChat(con, caregiver.getId(), chatId,
						messageData.getCreatedDate());

				logger.info("addCaregiverPatient with patient " + caregiverPatientRegisterData.getPatient().getName()
						+ " responded 200: ");
				result.setResult(patientId);
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("addCaregiverPatient with patient " + caregiverPatientRegisterData.getPatient().getName()
					+ " responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("addCaregiverPatient with patient " + caregiverPatientRegisterData.getPatient().getName()
					+ " responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}

	}

	/**
	 * Shares a patient care of the current logged caregiver with the caregiver
	 * associated to the given email
	 */
	public void associateExistingPatient(List<LoggedSession> loggedSessions, String token,
			CaregiverPatientAssociationData caregiverPatientAssociationData) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()
					&& !patientDAO.getPatientCaregiversIDsById(con, caregiverPatientAssociationData.getPatientId())
							.contains(caregiverPatientAssociationData.getCaregiverId())) {

				// Associate Caregiver to patient
				Caregiver caregiver = caregiverDAO.getCaregiverById(con,
						caregiverPatientAssociationData.getCaregiverId());
				caregiverDAO.associateExistingPatient(con, caregiver.getId(), caregiverPatientAssociationData);

				// Associate chat to caregiver
				String chatId = messageDAO.getChatIdByPatientId(con, caregiverPatientAssociationData.getPatientId());
				PatientChatMessageData messageData = new PatientChatMessageData();
				messageData.setCreatedById(caregiver.getId());
				messageData.setMessage(caregiver.getName() + " foi associado ao paciente.");
				messageData.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				messageDAO.insertPatientChatMessage(con, chatId, messageData);
				messageDAO.associateCaregiverToPatientChat(con, caregiver.getId(), chatId,
						messageData.getCreatedDate());

				logger.info("shareExistingPatient for caregiver [id: "
						+ caregiverPatientAssociationData.getCaregiverId() + "] returned 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("associateExistingPatient for caregiver [id: "
					+ caregiverPatientAssociationData.getCaregiverId() + "] responded 401");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("associateExistingPatient for caregiver [id: "
					+ caregiverPatientAssociationData.getCaregiverId() + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	// Updates caregiver data with given data
	public void updateCaregiver(List<LoggedSession> loggedSessions, String token, Caregiver updatedCaregiver) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				actual.setCaregiverEmail(updatedCaregiver.getEmail());
				String imageName = updatedCaregiver.getId() + ".jpeg";
				fileStorageService.uploadCaregiverProfileImage(updatedCaregiver.getProfileImageURL(), imageName);
				caregiverDAO.updateCaregiver(con, imageName, updatedCaregiver);
				logger.info("updateCaregiver for caregiver [token: " + token + "] returned 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("updateCaregiver for caregiver [token: " + token + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("updateCaregiver for caregiver [token: " + token + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Transfers primary care to another caregiver
	 */
	public void transferPrimaryCare(List<LoggedSession> loggedSessions, String token, String oldPrimaryId,
			String patientId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()
					&& patientDAO.getPatientCaregiversIDsById(con, patientId).contains(actual.getCaregiverID())) {

				caregiverDAO.unsetPrimaryCaregiver(con, oldPrimaryId, patientId);

				caregiverDAO.newPrimaryCaregiver(con, actual.getCaregiverID(), patientId);

				logger.info("transferPrimaryCare to caregiver [id: " + actual.getCaregiverID() + "] returned 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("transferPrimaryCare to caregiver [id: " + actual.getCaregiverID() + "] responded 401");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("transferPrimaryCare to caregiver [id: " + actual.getCaregiverID() + "] responded 500 with: "
					+ e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Leaves a patient Care
	 */
	public void leavePatientCare(List<LoggedSession> loggedSessions, String token, String patientId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {

				// Associate Caregiver to patient
				Caregiver caregiver = caregiverDAO.getCaregiverById(con, actual.getCaregiverID());
				patientDAO.removeCaregiverFromPatient(con, caregiver.getId(), patientId);

				// Message on chat and remove it
				String chatId = messageDAO.getChatIdByPatientId(con, patientId);
				PatientChatMessageData messageData = new PatientChatMessageData();
				messageData.setCreatedById(caregiver.getId());
				messageData.setMessage(caregiver.getName() + " deixou os cuidados do paciente.");
				messageData.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				messageDAO.insertPatientChatMessage(con, chatId, messageData);
				messageDAO.removeCaregiverFromPatientChat(con, caregiver.getId(), chatId);

				logger.info("leavePatientCare for caregiver [id: " + actual.getCaregiverID() + "] and patient [id: "
						+ patientId + "] returned 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("leavePatientCare for caregiver [id: " + actual.getCaregiverID() + "] and patient [id: "
					+ patientId + "] returned 401");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("leavePatientCare for caregiver [id: " + actual.getCaregiverID() + "] and patient [id: "
					+ patientId + "] returned 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}

	}

	/**
	 * Removes a caregiver from a patient care
	 */
	public void removeCaregiverFromPatient(List<LoggedSession> loggedSessions, String token, String caregiverId,
			String patientId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {

				// Remove Caregiver from patient
				Caregiver caregiver = caregiverDAO.getCaregiverById(con, caregiverId);
				patientDAO.removeCaregiverFromPatient(con, caregiverId, patientId);

				// Message on chat and remove it
				String chatId = messageDAO.getChatIdByPatientId(con, patientId);
				PatientChatMessageData messageData = new PatientChatMessageData();
				messageData.setCreatedById(actual.getCaregiverID());
				messageData.setMessage(
						caregiver.getName() + " foi removido e deixou de poder participar nos cuidados do paciente.");
				messageData.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				messageDAO.insertPatientChatMessage(con, chatId, messageData);
				messageDAO.removeCaregiverFromPatientChat(con, caregiver.getId(), chatId);

				logger.info("removeCaregiverFromPatient for caregiver [id: " + actual.getCaregiverID()
						+ "] and patient [id: " + patientId + "] returned 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("removeCaregiverFromPatient for caregiver [id: " + actual.getCaregiverID()
					+ "] and patient [id: " + patientId + "] returned 401");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("removeCaregiverFromPatient for caregiver [id: " + actual.getCaregiverID()
					+ "] and patient [id: " + patientId + "] returned 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}

	}

	/**
	 * Removes primary caregiver from a patient care while setting a new primary
	 * caregiver
	 */
	public void primaryLeaveCare(List<LoggedSession> loggedSessions, String token, String caregiverId,
			String patientId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {

				// New primary caregiver
				caregiverDAO.newPrimaryCaregiver(con, actual.getCaregiverID(), patientId);

				// Remove Caregiver from patient
				Caregiver caregiver = caregiverDAO.getCaregiverById(con, caregiverId);
				patientDAO.removeCaregiverFromPatient(con, caregiverId, patientId);

				// Message on chat and remove it
				String chatId = messageDAO.getChatIdByPatientId(con, patientId);
				PatientChatMessageData messageData = new PatientChatMessageData();
				messageData.setCreatedById(caregiver.getId());
				messageData.setMessage(caregiver.getName() + " deixou de participar nos cuidados do paciente.");
				messageData.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				messageDAO.insertPatientChatMessage(con, chatId, messageData);
				messageDAO.removeCaregiverFromPatientChat(con, caregiver.getId(), chatId);

				logger.info("primaryLeaveCare for caregiver [id: " + actual.getCaregiverID() + "] and patient [id: "
						+ patientId + "] returned 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("primaryLeaveCare for caregiver [id: " + caregiverId + "] and patient [id: " + patientId
					+ "] returned 401");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("primaryLeaveCare for caregiver [id: " + caregiverId + "] and patient [id: " + patientId
					+ "] returned 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}

	}

	public CaregiverList getCaregiverList(List<LoggedSession> loggedSessions, String token) {
		CaregiverList result = new CaregiverList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				Caregiver caregiver = new Caregiver();
				result.setCaregivers(caregiverDAO.getAllCaregivers(con, getCaregiverByToken(loggedSessions, token)));
				logger.info("getCaregiverList returned 200");
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getCaregiverList returned 401");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getCaregiverList returned 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}

	}
}
