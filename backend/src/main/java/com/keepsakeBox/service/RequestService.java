package com.keepsakeBox.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.ws.http.HTTPException;

import org.springframework.http.HttpStatus;

import com.keepsakeBox.dao.CategoryDAO;
import com.keepsakeBox.dao.MessageDAO;
import com.keepsakeBox.dao.RequestDAO;
import com.keepsakeBox.dto.CaregiverRegisterData;
import com.keepsakeBox.dto.CategoryList;
import com.keepsakeBox.dto.InternalServerErrorException;
import com.keepsakeBox.dto.LoggedSession;
import com.keepsakeBox.dto.Patient;
import com.keepsakeBox.dto.PatientChatMessage;
import com.keepsakeBox.dto.PatientChatMessageData;
import com.keepsakeBox.dto.Request;
import com.keepsakeBox.dto.UnauthorizedException;

public class RequestService {

	// Logger
	Logger logger = Logger.getLogger(RequestService.class.getName());

	// DAO (Data Access Objects)
	private RequestDAO requestDAO = new RequestDAO();

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

	// Regists a new request into the application
	public String createUploadRequest(Request request) {
		try {
			String result = requestDAO.createUploadRequest(con, request);
			logger.info(
					"createUploadRequest for request [caregiverID: " + request.getCaregiverID() + "] responded 200");
			logger.info("id: " + result);
			return result;
		} catch (HTTPException e) {
			logger.info(
					"createUploadRequest for request [caregiverID: " + request.getCaregiverID() + "] responded 401");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.info("createUploadRequest for request [caregiverID: " + request.getCaregiverID()
					+ "] responded 500 with: " + e.getMessage().toString());
			throw new InternalServerErrorException(e.getMessage());

		}

	}

	// Retrieves a request data with given request ID
	public Request getRequestByID(String requestId) {
		try {
			Request request = requestDAO.getRequestById(con, requestId);
			logger.info("getRequestByID [id: " + requestId + "] responded 200: ");
			return request;
		} catch (HTTPException e) {
			logger.warning("getRequestByID [id: " + requestId + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getRequestByID [id: " + requestId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}
}
