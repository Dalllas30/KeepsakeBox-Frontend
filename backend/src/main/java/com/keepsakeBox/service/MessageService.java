/**
 * V2
 * @author André Santana - fc49451
 * 
 * A service made for patient chat management. It manages all interactions
 * with socket chats, redirecting all data to DAO so the messages are kept
 * recorded on the DB and also all chat information as last caregiver read date
 * and last message sent on a chat.
 */

package com.keepsakeBox.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.ws.http.HTTPException;

import org.springframework.http.HttpStatus;

import com.keepsakeBox.dao.MessageDAO;
import com.keepsakeBox.dto.CaregiverLastMessageRead;
import com.keepsakeBox.dto.CaregiverPatientChatList;
import com.keepsakeBox.dto.InternalServerErrorException;
import com.keepsakeBox.dto.LoggedSession;
import com.keepsakeBox.dto.PatientChatMessage;
import com.keepsakeBox.dto.PatientChatMessageData;
import com.keepsakeBox.dto.PatientChatMessageList;
import com.keepsakeBox.dto.UnauthorizedException;

public class MessageService {
	
	//Class Logger
	Logger logger = Logger.getLogger(MessageService.class.getName());
	
	//DAO (Data Access Objects)
	private MessageDAO messageDAO = new MessageDAO();
	
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
	 * Gets all chats associated to patients that are associated to
	 * the current logged caregiver (which is associated to the token)
	 */
	public CaregiverPatientChatList getCaregiverPatientChats(
			List<LoggedSession> loggedSessions, String token) {
		CaregiverPatientChatList result = new CaregiverPatientChatList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setChats(messageDAO.
						getCaregiverPatientChatsByCaregiverId(con,
								actual.getCaregiverID()));
				
				logger.info("getCaregiverPatientChats with caregiver [token: " 
					  + token + "] responded 200: ");
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getCaregiverPatientChats with caregiver [token: " 
				  + token + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getCaregiverPatientChats with caregiver [token: " 
				  + token + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Inserts a new patient chat message into the chat
	 * with given ID
	 */
	public PatientChatMessage insertPatientChatMessage(
			String chatId, PatientChatMessageData messageData) {
		PatientChatMessage chatMessage = null;
		try {
			logger.info(messageData.getCreatedDate().toString());			
			chatMessage = messageDAO
					.insertPatientChatMessage(con, chatId, messageData);
			logger.info("insertPatientChatMessage on chat [id: " 
				  + chatId + "] responded 200: ");
			return chatMessage;
				
		} catch (HTTPException e) {
			logger.warning("insertPatientChatMessage on chat [id: " 
		          + chatId + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("insertPatientChatMessage on chat [id: " 
		          + chatId + "] responded 500 with: " 
				  + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Updates last message read date for caregiver with given ID 
	 * on the chat with given ID
	 */
	public void updateLastMessageReadByCaregiverOnChat(List<LoggedSession> loggedSessions,
			String token, CaregiverLastMessageRead updateData) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {	
				messageDAO.updateLastMessageRead(con, updateData);
				logger.info("updateLastMessageReadByCaregiverOnChat with caregiver [id: " 
					  + updateData.getCaregiverId() + "] on chat [id: " 
					  + updateData.getChatId()  
					  + "] responded 200: ");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("updateLastMessageReadByCaregiverOnChat with caregiver [id: " 
				  + updateData.getCaregiverId() + "] on chat [id: " 
				  + updateData.getChatId()  
				  + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("updateLastMessageReadByCaregiverOnChat with caregiver [id: " 
				  + updateData.getCaregiverId() + "] on chat [id: " 
				  + updateData.getChatId() + "] responded 500 with: " 
				  + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Gets all messages associated to a patient chat that are associated to
	 * a patient of the current logged caregiver
	 */
	public PatientChatMessageList getPatientChatMessages(
			List<LoggedSession> loggedSessions, String token,
			String chatId) {
		PatientChatMessageList result = new PatientChatMessageList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setMessages(messageDAO.
						getPatientChatMessagesByChatId(con,chatId));
				
				logger.info("getPatientChatMessages with chat [id: " 
					  + chatId + "] responded 200: ");
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getPatientChatMessages with chat [id: " 
				  + chatId + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getPatientChatMessages with chat [id: " 
				  + chatId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

}
