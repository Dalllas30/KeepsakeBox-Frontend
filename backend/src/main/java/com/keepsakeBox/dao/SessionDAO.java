/**
 * V3
 * @author Pedro Neves - fc46430
 */
package com.keepsakeBox.dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Time;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import com.keepsakeBox.dto.*;
import com.keepsakeBox.service.FileStorageService;

public class SessionDAO {

	//Logger
		Logger logger = Logger.getLogger(PatientDAO.class.getName());

		//Services
		private FileStorageService fileStorageService = new FileStorageService();

		/**
		 * Retrieves all caregivers associated to the given
		 * patient ID from the DB
		 */
		public List<Session> getSessionListByPatient(Connection con, String patientId,
				String currentCaregiverId) throws SQLException {
			List<Session> result = new ArrayList<Session>();
			Statement stmt = null;
			String query = String.format(
					"SELECT s.id, "
					+ "c.name AS caregiver_name, "
					+ "p.id AS patient_id, "
					+ "p.display_name AS patient_name, "
					+ "s.caregiver_id, "
					+ "s.start_session_date, "
					+ "s.end_session_date, "
					+ "s.session_finished, "
					+ "s.duration, "
					+ "s.total_images, "
					+ "s.patient_feedback, "
					+ "sF.created_by, "
					+ "sF.anxiety, "
					+ "sF.agressivity, "
					+ "sF.irritability, "
					+ "sF.commitment, "
					+ "sF.joy, "
					+ "sF.enthusiasm, "
					+ "sF.communication, "
					+ "sF.apathy, "
					+ "sF.patient_agressivity, "
					+ "sF.patient_sadness, "
					+ "sF.patient_isolation, "
					+ "sF.patient_observation "
					+ "FROM session s "
					+ "INNER JOIN patient p ON s.patient_id = p.id "
					+ "INNER JOIN caregiver c ON s.caregiver_id = c.id "
					+ "INNER JOIN session_feedback sF ON s.id = sF.session_id "
					+ "WHERE s.patient_id = '%s' AND s.session_finished = true "
					//+ "AND s.id in (SELECT record_id FROM access_control_list WHERE persona_id = '%s') "
					+ "ORDER BY s.end_session_date DESC",
					patientId,currentCaregiverId);

			try {
				stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery(query);
				while (rs.next()) {
					Session session = new Session();
					session.setId(rs.getString("id"));
					session.setCaregiver_name(rs.getString("caregiver_name"));
					session.setCaregiver_id(rs.getString("caregiver_id"));
					session.setPatient_id(rs.getString("patient_id"));
					session.setPatient_name(rs.getString("patient_name"));
					session.setStart_session(rs.getDate("start_session_date"));
					session.setEnd_session(rs.getDate("end_session_date"));
					session.setSession_finished(rs.getBoolean("session_finished"));
					session.setDuration(rs.getTime("duration"));
					session.setTotal_images(rs.getInt("total_images"));
					session.setPatient_feedback(rs.getInt("patient_feedback"));
					SessionFeedback globalFeedback = new SessionFeedback();
					globalFeedback.setSession_id(rs.getString("id"));
					globalFeedback.setCreated_by(rs.getString("created_by"));
					globalFeedback.setCreated_date(rs.getDate("start_session_date"));
					globalFeedback.setPatient_feedback(rs.getInt("patient_feedback"));
					globalFeedback.setAnxiety(rs.getInt("anxiety"));
					globalFeedback.setAgressivity(rs.getInt("agressivity"));
					globalFeedback.setIrritability(rs.getInt("irritability"));
					globalFeedback.setCommitment(rs.getInt("commitment"));
					globalFeedback.setJoy(rs.getInt("joy"));
					globalFeedback.setEnthusiasm(rs.getInt("enthusiasm"));
					globalFeedback.setCommunication(rs.getInt("communication"));
					globalFeedback.setApathy(rs.getInt("apathy"));
					globalFeedback.setPatient_agressivity(rs.getInt("patient_agressivity"));
					globalFeedback.setPatient_sadness(rs.getInt("patient_sadness"));
					globalFeedback.setPatient_isolation(rs.getInt("patient_isolation"));
					globalFeedback.setPatient_observation(rs.getString("patient_observation"));
					//System.out.println(globalFeedback);
					session.setGlobal_feedback(globalFeedback);
					result.add(session);
				}
				logger.info("getSessionListByPatient with patient [id:" + patientId
					  + "] returned -> " + result.toString());
				return result;
			} catch (SQLException e) {
				logger.warning("getSessionListByPatient with patient [id" + patientId
						+ "] returned error: " + e.toString());
				throw new SQLException(e);
			} finally {
				if (stmt != null) {
					stmt.close();
				}
			}
		}

