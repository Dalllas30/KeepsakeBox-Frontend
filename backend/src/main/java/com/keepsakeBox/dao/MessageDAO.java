/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.keepsakeBox.dto.CaregiverLastMessageRead;
import com.keepsakeBox.dto.CaregiverPatientChat;
import com.keepsakeBox.dto.PatientChat;
import com.keepsakeBox.dto.PatientChatMessage;
import com.keepsakeBox.dto.PatientChatMessageData;

public class MessageDAO {

	//Class Logger
	Logger logger = Logger.getLogger(MessageDAO.class.getName());
	
	//DAO (Data Access Objects)
	private CaregiverDAO caregiverDAO = new CaregiverDAO();
		
	//Inserts a new chat on the DB for the patient with given ID 
	public String createPatientChat(Connection con, String patientId) 
			throws SQLException {
		String result = null;
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO patient_chat(patient_id, last_message_sent_date) "
				+ "VALUES('%s', now()) RETURNING id;",
				patientId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result = rs.getString("id");
			}
			logger.info("createPatientChat for patient [id: " 
				  + patientId + "] returned 200");
			return result;
		} catch (SQLException e) {
			logger.warning("createPatientChat for patient "
				  + "[id: " + patientId + "] returned error: " 
				  + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//Inserts on the DB a new message sent on the patient chat with given ID
	public PatientChatMessage insertPatientChatMessage(Connection con, String chatId, PatientChatMessageData messageData) throws SQLException {
		PatientChatMessage result = new PatientChatMessage();
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO patient_chat_message (patient_chat_id, "
				+ "created_by_id, message, created_date) "
				+ "VALUES('%s','%s','%s','%s') RETURNING id;",
				chatId, 
				messageData.getCreatedById(),
				messageData.getMessage(), 
				messageData.getCreatedDate());
		
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result.setId(rs.getString("id"));
				result.setCreatedBy(
				caregiverDAO.getSimpleCaregiverById(
						con, messageData.getCreatedById()));
				result.setMessage(messageData.getMessage());
				result.setCreatedDate(messageData.getCreatedDate());
			}
			this.updateLastMessageSent(
					con, chatId, messageData.getCreatedDate());
			
			logger.info("insertPatientChatMessage on chat "
				  + "[id: " + chatId + "] returned -> " 
				  + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("insertPatientChatMessage on chat "
				  + "[id: " + chatId + "] returned error: " 
				  + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//Updates a chat, with given ID, on the DB with last message sent date
	public void updateLastMessageSent(Connection con, String chatId, 
			Timestamp messageDate) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"UPDATE patient_chat "
				+ "SET last_message_sent_date='%s' "
				+ "WHERE id='%s' RETURNING id;",
				messageDate, 
				chatId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("updateLastMessageSent for chat "
				  + "[id: " + chatId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("updateLastMessageSent for chat "
				  + "[id: " + chatId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	/**
	 * Inserts a new association on the DB of the caregiver 
	 * with given ID to a patient chat
	 */
	public void associateCaregiverToPatientChat(Connection con, String caregiverId, String chatId, Timestamp messageDate) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO caregiver_patient_chat"
				+ "(caregiver_id, patient_chat_id, last_message_read_date) "
				+ "VALUES('%s', '%s', '%s') RETURNING patient_chat_id;",
				caregiverId, 
				chatId, 
				messageDate);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("associateCaregiverToPatientChat with caregiver "
				  + "[id: " + caregiverId + "] and patient chat "
				  + "[id: " + chatId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("associateCaregiverToPatientChat with caregiver "
				  + "[id: " + caregiverId + "] and patient chat [id: " + chatId + "] "
				  + "returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//Retrieves from the DB the chat associated to the patient with given ID
	public PatientChat getPatientChatByPatientId(Connection con, 
			String patientId, String caregiverId) throws SQLException {
		PatientChat result = new PatientChat();
		Statement stmt = null;
		String query = String.format(
				"SELECT c.id, c.last_message_sent_date, "
				+ "(select cpc.last_message_read_date "
				+ "FROM caregiver_patient_chat cpc inner "
				+ "join patient_chat cp on "
				+ "cpc.patient_chat_id = cp.id "
				+ "WHERE cpc.caregiver_id='%s' and "
				+ "cpc.patient_chat_id=c.id) last_message_read_date "
				+ "FROM patient_chat c WHERE c.patient_id ='%s';"
				,caregiverId,
				patientId);
		
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result.setId(rs.getString("id"));
				result.setLastMessageSentDate(
						rs.getTimestamp("last_message_sent_date"));
				result.setLastMessageReadDate(
						rs.getTimestamp("last_message_read_date"));
			}
			logger.info("getChatIdByPatientId with patient "
				  + "[id: " + patientId + "] returned -> " + result);
			return result;
		} catch (SQLException e) {
			logger.warning("getChatIdByPatientId with patient "
				  + "[id: " + patientId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		
	}

	//Retrieves from the DB a chat ID associated to the given patient ID
	public String getChatIdByPatientId(Connection con, String patientId) 
			throws SQLException {
		String result = null;
		Statement stmt = null;
		String query = String.format(
				"SELECT c.id FROM patient_chat c "
				+ "WHERE c.patient_id ='%s';"
				,patientId);
		
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result = rs.getString("id");
			}
			logger.info("getChatIdByPatientId with patient "
				  + "[id: " + patientId + "] returned -> " + result);
			return result;
		} catch (SQLException e) {
			logger.warning("getChatIdByPatientId with patient "
				  + "[id: " + patientId + "] returned error: " 
				  + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		
	}

	/**
	 * Retrieves from the DB all chats associated to patients 
	 * that are associated to the given caregiver ID
	 */
	public List<CaregiverPatientChat> getCaregiverPatientChatsByCaregiverId(
			Connection con, String caregiverId) throws SQLException {
		List<CaregiverPatientChat> result = new ArrayList<CaregiverPatientChat>();
		Statement stmt = null;
		String query = String.format(
				"SELECT c.patient_chat_id, c.last_message_read_date "
				+ "FROM caregiver_patient_chat c "
				+ "WHERE c.caregiver_id = '%s';", 
				caregiverId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				CaregiverPatientChat chat = new CaregiverPatientChat();
				chat.setChat(
					this.getPatientChatByChatId(
							con,rs.getString("patient_chat_id")));
				chat.setLastMessageReadDate(
						rs.getTimestamp("last_message_read_date"));
				result.add(chat);
			}
			logger.info("getCaregiverPatientChatsByCaregiverId from caregiver "
				  + "[id:" + caregiverId + "] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getCaregiverPatientChatsByCaregiverId from caregiver "
				  + "[id:" + caregiverId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//Retrieves a patient chat from the DB with given chat ID
	public PatientChat getPatientChatByChatId(
			Connection con, String chatId) throws SQLException {
		PatientChat result = new PatientChat();
		Statement stmt = null;
		String query = String.format(
				"SELECT p.last_message_sent_date "
				+ "FROM patient_chat p WHERE p.id = '%s';", 
				chatId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result.setId(chatId);
				result.setLastMessageSentDate(
						rs.getTimestamp("last_message_sent_date"));
			}
			logger.info("getPatientChatByChatId with chat [id:"
				  + chatId + "] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getPatientChatByChatId with chat [id:" 
				  + chatId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//Retrieves from the DB all messages sent on the chat with the given ID
	public List<PatientChatMessage> getPatientChatMessagesByChatId(
			Connection con, String chatId) throws SQLException {
		List<PatientChatMessage> result = new ArrayList<PatientChatMessage>();
		Statement stmt = null;
		String query = String.format(
				"SELECT p.id, p.created_by_id, p.message, p.created_date "
				+ "FROM patient_chat_message p WHERE p.patient_chat_id = '%s';", 
				chatId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				PatientChatMessage msg = new PatientChatMessage();
				msg.setId(rs.getString("id"));
				msg.setCreatedBy(caregiverDAO.getSimpleCaregiverById(
						con, rs.getString("created_by_id")));
				msg.setMessage(rs.getString("message"));
				msg.setCreatedDate(rs.getTimestamp("created_date"));
				result.add(msg);
			}
			logger.info("getPatientChatMessagesByChatId with chat "
				  + "[id:" + chatId + "] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getPatientChatMessagesByChatId with chat "
				  + "[id:" + chatId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Updates last message read date on the DB for the caregiver with given ID 
	 * for the chat with the given ID
	 */
	public void updateLastMessageRead(Connection con, CaregiverLastMessageRead updateData) 
			throws SQLException  {
		Statement stmt = null;
		String query = String.format(
				"UPDATE caregiver_patient_chat SET last_message_read_date='%s' "
				+ "WHERE caregiver_id='%s' AND patient_chat_id='%s' "
				+ "RETURNING caregiver_id;",
				updateData.getLastReadDate(), 
				updateData.getCaregiverId(), 
				updateData.getChatId());

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("updateLastMessageRead for caregiver "
				  + "[id: " + updateData.getCaregiverId() 
				  + "] on chat [id: " + updateData.getChatId() + "]");
		} catch (SQLException e) {
			logger.warning("updateLastMessageRead for caregiver "
				  + "[id: " + updateData.getCaregiverId() 
				  + "] on chat [id: " + updateData.getChatId() + "] "
				  + "returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Removes a caregiver from a patient chat
	 */
	public void removeCaregiverFromPatientChat(Connection con, 
			String caregiverId, String chatId) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"DELETE FROM caregiver_patient_chat "
				+ "WHERE caregiver_id='%s' AND patient_chat_id='%s' "
				+ "RETURNING caregiver_id;",
				caregiverId,
				chatId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("removeCaregiverFromPatientChat with caregiver [id: " 
			      + caregiverId + "] and chat with [id: "
			      + chatId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("removeCaregiverFromPatientChat with caregiver [id: " 
				      + caregiverId + "] and chat with [id: "
				      + chatId + "] returned error: " 
				  + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		
	}

}
