/**
 * V3
 * @author Pedro Neves - fc46430
 * 
 */

package com.keepsakeBox.service;

import java.util.List;

import javax.xml.ws.http.HTTPException;

import com.keepsakeBox.dto.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.ws.http.HTTPException;

import org.springframework.http.HttpStatus;

import com.keepsakeBox.dao.SessionDAO;
import com.keepsakeBox.dao.TemplateSessionDAO;

public class SessionService {
	
	Logger logger = Logger.getLogger(PatientService.class.getName());
	
	private SessionDAO sessionDAO = new SessionDAO();
	private TemplateSessionDAO templateSessionDAO = new TemplateSessionDAO();
	
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
	 * Retrieves all sessions from a patient with a given patient ID
	 */
	public SessionList getSessionListByPatient(List<LoggedSession> loggedSessions, String token,
			String patientId) {
		
		SessionList result = new SessionList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setSessions(sessionDAO.getSessionListByPatient(con, patientId, actual.getCaregiverID()));
				logger.info("getSessionListByPatient with patient [id:" + patientId 
						+ "] responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getPatientCaregiversByPatientID [id: " 
			          + patientId + "] responded 401:" + e.toString());
				throw new UnauthorizedException("user or password incorrect");
			} catch (Exception e) {
				logger.warning("getPatientCaregiversByPatientID [id: " 
			          + patientId + "] responded 500 with: " + e.toString());
				throw new InternalServerErrorException(e.toString());
			}
		
	}

	/**
	 * Retrieves all sessions created by the current caregiver
	 */
	public SessionList getSessionListByCaregiver(List<LoggedSession> loggedSessions, String token) {
		
		SessionList result = new SessionList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setSessions(sessionDAO.getSessionListByCaregiver(con, actual.getCaregiverID()));
				logger.info("getSessionListByCaregiver with patient []"  
						+ " responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getSessionListByCaregiver []" 
			          + " responded 401:" + e.toString());
				throw new UnauthorizedException("user or password incorrect");
			} catch (Exception e) {
				logger.warning("getSessionListByCaregiver []" 
			          + " responded 500 with: " + e.toString());
				throw new InternalServerErrorException(e.toString());
			}
		
	}

	public SessionList getSessionListByCaregiverHistory(List<LoggedSession> loggedSessions, String token) {
		
		SessionList result = new SessionList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setSessions(sessionDAO.getSessionListByCaregiverHistory(con, actual.getCaregiverID()));
				logger.info("getSessionListByCaregiverHistory with patient []"  
						+ " responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getSessionListByCaregiverHistory []" 
			          + " responded 401:" + e.toString());
				throw new UnauthorizedException("user or password incorrect");
			} catch (Exception e) {
				logger.warning("getSessionListByCaregiverHistory []" 
			          + " responded 500 with: " + e.toString());
				throw new InternalServerErrorException(e.toString());
			}
		
	}

    /**
     * Retrieves all sessions created by the current caregiver
     */
    public SessionList getSessionListByDateCaregiver(List<LoggedSession> loggedSessions, String token, String filter, String filterYear, String patientId) {

        SessionList result = new SessionList();
        LoggedSession actual = new LoggedSession(null, null, null);
        for (int i = 0; i < loggedSessions.size(); i++) {
            if (loggedSessions.get(i).getToken().equals(token)) {
                actual = loggedSessions.get(i);
                break;
            }
        }

        try {
            if (actual.getToken() != null && !actual.getToken().isEmpty()) {
                result.setSessions(sessionDAO.getSessionListByDateCaregiver(con, actual.getCaregiverID(), filter, filterYear, patientId));
                logger.info("getSessionListByCaregiver with patient []"
                        + " responded 200:" + result.toString());
                return result;
            } else {
                throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
            }
        } catch (HTTPException e) {
            logger.warning("getPatientCaregiversByPatientID []"
                    + " responded 401:" + e.toString());
            throw new UnauthorizedException("user or password incorrect");
        } catch (Exception e) {
            logger.warning("getPatientCaregiversByPatientID []"
                    + " responded 500 with: " + e.toString());
            throw new InternalServerErrorException(e.toString());
        }

    }

	/**
	 * Retrieves all sessions created by the current caregiver and patient
	 */
	public SessionList getSessionListByDatePatient(List<LoggedSession> loggedSessions, String token, String patientId, String filterMonth, String filterYear) {

		SessionList result = new SessionList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}

		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setSessions(sessionDAO.getSessionListByDatePatient(con, actual.getCaregiverID(), patientId,filterMonth, filterYear));
				logger.info("getSessionListByCaregiver with patient []"
						+ " responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getPatientCaregiversByPatientID []"
					+ " responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getPatientCaregiversByPatientID []"
					+ " responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}

	}

	public SessionList getTemplateSessionListByPatient(List<LoggedSession> loggedSessions, String token,
			String patientId) {
		
		SessionList result = new SessionList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setSessions(sessionDAO.getTemplateSessionListByPatient(con, patientId, actual.getCaregiverID()));
				logger.info("getTemplateSessionListByPatient with patient [id:" + patientId 
						+ "] responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getTemplateSessionListByPatient [id: " 
			          + patientId + "] responded 401:" + e.toString());
				throw new UnauthorizedException("user or password incorrect");
			} catch (Exception e) {
				logger.warning("getTemplateSessionListByPatient [id: " 
			          + patientId + "] responded 500 with: " + e.toString());
				throw new InternalServerErrorException(e.toString());
			}
		
	}


	public SessionFeedback getRtSessionFeedback(List<LoggedSession> loggedSessions, String token, String session_id) {
		SessionFeedback result = new SessionFeedback();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result = sessionDAO.getRtSessionFeedback(con, session_id );
				logger.info("getTemplateSessionListByPatient with patient [id:" + session_id 
						+ "] responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getRtSessionFeedback [session_id: " 
			          + session_id + "] responded 401:" + e.toString());
				throw new UnauthorizedException("user or password incorrect");
			} catch (Exception e) {
				logger.warning("getRtSessionFeedback [session_id: " 
			          + session_id + "] responded 500 with: " + e.toString());
				throw new InternalServerErrorException(e.toString());
			}		
	}

	public void updateRtSessionDuration(List<LoggedSession> loggedSessions, String token,
			SessionFeedback sessionFeedback) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				sessionFeedback.setCreated_by(actual.getCaregiverID());
				sessionDAO.updateRtSessionDuration(con, sessionFeedback);
				logger.info("updateRtSessionDuration [id: " 
						  + "[id:" + sessionFeedback.getSession_id() + "] returned 200.");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("updateRtSessionDuration [id: " 
					  + "[id:" + sessionFeedback.getSession_id() + "] responded 401: " + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("updateRtSessionDuration [id: " 
					  + "[id:" + sessionFeedback.getSession_id() + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
		
	}	
	
	public void updateRtSessionFeedback(List<LoggedSession> loggedSessions, String token,
			SessionFeedback sessionFeedback) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				sessionFeedback.setCreated_by(actual.getCaregiverID());
				sessionDAO.updateRtSessionFeedback(con, sessionFeedback);
				logger.info("updateRtSessionFeedback [id: " 
						  + "[id:" + sessionFeedback.getId() + "] returned 200.");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("updateRtSessionFeedback [id: " 
					  + "[id:" + sessionFeedback.getId() + "] responded 401: " + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("updateRtSessionFeedback [id: " 
					  + "[id:" + sessionFeedback.getId() + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
		
	}

	public void finishSession(List<LoggedSession> loggedSessions, String token, 
			String templateSessionId, String patientId, SessionFeedback sessionFeedback) {
		SessionFeedback result = new SessionFeedback();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				sessionDAO.finishSession(con, sessionFeedback);
				templateSessionDAO.removeTemplateSession(con, templateSessionId, patientId);
				logger.info("getTemplateSessionListByPatient with patient [id:" + sessionFeedback.getSession_id() 
						+ "] responded 200:" + result.toString());
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getRtSessionFeedback [session_id: " 
			          + sessionFeedback.getSession_id()  + "] responded 401:" + e.toString());
				throw new UnauthorizedException("user or password incorrect");
			} catch (Exception e) {
				logger.warning("getRtSessionFeedback [session_id: " 
			          + sessionFeedback.getSession_id()  + "] responded 500 with: " + e.toString());
				throw new InternalServerErrorException(e.toString());
			}
		

		
	}
}