		/**
		 * Retrieves all caregivers associated to the given
		 * patient ID from the DB
		 */
		public List<Session> getTemplateSessionListByPatient(Connection con, String patientId,
				String currentCaregiverId) throws SQLException {
			List<Session> result = new ArrayList<Session>();
			Statement stmt = null;
			String query = String.format(
					"SELECT s.id, "
					+ "c.name AS caregiver_name, "
					+ "p.id AS patient_id, "
					+ "p.display_name AS patient_name, "
					+ "s.start_session_date, "
					+ "s.end_session_date, "
					+ "s.session_finished, "
					+ "s.duration, "
					+ "s.total_images "
					+ "FROM session s "
					+ "INNER JOIN patient p ON s.patient_id = p.id "
					+ "INNER JOIN caregiver c ON s.caregiver_id = c.id "
					+ "WHERE s.patient_id = '%s' AND s.session_finished = false "
					+ "AND s.id in (SELECT record_id FROM access_control_list WHERE persona_id = '%s') "
					+ "ORDER BY s.session_finished, s.start_session_date ASC",
					patientId,currentCaregiverId);

			try {
				stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery(query);
				while (rs.next()) {
					Session session = new Session();
					session.setId(rs.getString("id"));
					session.setCaregiver_name(rs.getString("caregiver_name"));
					session.setPatient_id(rs.getString("patient_id"));
					session.setPatient_name(rs.getString("patient_name"));
					session.setStart_session(rs.getDate("start_session_date"));
					session.setEnd_session(rs.getDate("end_session_date"));
					session.setSession_finished(rs.getBoolean("session_finished"));
					session.setDuration(rs.getTime("duration"));
					session.setTotal_images(rs.getInt("total_images"));
					result.add(session);
				}
				logger.info("getSessionListByPatient with patient [id:" + patientId
					  + "] returned -> " + result.toString());
				return result;
			} catch (SQLException e) {
				logger.warning("getSessionListByPatient with patient [id" + patientId
						+ "] returned error: " + e.toString());
				throw new SQLException(e);
			} finally {
				if (stmt != null) {
					stmt.close();
				}
			}
		}

