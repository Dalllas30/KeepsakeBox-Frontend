package com.keepsakeBox.dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.keepsakeBox.dto.Caregiver;
import com.keepsakeBox.dto.Patient;
import com.keepsakeBox.dto.PatientChat;
import com.keepsakeBox.dto.PatientChatMessage;
import com.keepsakeBox.dto.PatientChatMessageData;
import com.keepsakeBox.dto.Request;

public class RequestDAO {

	// Class Logger
	Logger logger = Logger.getLogger(RequestDAO.class.getName());

	// Inserts a new image upload request into the DB
	public String createUploadRequest(Connection con, Request requestData) throws SQLException {
		String result = null;
		Statement stmt = null;
		String query = String.format("INSERT INTO request (" + "caregiver_id, target_id, expiration_date) " + "VALUES('%s', '%s', '%s') RETURNING id;",
				requestData.getCaregiverID(), requestData.getTargetID(), requestData.getExpirationDate());
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result = rs.getString("id");
			}
			logger.info("createUploadRequest with request "
				  + "[caregiverId " + requestData.getCaregiverID() + "]");
			logger.info("id: " + result);
			return result;
		} catch (SQLException e) {
			logger.warning("createUploadRequest for request [id: " + requestData.getId() + "] returned error: "
					+ e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB the request with the given ID associated
	public Request getRequestById(Connection con, String requestId) throws SQLException {
		Request request = new Request();
		Statement stmt = null;
		String query = String.format("SELECT caregiver_id, target_id, expiration_date "
				+ "FROM request WHERE id = '%s';", requestId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				request.setId(requestId);
				request.setCaregiverID(rs.getString("caregiver_id"));
				request.setTargetID(rs.getString("target_id"));
				request.setExpirationDate(rs.getString("expiration_date"));
			}
			logger.info("getRequestById with request " + "[id: " + requestId + "] returned -> " + request);
			return request;
		} catch (SQLException e) {
			logger.warning(
					"getRequestById with request " + "[id: " + requestId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
}
