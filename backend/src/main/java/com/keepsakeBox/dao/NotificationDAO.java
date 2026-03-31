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

import com.keepsakeBox.dto.CaregiverNotification;

public class NotificationDAO {
	
	//Class Logger
	Logger logger = Logger.getLogger(NotificationDAO.class.getName());
	
	//DAO (Data Access Objects)
	private CaregiverDAO caregiverDAO = new CaregiverDAO();
	private PatientDAO patientDAO = new PatientDAO();
	

	/**
	 * Retrieves all caregiver notifications from the DB
	 * whether is sender or receiver
	 */
	public List<CaregiverNotification> getCaregiverNotifications(
			Connection con, String caregiverEmail, String caregiverId) throws SQLException {
		List<CaregiverNotification> result = new ArrayList<CaregiverNotification>();
		Statement stmt = null;
		String query = String.format(
				"SELECT DISTINCT n.id, "
				+ "n.sender_email, "
				+ "n.receiver_email, "
				+ "n.patient_id, "
				+ "n.message_type, "
				+ "n.created_date "
				+ "FROM caregiver_notification n "
				+ "WHERE n.sender_email = '%s' "
				+ "OR n.receiver_email ='%s';", 
				caregiverEmail, caregiverEmail);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				CaregiverNotification notification = new CaregiverNotification();
				notification.setId(rs.getString("id"));
				notification.setSender(
						caregiverDAO.getSimpleCaregiverByEmail(
								con, rs.getString("sender_email")));
				notification.setReceiver(
						caregiverDAO.getSimpleCaregiverByEmail(
								con, rs.getString("receiver_email")));
				if (rs.getString("message_type").equals("SHARE_PATIENT") ||
					rs.getString("message_type").equals("REMOVED_FROM_PATIENT") ||
					rs.getString("message_type").equals("ACCEPTED_PRIMARY_LEAVE_CARE")) {
					notification.setPatient(
							patientDAO.getPatientById(
									con, rs.getString("patient_id"), 
									notification.getSender().getId()));
				}else {
					notification.setPatient(
							patientDAO.getPatientById(
									con, rs.getString("patient_id"), caregiverId));
				}
				notification.setMessageType(rs.getString("message_type"));
				notification.setCreatedDate(rs.getTimestamp("created_date"));
				result.add(notification);
			}
			logger.info("getCaregiverNotifications from caregiver [email:"
				  + caregiverEmail + "] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getCaregiverNotifications from caregiver [email:" 
				  + caregiverEmail + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		
	}

