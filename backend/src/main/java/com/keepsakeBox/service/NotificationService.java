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

import com.keepsakeBox.dao.CaregiverDAO;
import com.keepsakeBox.dao.NotificationDAO;
import com.keepsakeBox.dao.PatientDAO;
import com.keepsakeBox.dto.CaregiverNotificationList;
import com.keepsakeBox.dto.InternalServerErrorException;
import com.keepsakeBox.dto.LoggedSession;
import com.keepsakeBox.dto.UnauthorizedException;

public class NotificationService {
	
	//Class Logger
	Logger logger = Logger.getLogger(NotificationService.class.getName());
	
	//DAO (Data Access Objects)
	private PatientDAO patientDAO = new PatientDAO();
	private CaregiverDAO caregiverDAO = new CaregiverDAO();
	private NotificationDAO notificationDAO = new NotificationDAO();
	
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
	 * Retrieves all caregiver notifications where he is
	 * either a sender or a receiver
	 */
	public CaregiverNotificationList getCaregiverNotifications(
			List<LoggedSession> loggedSessions, String token) {
		CaregiverNotificationList result = new CaregiverNotificationList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setNotifications(notificationDAO
						.getCaregiverNotifications(con, 
						 actual.getCaregiverEmail(), actual.getCaregiverID()));
				logger.info("getCaregiverNotifications for caregiver [token: " 
					  + token + "] returned 200: ");
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getCaregiverNotifications for caregiver [token: " 
		          + token + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getCaregiverNotifications for caregiver [token: " 
		          + token + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}
	
	/**
	 * Creates a notification for a share care request for the
	 * patient with given ID with the caregiver with given email
	 * (receiverEmail)
	 */
	public void notifyShare(List<LoggedSession> loggedSessions, 
			String token, String receiverEmail, String patientId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty() &&
				!patientDAO.getPatientCaregiversIDsById(con, 
						patientDAO.getPatientById(con, 
								patientId, actual.getCaregiverID()).getId())
				.contains(caregiverDAO.getCaregiverByEmail(con, receiverEmail).getId())) {
				notificationDAO
				.notifyShare(con, actual.getCaregiverEmail(),receiverEmail,patientId);
				logger.info("notifyShare for caregiver [email: " 
				      + receiverEmail + "] returned 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("notifyShare for caregiver [email: " 
		          + receiverEmail + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("notifyShare for caregiver [email: " 
		          + receiverEmail + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Notifies the sender caregiver that the share patient request 
	 * was ACCEPTED by the receiver caregiver for the patient with
	 * given ID
	 */
	public void notifyAcceptedShare(List<LoggedSession> loggedSessions, 
			String token, String senderEmail, String patientId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				notificationDAO
				.notifyAcceptedShare(con,
						actual.getCaregiverEmail(),senderEmail,patientId);
				logger.info("notifyAcceptShare for caregiver [email: " 
					  + senderEmail + "] returned 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("notifyAcceptShare for caregiver [email: " 
		          + senderEmail + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("notifyAcceptShare for caregiver [email: " 
		          + senderEmail + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Notifies the sender caregiver that the share patient request 
	 * was DENIED by the receiver caregiver for the patient with
	 * given ID
	 */
	public void notifyDeniedShare(List<LoggedSession> loggedSessions, 
			String token, String senderEmail, String patientId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				notificationDAO
				.notifyDeniedShare(con,
						actual.getCaregiverEmail(),senderEmail,patientId);
				logger.info("notifyDeniedShare for caregiver [email: " + senderEmail + "] returned 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("notifyDeniedShare for caregiver [email: " 
		          + senderEmail + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("notifyDeniedShare for caregiver [email: " 
		          + senderEmail + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}
	
	/**
	 * Creates a notification for a primary care transfer request for the
	 * patient with given ID with the caregiver with given email
	 * (receiverEmail)
	 */
	public void notifyPrimaryCareTransfer(List<LoggedSession> loggedSessions, 
			String token, String receiverEmail, String patientId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty() &&
				patientDAO.getPatientCaregiversIDsById(con, 
						patientDAO.getPatientById(con, 
								patientId, actual.getCaregiverID()).getId())
				.contains(caregiverDAO.getCaregiverByEmail(con, receiverEmail).getId()) &&
				!actual.getCaregiverEmail().equals(receiverEmail)) {
				notificationDAO
				.notifyPrimaryCareTransfer(con, actual.getCaregiverEmail(),receiverEmail,patientId);
				logger.info("notifyPrimaryCareTransfer for caregiver [email: " 
				      + receiverEmail + "] returned 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("notifyPrimaryCareTransfer for caregiver [email: " 
		          + receiverEmail + "] responded 401: " + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("notifyPrimaryCareTransfer for caregiver [email: " 
		          + receiverEmail + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}
	
	/**
	 * Notifies the sender caregiver that the primary transfer request
	 * was accepted.
	 */
	public void notifyAcceptedPrimaryCare(List<LoggedSession> loggedSessions, 
			String token, String senderEmail,
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
				notificationDAO
				.notifyAcceptedPrimaryCare(con,
						actual.getCaregiverEmail(),senderEmail,patientId);
				logger.info("notifyAcceptedPrimaryCare for caregiver [email: " 
					  + senderEmail + "] returned 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("notifyAcceptedPrimaryCare for caregiver [email: " 
		          + senderEmail + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("notifyAcceptedPrimaryCare for caregiver [email: " 
		          + senderEmail + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
		
	}
	
	/**
	 * Notifies that primary care transfer was denied
	 */
	public void notifyDeniedPrimaryCare(List<LoggedSession> loggedSessions, 
			String token, String senderEmail,
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
				notificationDAO
				.notifyDeniedPrimaryCare(con,
						actual.getCaregiverEmail(),senderEmail,patientId);
				logger.info("notifyDeniedPrimaryCare for caregiver [email: " + senderEmail + "] returned 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("notifyDeniedPrimaryCare for caregiver [email: " 
		          + senderEmail + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("notifyDeniedPrimaryCare for caregiver [email: " 
		          + senderEmail + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}
	
	/**
	 * Notifies a caregiver that was removed from a patient
	 */
	public void notifyRemovedFromPatient(List<LoggedSession> loggedSessions, 
			String token, String receiverEmail,
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
				notificationDAO
				.notifyRemovedFromPatient(con,
						actual.getCaregiverEmail(),receiverEmail,patientId);
				logger.info("notifyRemovedFromPatient for caregiver [email: " 
						+ receiverEmail + "] returned 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("notifyRemovedFromPatient for caregiver [email: " 
		          + receiverEmail + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("notifyRemovedFromPatient for caregiver [email: " 
		          + receiverEmail + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	//Deletes the notification with given ID
	public void deleteNotification(List<LoggedSession> loggedSessions, 
			String token, String notificationId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				notificationDAO.deleteNotificationById(con, notificationId);
				logger.info("deleteNotification with notification [id: " 
				      + notificationId + "] responded 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("deleteNotification with notification [id: " 
		          + notificationId + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("deleteNotification with notification [id: " 
		          + notificationId + "] responded 500 with: " 
				  + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Notifies another caregiver that the primary caregiver wants
	 * to leave the patient and give him primary care
	 */
	public void notifyPrimaryLeaveCare(List<LoggedSession> loggedSessions, 
			String token, String receiverEmail,
			String patientId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty() &&
				patientDAO.getPatientCaregiversIDsById(con, 
						patientDAO.getPatientById(con, 
								patientId, actual.getCaregiverID()).getId())
				.contains(caregiverDAO.getCaregiverByEmail(con, receiverEmail).getId()) &&
				!actual.getCaregiverEmail().equals(receiverEmail)) {
				notificationDAO
				.notifyPrimaryLeaveCare(con,
						actual.getCaregiverEmail(),receiverEmail,patientId);
				logger.info("notifyPrimaryLeaveCare to caregiver [email: " 
						+ receiverEmail + "] returned 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("notifyPrimaryLeaveCare to caregiver [email: " 
		          + receiverEmail + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("notifyPrimaryLeaveCare to caregiver [email: " 
		          + receiverEmail + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
		
	}

	/**
	 * Notifies another caregiver that the primary caregiver leave request
	 * was accepted by the other caregiver
	 */
	public void notifyAcceptedPrimaryLeaveCare(List<LoggedSession> loggedSessions, 
			String token, String receiverEmail,
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
				notificationDAO
				.notifyAcceptedPrimaryLeaveCare(con,
						actual.getCaregiverEmail(),receiverEmail,patientId);
				logger.info("notifyAcceptedPrimaryLeaveCare to caregiver [email: " 
						+ receiverEmail + "] returned 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("notifyAcceptedPrimaryLeaveCare to caregiver [email: " 
		          + receiverEmail + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("notifyAcceptedPrimaryLeaveCare to caregiver [email: " 
		          + receiverEmail + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}
	
	/**
	 * Notifies another caregiver that the primary caregiver leave request
	 * was denied by the other caregiver
	 */
	public void notifyDeniedPrimaryLeaveCare(List<LoggedSession> loggedSessions, 
			String token, String receiverEmail,
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
				notificationDAO
				.notifyDeniedPrimaryLeaveCare(con,
						actual.getCaregiverEmail(),receiverEmail,patientId);
				logger.info("notifyDeniedPrimaryLeaveCare to caregiver [email: " 
						+ receiverEmail + "] returned 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("notifyDeniedPrimaryLeaveCare to caregiver [email: " 
		          + receiverEmail + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("notifyDeniedPrimaryLeaveCare to caregiver [email: " 
		          + receiverEmail + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

}
