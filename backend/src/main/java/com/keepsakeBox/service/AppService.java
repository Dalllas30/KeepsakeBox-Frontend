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
import java.util.UUID;
import java.util.logging.Logger;

import javax.xml.ws.http.HTTPException;

import org.springframework.http.HttpStatus;

import com.keepsakeBox.dao.*;
import com.keepsakeBox.dto.*;

public class AppService {
	
	//Class Logger
	Logger logger = Logger.getLogger(AppService.class.getName());
	
	//DAO (Data Access Object)
	private CaregiverDAO caregiverDAO = new CaregiverDAO();
	
	//Services
	private FileStorageService fileStorageService = new FileStorageService();
	
	//Database Connection
	private Connection con = connect();
	private Connection connect() {
		try {
			return DriverManager.getConnection("jdbc:postgresql://localhost:5432/", "postgres", "postgres");
		} catch (SQLException e) {
			logger.warning("Could not connect to the Database.");
			throw new InternalServerErrorException(e.toString());
		}
	}
	
	//Logins a caregiver into the application and saves logged session
	public ResponseBasic login(List<LoggedSession> loggedSessions, 
			LoginData loginData) {
		try {
			ResponseBasic response = new ResponseBasic();
			
			//Gets caregiver password with email
			String pass = caregiverDAO
					.getPasswordByEmail(con, loginData.getEmail());

			//Verifies if password is equal to the one on the request
			if (pass.equals(loginData.getPassword())) {
				//Saves logged session status
				String id = caregiverDAO
						.getCaregiverIdByEmail(con, loginData.getEmail());
				UUID token = UUID.randomUUID();
				LoggedSession status = new LoggedSession(
						token.toString(), id, loginData.getEmail());
				loggedSessions.add(status);
				response.setResult(token.toString());
				caregiverDAO.updateCaregiverLastLoginDate(con, loginData.getEmail());
				logger.info("login for caregiver [email: " 
				      + loginData.getEmail() + "] responded:" + response.toString());
				return response;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("login for caregiver [email: " 
		          + loginData.getEmail() + "] responded 401");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("login for caregiver [email: " 
		          + loginData.getEmail() + "] responded 500 " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	//Regists a new caregiver into the application
	public void register(CaregiverRegisterData caregiverRegisterData) {
		try {
			String caregiverId = caregiverDAO
					.insertCaregiver(con,caregiverRegisterData);
			String imageName = caregiverId + ".jpeg";
			fileStorageService.uploadCaregiverProfileImage(
					caregiverRegisterData.getProfileImageURL(), imageName);
			logger.info("register for caregiver [email: " 
			      + caregiverRegisterData.getEmail() + "] responded 200");
		} catch (HTTPException e) {
			logger.info("register for caregiver [email: " 
		          + caregiverRegisterData.getEmail() + "] responded 401");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			if (e.getMessage()
				 .contains("violates unique constraint \"caregiver_email_key\"")) {
				logger.info("register for caregiver [email: " 
			          + caregiverRegisterData.getEmail() + "] responded 409 with: "
					  + e.getMessage().toString());
				throw new HTTPException(HttpStatus.CONFLICT.value());
			} else {
				logger.info("register for caregiver [email: " 
			          + caregiverRegisterData.getEmail() + "] responded 500 with: "
					  + e.getMessage().toString());
				throw new InternalServerErrorException(e.getMessage());
			}
		}
		
	}
	

	/**
	 * Logouts a caregiver from the application disabling the current
	 * associated and active session ID
	 */
	public void logout(List<LoggedSession> loggedSessions, String token) {
		LoggedSession actual = new LoggedSession(null, null, null);
		int index = 0;
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				index = i;
				break;
			}
		}
		
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				loggedSessions.remove(index);
				logger.info("logout for caregiver [email: " 
				      + actual.getCaregiverEmail() + "] responded 200.");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("logout for caregiver [token: " 
		          + token + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		}
	}

	/**
	 * Validates a password for the caregiver with the given token
	 * @throws SQLException 
	 */
	public void validatePassword(List<LoggedSession> loggedSessions, 
			String token, String password){
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				String caregiverPassword =
					caregiverDAO.getCaregiverPasswordById(con, actual.getCaregiverID());
				if(password.equals(caregiverPassword)) {
					logger.info("validatePassword for caregiver [token: " 
						      + token + "] responded 200.");
				}else {
					logger.warning("validatePassword for caregiver [token: " 
					          + token + "] responded 401: ");
					throw new UnauthorizedException("password not valid");
				}
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("validatePassword for caregiver [token: " 
		          + token + "] responded 401: ");
			throw new UnauthorizedException("user not logged in");
		} catch (Exception e) {
			logger.warning("validatePassword for caregiver [token: " 
			      + token + "] responded 500 " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
		
	}

	/**
	 * Changes a password for the caregiver with the given token
	 */
	public void changePassword(List<LoggedSession> loggedSessions, 
			String token, String password) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				caregiverDAO.changeCaregiverPasswordById(
						con, actual.getCaregiverID(), password);
				logger.info("changePassword for caregiver [token: " 
					      + token + "] responded 200.");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("changePassword for caregiver [token: " 
		          + token + "] responded 401: ");
			throw new UnauthorizedException("user not logged in");
		} catch (Exception e) {
			logger.warning("changePassword for caregiver [token: " 
			      + token + "] responded 500 " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}
	
}