		//Retrieves all caregivers associated to the given patient ID from the DB
		/**
		 * Retrieves all patients associated to the given
		 * caregiver ID from the DB
		 */
		public List<Session> getSessionListByCaregiver(Connection con,
				String currentCaregiverId) throws SQLException {
			List<Session> result = new ArrayList<Session>();
			Statement stmt = null;
			String query = String.format(
					"SELECT s.id, "
					+ "c.name AS caregiver_name, "
					+ "p.id AS patient_id, "
					+ "p.display_name AS patient_name, "
					+ "s.start_session_date, "
					+ "s.end_session_date, "
					+ "s.session_finished, "
					+ "s.duration, "
					+ "s.total_images "
					+ "FROM session s "
					+ "INNER JOIN patient p ON s.patient_id = p.id "
					+ "INNER JOIN caregiver c ON s.caregiver_id = c.id "
					+ "WHERE s.caregiver_id = '%s' AND s.session_finished = true "
					+ "ORDER BY s.session_finished, s.start_session_date ASC",
					currentCaregiverId);

			try {
				stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery(query);
				while (rs.next()) {
					Session session = new Session();
					session.setId(rs.getString("id"));
					session.setCaregiver_name(rs.getString("caregiver_name"));
					session.setPatient_id(rs.getString("patient_id"));
					session.setPatient_name(rs.getString("patient_name"));
					session.setStart_session(rs.getDate("start_session_date"));
					session.setEnd_session(rs.getDate("end_session_date"));
					session.setSession_finished(rs.getBoolean("session_finished"));
					session.setDuration(rs.getTime("duration"));
					session.setTotal_images(rs.getInt("total_images"));
					result.add(session);
				}
				logger.info("getSessionListByCaregiver []"
					  + " returned -> " + result.toString());
				return result;
			} catch (SQLException e) {
				logger.warning("getSessionListByCaregiver []"
						+ " returned error: " + e.toString());
				throw new SQLException(e);
			} finally {
				if (stmt != null) {
					stmt.close();
				}
			}
		}
		//Retrieves all caregivers associated to the given patient ID from the DB
		/**
		 * Retrieves all patients associated to the given
		 * caregiver ID from the DB
		 */
		public List<Session> getSessionListByCaregiverHistory(Connection con,
				String currentCaregiverId) throws SQLException {
			List<Session> result = new ArrayList<Session>();
			Statement stmt = null;

			String query = String.format(
					"SELECT s.id, "
					+ "c.name AS caregiver_name, "
					+ "p.id AS patient_id, "
					+ "p.display_name AS patient_name, "
					+ "p.name AS full_name, "
					+ "s.start_session_date, "
					+ "s.end_session_date, "
					+ "s.session_finished, "
					+ "s.duration, "
					+ "s.total_images, "
					+ "s.patient_feedback, "
					+ "sF.created_by, "
					+ "sF.anxiety, "
					+ "sF.agressivity, "
					+ "sF.irritability, "
					+ "sF.commitment, "
					+ "sF.joy, "
					+ "sF.enthusiasm, "
					+ "sF.communication, "
					+ "sF.apathy, "
					+ "sF.patient_agressivity, "
					+ "sF.patient_sadness, "
					+ "sF.patient_isolation, "
					+ "sF.patient_observation "
					+ "FROM session s "
					+ "INNER JOIN patient p ON s.patient_id = p.id "
					+ "INNER JOIN caregiver c ON s.caregiver_id = c.id "
					+ "INNER JOIN session_feedback sF ON s.id = sF.session_id "
					+ "WHERE s.caregiver_id = '%s' AND s.session_finished = true "
					+ "ORDER BY s.end_session_date DESC",
					currentCaregiverId);

			try {
				stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery(query);
				while (rs.next()) {
					Session session = new Session();
					session.setId(rs.getString("id"));
					session.setCaregiver_name(rs.getString("caregiver_name"));
					session.setPatient_id(rs.getString("patient_id"));
					session.setPatient_name(rs.getString("patient_name"));
					session.setFull_name(rs.getString("full_name"));
					session.setStart_session(rs.getDate("start_session_date"));
					session.setEnd_session(rs.getDate("end_session_date"));
					session.setSession_finished(rs.getBoolean("session_finished"));
					session.setDuration(rs.getTime("duration"));
					session.setTotal_images(rs.getInt("total_images"));
					session.setPatient_feedback(rs.getInt("patient_feedback"));
					SessionFeedback globalFeedback = new SessionFeedback();
					globalFeedback.setSession_id(rs.getString("id"));
					globalFeedback.setCreated_by(rs.getString("created_by"));
					globalFeedback.setCreated_date(rs.getDate("start_session_date"));
					globalFeedback.setPatient_feedback(rs.getInt("patient_feedback"));
					globalFeedback.setAnxiety(rs.getInt("anxiety"));
					globalFeedback.setAgressivity(rs.getInt("agressivity"));
					globalFeedback.setIrritability(rs.getInt("irritability"));
					globalFeedback.setCommitment(rs.getInt("commitment"));
					globalFeedback.setJoy(rs.getInt("joy"));
					globalFeedback.setEnthusiasm(rs.getInt("enthusiasm"));
					globalFeedback.setCommunication(rs.getInt("communication"));
					globalFeedback.setApathy(rs.getInt("apathy"));
					globalFeedback.setPatient_agressivity(rs.getInt("patient_agressivity"));
					globalFeedback.setPatient_sadness(rs.getInt("patient_sadness"));
					globalFeedback.setPatient_isolation(rs.getInt("patient_isolation"));
					globalFeedback.setPatient_observation(rs.getString("patient_observation"));
					//System.out.println("Sessão  = " + session);
					session.setGlobal_feedback(globalFeedback);
					result.add(session);
				}
				logger.info("getSessionListByCaregiverHistory []"
					  + " returned -> " + result.toString());
				return result;
			} catch (SQLException e) {
				logger.warning("getSessionListByCaregiverHistory []"
						+ " returned error: " + e.toString());
				throw new SQLException(e);
			} finally {
				if (stmt != null) {
					stmt.close();
				}
			}
		}