	/**
	 * Creates a new notification on the DB with sender and receiver
	 * for a patient share request for the patient with given ID
	 */
	public void notifyShare(Connection con, String senderEmail, 
			String receiverEmail, String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_notification("
				+ "sender_email, "
				+ "receiver_email, "
				+ "patient_id, "
				+ "message_type, "
				+ "created_date) "
				+ "VALUES('%s', '%s', '%s', '%s', now()) "
				+ "RETURNING id;",
				senderEmail,
				receiverEmail,
				patientId,
				"SHARE_PATIENT");

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("notifyShare to caregiver [email: " 
			      + receiverEmail + "] returned 200: ");
		} catch (SQLException e) {
			logger.warning("notifyShare to caregiver [email: " 
		          + receiverEmail + "] returned 200: ");
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	/**
	 * Creates a notification for when a patient share request is accepted
	 * to alert the sender that the receiver accept it for the
	 * patient with given ID
	 */
	public void notifyAcceptedShare(Connection con, String senderEmail, 
			String receiverEmail, String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_notification("
				+ "sender_email, "
				+ "receiver_email, "
				+ "patient_id, "
				+ "message_type, "
				+ "created_date) "
				+ "VALUES('%s', '%s', '%s', '%s', now()) "
				+ "RETURNING id;",
				senderEmail,
				receiverEmail,
				patientId,
				"ACCEPTED_SHARE_PATIENT");

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("notifyAcceptedShare to caregiver [email: " 
			      + receiverEmail + "] returned 200: ");
		} catch (SQLException e) {
			logger.warning("notifyAcceptedShare to caregiver [email: " 
		          + receiverEmail + "] returned 200: ");
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	/**
	 * Creates a notification for when a patient share request is denied
	 * to alert the sender that the receiver denied it for the
	 * patient with given ID
	 */
	public void notifyDeniedShare(Connection con, String senderEmail, 
			String receiverEmail, String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_notification("
				+ "sender_email, "
				+ "receiver_email, "
				+ "patient_id, "
				+ "message_type, "
				+ "created_date) "
				+ "VALUES('%s', '%s', '%s', '%s', now()) "
				+ "RETURNING id;",
				senderEmail,
				receiverEmail,
				patientId,
				"DENIED_SHARE_PATIENT");

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("notifyDeniedShare to caregiver [email: " 
			      + receiverEmail + "] returned 200: ");
		} catch (SQLException e) {
			logger.warning("notifyDeniedShare to caregiver [email: " 
		          + receiverEmail + "] returned 200: ");
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	//Deletes a notification with given ID from the DB
	public void deleteNotificationById(Connection con, 
			String notificationId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"DELETE FROM caregiver_notification "
				+ "WHERE id='%s' RETURNING id;",
				notificationId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("deleteNotificationById [id: " 
			      + notificationId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("deleteNotificationById [id: " 
		          + notificationId + "] returned error: " 
				  + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	public void notifyPrimaryCareTransfer(Connection con, 
			String senderEmail, String receiverEmail,
			String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_notification("
				+ "sender_email, "
				+ "receiver_email, "
				+ "patient_id, "
				+ "message_type, "
				+ "created_date) "
				+ "VALUES('%s', '%s', '%s', '%s', now()) "
				+ "RETURNING id;",
				senderEmail,
				receiverEmail,
				patientId,
				"TRANSFER_PRIMARY");

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("notifyPrimaryCareTransfer to caregiver [email: " 
			      + receiverEmail + "] returned 200: ");
		} catch (SQLException e) {
			logger.warning("notifyPrimaryCareTransfer to caregiver [email: " 
		          + receiverEmail + "] returned 200: ");
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Notifies sender caregiver that a primary care
	 * transfer was accepted
	 */
	public void notifyAcceptedPrimaryCare(Connection con, 
		String senderEmail, String receiverEmail, 
		String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_notification("
				+ "sender_email, "
				+ "receiver_email, "
				+ "patient_id, "
				+ "message_type, "
				+ "created_date) "
				+ "VALUES('%s', '%s', '%s', '%s', now()) "
				+ "RETURNING id;",
				senderEmail,
				receiverEmail,
				patientId,
				"ACCEPTED_PRIMARY_CARE");

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("notifyAcceptedShare to caregiver [email: " 
			      + receiverEmail + "] returned 200: ");
		} catch (SQLException e) {
			logger.warning("notifyAcceptedShare to caregiver [email: " 
		          + receiverEmail + "] returned 200: ");
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Notifies sender caregiver that a primary care
	 * transfer was denied
	 * @throws SQLException 
	 */
	public void notifyDeniedPrimaryCare(Connection con, 
			String senderEmail, String receiverEmail, 
			String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_notification("
				+ "sender_email, "
				+ "receiver_email, "
				+ "patient_id, "
				+ "message_type, "
				+ "created_date) "
				+ "VALUES('%s', '%s', '%s', '%s', now()) "
				+ "RETURNING id;",
				senderEmail,
				receiverEmail,
				patientId,
				"DENIED_PRIMARY_CARE");

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("notifyDeniedPrimaryCare to caregiver [email: " 
			      + receiverEmail + "] returned 200: ");
		} catch (SQLException e) {
			logger.warning("notifyDeniedPrimaryCare to caregiver [email: " 
		          + receiverEmail + "] returned 200: ");
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Creates a notification when a caregiver was removed from a patient
	 * @throws SQLException 
	 */
	public void notifyRemovedFromPatient(Connection con, 
			String senderEmail, String receiverEmail,
			String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_notification("
				+ "sender_email, "
				+ "receiver_email, "
				+ "patient_id, "
				+ "message_type, "
				+ "created_date) "
				+ "VALUES('%s', '%s', '%s', '%s', now()) "
				+ "RETURNING id;",
				senderEmail,
				receiverEmail,
				patientId,
				"REMOVED_FROM_PATIENT");

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("notifyRemovedFromPatient to caregiver [email: " 
			      + receiverEmail + "] returned 200: ");
		} catch (SQLException e) {
			logger.warning("notifyRemovedFromPatient to caregiver [email: " 
		          + receiverEmail + "] returned 200: ");
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		
	}

	/**
	 * Notifies another caregiver that the primary caregiver wants
	 * to leave the patient and give him primary care
	 * @throws SQLException 
	 */
	public void notifyPrimaryLeaveCare(Connection con, String senderEmail, 
			String receiverEmail, String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_notification("
				+ "sender_email, "
				+ "receiver_email, "
				+ "patient_id, "
				+ "message_type, "
				+ "created_date) "
				+ "VALUES('%s', '%s', '%s', '%s', now()) "
				+ "RETURNING id;",
				senderEmail,
				receiverEmail,
				patientId,
				"PRIMARY_LEAVE_CARE");

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("notifyPrimaryLeaveCare to caregiver [email: " 
			      + receiverEmail + "] returned 200: ");
		} catch (SQLException e) {
			logger.warning("notifyPrimaryLeaveCare to caregiver [email: " 
		          + receiverEmail + "] returned 200: ");
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Notifies another caregiver that the primary caregiver leave request
	 * was accepted by the other caregiver
	 * @throws SQLException 
	 */
	public void notifyAcceptedPrimaryLeaveCare(Connection con, 
			String senderEmail, String receiverEmail,
			String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_notification("
				+ "sender_email, "
				+ "receiver_email, "
				+ "patient_id, "
				+ "message_type, "
				+ "created_date) "
				+ "VALUES('%s', '%s', '%s', '%s', now()) "
				+ "RETURNING id;",
				senderEmail,
				receiverEmail,
				patientId,
				"ACCEPTED_PRIMARY_LEAVE_CARE");

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("notifyAcceptedPrimaryLeaveCare to caregiver [email: " 
			      + receiverEmail + "] returned 200: ");
		} catch (SQLException e) {
			logger.warning("notifyAcceptedPrimaryLeaveCare to caregiver [email: " 
		          + receiverEmail + "] returned 200: ");
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		
	}
	
	/**
	 * Notifies another caregiver that the primary caregiver leave request
	 * was denied by the other caregiver
	 * @throws SQLException 
	 */
	public void notifyDeniedPrimaryLeaveCare(Connection con, 
			String senderEmail, String receiverEmail,
			String patientId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_notification("
				+ "sender_email, "
				+ "receiver_email, "
				+ "patient_id, "
				+ "message_type, "
				+ "created_date) "
				+ "VALUES('%s', '%s', '%s', '%s', now()) "
				+ "RETURNING id;",
				senderEmail,
				receiverEmail,
				patientId,
				"DENIED_PRIMARY_LEAVE_CARE");

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("notifyDeniedPrimaryLeaveCare to caregiver [email: " 
			      + receiverEmail + "] returned 200: ");
		} catch (SQLException e) {
			logger.warning("notifyDeniedPrimaryLeaveCare to caregiver [email: " 
		          + receiverEmail + "] returned 200: ");
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		
	}

}