	public List<Session> getSessionListByDateCaregiver(Connection con, String currentCaregiverId, String filter, String filterYear, String patientId) throws SQLException {
		List<Session> result = new ArrayList<Session>();
		Statement stmt = null;
		String sqlFilter="";
		String sqlFilterPatient = "";
		if (filter.equals("allMonths")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-01-01' AND s.end_session_date <= '" + filterYear + "-12-31'";
		} else if (filter.equals("january")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-01-01' AND s.end_session_date < '" + filterYear + "-02-01'";
		} else if (filter.equals("february")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-02-01' AND s.end_session_date < '" + filterYear + "-03-01'";
		} else if (filter.equals("march")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-03-01' AND s.end_session_date < '" + filterYear + "-04-01'";
		} else if (filter.equals("april")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-04-01' AND s.end_session_date < '" + filterYear + "-05-01'";
		} else if (filter.equals("may")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-05-01' AND s.end_session_date < '" + filterYear + "-06-01'";
		} else if (filter.equals("june")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-06-01' AND s.end_session_date < '" + filterYear + "-07-01'";
		} else if (filter.equals("july")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-07-01' AND s.end_session_date < '" + filterYear + "-08-01'";
		} else if (filter.equals("august")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-08-01' AND s.end_session_date < '" + filterYear + "-09-01'";
		} else if (filter.equals("september")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-09-01' AND s.end_session_date < '" + filterYear + "-10-01'";
		} else if (filter.equals("october")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-10-01' AND s.end_session_date < '" + filterYear + "-11-01'";
		} else if (filter.equals("november")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-11-01' AND s.end_session_date < '" + filterYear + "-12-01'";
		} else if (filter.equals("december")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-12-01' AND s.end_session_date < '" + filterYear + "-01-01'";
		}
		if (patientId.equals("Todos") || patientId.equals("All")){
		} else {
			sqlFilterPatient = " AND s.patient_id = '" + patientId + "'";
		}
		System.out.println("sqlFilter : " + sqlFilter);
		System.out.println("sqlFilterPatient : " + sqlFilterPatient);

		String query = String.format(
				"SELECT s.id, "
						+ "c.name AS caregiver_name, "
						+ "p.id AS patient_id, "
						+ "p.display_name AS patient_name, "
						+ "p.name AS full_name, "
						+ "s.start_session_date, "
						+ "s.end_session_date, "
						+ "s.session_finished, "
						+ "s.duration, "
						+ "s.total_images, "
						+ "s.patient_feedback "
						+ "FROM session s "
						+ "INNER JOIN patient p ON s.patient_id = p.id "
						+ "INNER JOIN caregiver c ON s.caregiver_id = c.id "
						+ "WHERE s.caregiver_id = '%s' AND s.session_finished = true "
						+ sqlFilter
						+ sqlFilterPatient
						+ " ORDER BY patient_id ASC",
				currentCaregiverId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				Session session = new Session();
				session.setId(rs.getString("id"));
				session.setCaregiver_name(rs.getString("caregiver_name"));
				session.setPatient_id(rs.getString("patient_id"));
				session.setPatient_name(rs.getString("patient_name"));
				session.setFull_name(rs.getString("full_name"));
				session.setStart_session(rs.getDate("start_session_date"));
				session.setEnd_session(rs.getDate("end_session_date"));
				session.setSession_finished(rs.getBoolean("session_finished"));
				session.setDuration(rs.getTime("duration"));
				session.setTotal_images(rs.getInt("total_images"));
				session.setPatient_feedback(rs.getInt("patient_feedback"));
				result.add(session);
			}
			logger.info("getSessionListByDateCaregiver []"
					+ " returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getSessionListByDateCaregiver []"
					+ " returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	public List<Session> getSessionListByDatePatient(Connection con, String currentCaregiverId, String patientId, String filterMonth, String filterYear) throws SQLException {
		List<Session> result = new ArrayList<Session>();
		Statement stmt = null;
		String sqlFilter="";
		if (filterMonth.equals("allMonths")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-01-01' AND s.end_session_date <= '" + filterYear + "-12-31'";
		} else if (filterMonth.equals("january")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-01-01' AND s.end_session_date < '" + filterYear + "-02-01'";
		} else if (filterMonth.equals("february")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-02-01' AND s.end_session_date < '" + filterYear + "-03-01'";
		} else if (filterMonth.equals("march")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-03-01' AND s.end_session_date < '" + filterYear + "-04-01'";
		} else if (filterMonth.equals("april")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-04-01' AND s.end_session_date < '" + filterYear + "-05-01'";
		} else if (filterMonth.equals("may")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-05-01' AND s.end_session_date < '" + filterYear + "-06-01'";
		} else if (filterMonth.equals("june")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-06-01' AND s.end_session_date < '" + filterYear + "-07-01'";
		} else if (filterMonth.equals("july")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-07-01' AND s.end_session_date < '" + filterYear + "-08-01'";
		} else if (filterMonth.equals("august")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-08-01' AND s.end_session_date < '" + filterYear + "-09-01'";
		} else if (filterMonth.equals("september")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-09-01' AND s.end_session_date < '" + filterYear + "-10-01'";
		} else if (filterMonth.equals("october")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-10-01' AND s.end_session_date < '" + filterYear + "-11-01'";
		} else if (filterMonth.equals("november")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-11-01' AND s.end_session_date < '" + filterYear + "-12-01'";
		} else if (filterMonth.equals("december")) {
			sqlFilter = "AND s.end_session_date >= '" + filterYear + "-12-01' AND s.end_session_date < '" + filterYear + "-01-01'";
		}
		System.out.println("sqlFilter = " + sqlFilter);

		String query = String.format(
				"SELECT s.id, "
						+ "c.name AS caregiver_name, "
						+ "p.id AS patient_id, "
						+ "p.display_name AS patient_name, "
						+ "s.caregiver_id, "
						+ "s.start_session_date, "
						+ "s.end_session_date, "
						+ "s.session_finished, "
						+ "s.duration, "
						+ "s.total_images, "
						+ "s.patient_feedback "
						+ "FROM session s "
						+ "INNER JOIN patient p ON s.patient_id = p.id "
						+ "INNER JOIN caregiver c ON s.caregiver_id = c.id "
						+ "WHERE s.session_finished = true AND s.patient_id = '%s'" // s.caregiver_id = '%s' AND
						+ sqlFilter
						+ "ORDER BY patient_id ASC",
				patientId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				Session session = new Session();
				session.setId(rs.getString("id"));
				session.setCaregiver_name(rs.getString("caregiver_name"));
				session.setCaregiver_id(rs.getString("caregiver_id"));
				session.setPatient_id(rs.getString("patient_id"));
				session.setPatient_name(rs.getString("patient_name"));
				session.setStart_session(rs.getDate("start_session_date"));
				session.setEnd_session(rs.getDate("end_session_date"));
				session.setSession_finished(rs.getBoolean("session_finished"));
				session.setDuration(rs.getTime("duration"));
				session.setTotal_images(rs.getInt("total_images"));
				session.setPatient_feedback(rs.getInt("patient_feedback"));
				result.add(session);
			}
			logger.info("getSessionListByDateCaregiver []"
					+ " returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getSessionListByDateCaregiver []"
					+ " returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
		public void updateRtSessionDuration(Connection con, SessionFeedback sessionFeedback)
				throws SQLException {
			Statement stmt = null;
			String query = String.format("UPDATE session SET "
					+ "duration = duration + interval '1 SECOND' * %s "
					+ "WHERE id='%s'",
					sessionFeedback.getDuration(),
					sessionFeedback.getSession_id());
			try {
				stmt = con.createStatement();
				stmt.executeUpdate(query);
				logger.info("updateRtSessionDuration for session "
						  + "[id:" + sessionFeedback.getSession_id() + "] returned 200.");
				} catch (SQLException e) {
					logger.warning("updateRtSessionDuration for session "
						  + "[id:" + sessionFeedback.getSession_id() + "] returned error: "
				          + e.toString());
					throw new SQLException(e);
				} finally {
					if (stmt != null) {
						stmt.close();
					}
				}
		}


		public void updateRtSessionFeedback(Connection con, SessionFeedback sessionFeedback)
				throws SQLException {
			Statement stmt = null;
			int feedback_records=0;
			String query = String.format("SELECT count(*) AS feedback_records FROM session_feedback "
					+ "WHERE session_id='%s'",
					sessionFeedback.getSession_id());
			try {
				stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery(query);
				while (rs.next()) {
					feedback_records=rs.getInt("feedback_records");
				}
				if (feedback_records==0) { // Não existe feedback => insert do feedback
					query = String.format(
							"INSERT INTO session_feedback "
							+ "(session_id, created_by, created_date, patient_feedback, "
							+ "anxiety, agressivity, irritability, commitment, joy, enthusiasm, communication, apathy, "
							+ "patient_agressivity, patient_sadness, patient_isolation, patient_observation) "
							+ "VALUES ('%s', '%s', now(), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, '%s') RETURNING id; ",
							sessionFeedback.getSession_id(), sessionFeedback.getCreated_by(), sessionFeedback.getPatient_feedback(),
							sessionFeedback.getAnxiety(), sessionFeedback.getAgressivity(), sessionFeedback.getIrritability(),
							sessionFeedback.getCommitment(), sessionFeedback.getJoy(), sessionFeedback.getEnthusiasm(),
							sessionFeedback.getCommunication(), sessionFeedback.getApathy(),
							sessionFeedback.getPatient_agressivity(), sessionFeedback.getPatient_sadness(),
							sessionFeedback.getPatient_isolation(), sessionFeedback.getPatient_observation());
				} else { // Já existe feedback => update do feedback
					query = String.format(
							"UPDATE session_feedback SET "
							+ "created_by='%s', "
							+ "created_date=now(), "
							+ "patient_feedback=%s, "
							+ "anxiety=%s, "
							+ "agressivity=%s, "
							+ "irritability=%s, "
							+ "commitment=%s, "
							+ "joy=%s, "
							+ "enthusiasm=%s, "
							+ "communication=%s, "
							+ "apathy=%s, "
							+ "patient_agressivity=%s, "
							+ "patient_sadness=%s, "
							+ "patient_isolation=%s, "
							+ "patient_observation='%s' "
							+ "WHERE session_id='%s' "
							+ "RETURNING id;",
							sessionFeedback.getCreated_by(), sessionFeedback.getPatient_feedback(),
							sessionFeedback.getAnxiety(), sessionFeedback.getAgressivity(), sessionFeedback.getIrritability(),
							sessionFeedback.getCommitment(), sessionFeedback.getJoy(), sessionFeedback.getEnthusiasm(),
							sessionFeedback.getCommunication(), sessionFeedback.getApathy(),
							sessionFeedback.getPatient_agressivity(), sessionFeedback.getPatient_sadness(), sessionFeedback.getPatient_isolation(),
							sessionFeedback.getPatient_observation(), sessionFeedback.getSession_id());
				}
				rs = stmt.executeQuery(query);
				while (rs.next()) {
					sessionFeedback.setId(rs.getString("id"));
				}
				updateRtSessionDuration(con,sessionFeedback);

				logger.info("updateRunningRtSessionImageFeedback for session_image "
						  + "[id:" + sessionFeedback.getId() + "] returned 200.");
				} catch (SQLException e) {
					logger.warning("updateRunningRtSessionImageFeedback for session_image "
						  + "[id:" + sessionFeedback.getId() + "] returned error: "
				          + e.toString());
					throw new SQLException(e);
				} finally {
					if (stmt != null) {
						stmt.close();
					}
				}

		}

		public SessionFeedback getRtSessionFeedback(Connection con, String session_id)
				throws SQLException {
			SessionFeedback result = new SessionFeedback();
			Statement stmt = null;
			String query = String.format(
					"SELECT s.id, "
					+ "session_id, "
					+ "created_by, "
					+ "created_date, "
					+ "patient_feedback, "
					+ "anxiety, "
					+ "agressivity, "
					+ "irritability, "
					+ "commitment, "
					+ "joy, "
					+ "enthusiasm, "
					+ "communication, "
					+ "apathy, "
					+ "patient_agressivity, "
					+ "patient_sadness, "
					+ "patient_isolation, "
					+ "patient_observation "
					+ "FROM session_feedback AS s "
					+ "WHERE s.session_id ='%s';",
					session_id);
			try {
				stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery(query);
				while (rs.next()) {
					result.setId(rs.getString("id"));
					result.setSession_id(rs.getString("session_id"));
					result.setCreated_by(rs.getString("created_by"));
					result.setCreated_date(rs.getDate("created_date"));
					result.setPatient_feedback(rs.getInt("patient_feedback"));
					result.setAnxiety(rs.getInt("anxiety"));
					result.setAgressivity(rs.getInt("agressivity"));
					result.setIrritability(rs.getInt("irritability"));
					result.setCommitment(rs.getInt("commitment"));
					result.setJoy(rs.getInt("joy"));
					result.setEnthusiasm(rs.getInt("enthusiasm"));
					result.setCommunication(rs.getInt("communication"));
					result.setApathy(rs.getInt("apathy"));
					result.setPatient_agressivity(rs.getInt("patient_agressivity"));
					result.setPatient_sadness(rs.getInt("patient_sadness"));
					result.setPatient_isolation(rs.getInt("patient_isolation"));
					result.setPatient_observation(rs.getString("patient_observation"));
				}
				logger.info("getRtSessionFeedback [session_id: "
					  + session_id + "] returned -> " + result.toString());
				return result;
			} catch (SQLException e) {
				logger.warning("getRtSessionFeedback [session_id: "
						+ session_id + "] returned error: " + e.toString());
				throw new SQLException(e);
			} finally {
				if (stmt != null) {
					stmt.close();
				}
			}
		}

		public void finishSession(Connection con, SessionFeedback sessionFeedback) throws SQLException{
			updateRtSessionFeedback(con, sessionFeedback);
			Statement stmt = null;
			String query = String.format(
					"UPDATE session SET "
					+ "end_session_date=now(), "
					+ "session_finished=TRUE, "
					+ "patient_feedback=%s "
					+ "WHERE id='%s' "
					+ "RETURNING id;",
					sessionFeedback.getPatient_feedback(),
					sessionFeedback.getSession_id());
			try {
				stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery(query);
				while (rs.next()) {
					query = String.format(
							"DELETE FROM session_running "
							+ "WHERE session_id='%s'",
						sessionFeedback.getSession_id());
					stmt = con.createStatement();
					stmt.executeUpdate(query);
				}

				logger.info("finishedSession for session "
					  + "[id:" + sessionFeedback.getSession_id() + "] returned 200.");
			} catch (SQLException e) {
				logger.warning("finishedSession for session "
					  + "[id:" + sessionFeedback.getSession_id() + "] returned error: "
			          + e.toString());
				throw new SQLException(e);
			} finally {
				if (stmt != null) {
					stmt.close();
				}
			}
		}

}
