package com.keepsakeBox.dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.keepsakeBox.dto.*;
import com.keepsakeBox.service.FileStorageService;

public class TemplateSessionDAO {
	
	//Services
	private FileStorageService fileStorageService = new FileStorageService();

	//Logger
	Logger logger = Logger.getLogger(PatientDAO.class.getName());
	
	// Insert a new template session into the DB with given data -------------------------## Falta gerir transação !!!!!			
	public String createTemplateSession(Connection con, String currentCaregiverId,
			TemplateSessionData templateSessionData, List<TemplateSessionImage> imageList) throws SQLException { // ========== foi reformulado
		
		String result = null;
		Statement stmt = null;
    	String query="";
    	if (templateSessionData.getPatient_id().length()==0) {
    		query = String.format("INSERT INTO "
    				+ "template_session(caregiver_id, "
    				+ "patient_id, "
    				+ "total_images, "
    				+ "categories, "
    				+ "created_date, "
    				+ "last_updated_date) "
    				+ "VALUES('%s', null, %s, '%s', now(), now() ) RETURNING id;",
    				templateSessionData.getCaregiver_id(),
    				templateSessionData.getTotal_images(),
    				templateSessionData.getCategories());
    	} else {
    		query = String.format("INSERT INTO "
				+ "template_session(caregiver_id, "
				+ "patient_id, "
				+ "total_images, "
				+ "categories, "
				+ "created_date, "
				+ "last_updated_date) "
				+ "VALUES('%s', '%s', %s, '%s', now(), now() ) RETURNING id;",
				templateSessionData.getCaregiver_id(),
				templateSessionData.getPatient_id(),
				templateSessionData.getTotal_images(),
				templateSessionData.getCategories());
    	}
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			if (rs.next()) {
				result = rs.getString("id");
				String query_acl = String.format("INSERT INTO access_control_list(record_id, persona_id, record_type, persona_type) "
						+ "VALUES ('%s','%s',1 , 1);",
						result,templateSessionData.getCaregiver_id());
				stmt.execute(query_acl);				
			}
			for (int i=0; i < imageList.size(); i++) {
		    	String image_query = String.format("INSERT INTO template_session_image(template_session_id, "
		    			+ "image_id, "
						+ "position_image) "
						+ "VALUES('%s','%s', %s) RETURNING template_session_id;",
						result, imageList.get(i).getImage_id(), imageList.get(i).getPosition_image());
				stmt.execute(image_query);				
			}
	    	if (templateSessionData.getPatient_id().length()>0) {
	        	String query_patient = String.format("INSERT INTO "
	        			+ "access_control_list(record_id, "    // + "template_session_patient(template_session_id, "
	        			+ "persona_id, "                       // + "patient_id) "
	        			+ "record_type, "
	        			+ "persona_type) "
	        			+ "VALUES('%s', '%s', 1, 2);",
	        			result,
	        			templateSessionData.getPatient_id());
	        	stmt.execute(query_patient);
	    		
	    	}			
			logger.info("createTemplateSession " + templateSessionData.getId()
				  + " ] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("createTemplateSession " + templateSessionData.getId()
				  + " ] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Insert a new template session into the DB with given data -------------------------## Falta gerir transação !!!!!			
	public String updateTemplateSession(Connection con, String currentCaregiverId,
			TemplateSessionData templateSessionData, String templateSessionId, List<TemplateSessionImage> imageList) throws SQLException { // não é neceesario reformular
		
		String result = null;		
		Statement stmt = null;
    	String query = String.format("UPDATE template_session SET "
		    				+ "total_images=%s, "
		    				+ "categories='%s', "
		    				+ "last_updated_date=now() "
		    				+ "WHERE id='%s' "
		    				+ "RETURNING id;",
		    				templateSessionData.getTotal_images(),
		    				templateSessionData.getCategories(),
		    				templateSessionId);
    	String queryDelete = String.format("DELETE FROM template_session_image "
				+ "WHERE template_session_id='%s' ",
				templateSessionId);
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			if (rs.next()) {
				result = rs.getString("id");
			}
			stmt.execute(queryDelete);
			for (int i=0; i < imageList.size(); i++) {
		    	String image_query = String.format("INSERT INTO template_session_image(template_session_id, "
		    			+ "image_id, "
						+ "position_image) "
						+ "VALUES('%s','%s', %s) RETURNING template_session_id;",
						result, imageList.get(i).getImage_id(), imageList.get(i).getPosition_image());
				stmt.execute(image_query);				
			}
			logger.info("updateTemplateSession " + templateSessionData.getId()
				  + " ] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("updateTemplateSession " + templateSessionData.getId()
				  + " ] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Removes a template session given its Id ---------------------------------------## Falta gerir transação !!!!!			
	public void removeTemplateSession(Connection con, String templateSessionId, String patientId)
			throws SQLException {
		
		Statement stmt = null;
		String query_ts_delete = String.format("DELETE FROM template_session "
				+ "WHERE id='%s';",
				templateSessionId);
		String query_tsp_delete = String.format("DELETE FROM access_control_list "          // "DELETE FROM template_session_patient "
				+ "WHERE record_id='%s' AND persona_id='%s'; ",                            // + "WHERE template_session_id='%s' AND patient_id='%s';",
				templateSessionId,
				patientId);
		String image_query = String.format("DELETE FROM template_session_image "
				+ "WHERE template_session_id='%s';",
				templateSessionId);
		String query_acl = String.format("DELETE FROM access_control_list "
				+ "WHERE record_id='%s';",
				templateSessionId);
		String query_tsp_count = String.format("SELECT count(*) AS count FROM access_control_list "     // template_session_patient "
				+ "WHERE record_id='%s' AND persona_type=2 ;",                                          // + "WHERE template_session_id='%s';",
				templateSessionId);		
		try {
			stmt = con.createStatement();
			if (patientId == null) {
				stmt.execute(image_query);
				stmt.execute(query_ts_delete);
				stmt.execute(query_acl);
			} else {
				stmt.execute(query_tsp_delete);
				ResultSet rs = stmt.executeQuery(query_tsp_count);
				int count=0;
				if (rs.next()) {
					count = rs.getInt("count");
				}
				if (count==0) {
					stmt.execute(image_query);
					stmt.execute(query_ts_delete);
					stmt.execute(query_acl);
				}
			}
			logger.info("removeTemplateSession with id: " + templateSessionId
				  + " returned 200");
		} catch (SQLException e) {
			logger.warning("removeTemplateSession in acl with id: " + templateSessionId
				  + " returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	private String calculateLimits(String count) {
		String lmts="";
		try {
			int i = Integer.parseInt(count);
			if (i==0) {
				lmts = "";
			} else {
				lmts = String.format("limit %s ", i);
			}
		} catch (NumberFormatException nfe) {
			lmts = "";
		}
		return lmts;
	}
	
	/**
	 * Retrieves all caregivers associated to the given 
	 * patient ID from the DB
	 */
	public List<TemplateSession> getTemplateSessionList(Connection con, String patientId,
			String currentCaregiverId, String filter, String count, String patients) throws SQLException { // ==================================== foi reformulado
		int currentImage;
		List<TemplateSession> result = new ArrayList<TemplateSession>();
		Statement stmt = null;
		boolean ongoing = filter.contains("ongoing");
		boolean tostart = filter.contains("tostart");
		boolean shared = filter.contains("shared");
		String sqlFilter="";
		
		if (ongoing && tostart) {
			sqlFilter="";
		} else if (ongoing) {
			sqlFilter = "AND sr.session_id IS NOT NULL ";
		} else if (tostart) {
			sqlFilter = "AND sr.session_id IS NULL ";
		}
		
		String sqlWhereClause;
		if (patientId.equals("any")) { // Invoked by the caregiver list
			sqlWhereClause = String.format(
					"WHERE (c.id='%s' "
					+ "OR ts.id IN (SELECT record_id FROM access_control_list WHERE persona_id = '%s')) ",
					currentCaregiverId, currentCaregiverId)
				+ sqlFilter
			 // + " AND (ts.patient_id IS NULL OR p.id IN (" + patients + ")) ";
				+ " AND ( p.id IS NULL OR p.id IN (" + patients + ") ) ";
			if (shared && ! tostart) {
				sqlWhereClause = sqlWhereClause + String.format(" AND NOT c.id = '%s' ", currentCaregiverId);
			}
		} else { // Invoked by the patient list
			sqlWhereClause = String.format("WHERE tsp.persona_id = '%s' ", patientId) + sqlFilter ; //+ " AND ";
		}
		String sqlLimits = calculateLimits(count);
		
		String query = String.format(
				"SELECT ts.id, "
				+ "c.id AS caregiver_id, "
				+ "c.name AS caregiver_name, "
				+ "ts.patient_id AS created_patient_id, "
				+ "p.id AS patient_id, "
				+ "p.name AS patient_name, "
				+ "p.display_name AS patient_display_name, "
				+ "ts.total_images, "
				+ "ts.categories, "
				+ "ts.created_date, "
				+ "ts.last_updated_date, "
				+ "sr.session_id, "
				+ "sr.current_image, "
				+ "s.start_session_date, "
				+ "s.duration "
				+ "FROM template_session ts "
				+ "LEFT JOIN access_control_list tsp ON (ts.id=tsp.record_id AND persona_type=2) " // + "LEFT JOIN template_session_patient tsp ON (ts.id=tsp.template_session_id) "
				+ "LEFT OUTER JOIN patient p ON tsp.persona_id = p.id "                            // tsp.patient_id = p.id "  // ############### era INNER JOIN Corrige para ter sessões sem pacientes
				+ "INNER JOIN caregiver c ON ts.caregiver_id = c.id "
				+ "LEFT OUTER JOIN session_running AS sr ON (ts.id = sr.template_session_id AND sr.caregiver_id = '%s') "
				+ "LEFT OUTER JOIN session AS s ON (sr.session_id = s.id) "
				+ sqlWhereClause
//				+ " OR ts.id in (SELECT record_id FROM access_control_list WHERE persona_id = '%s') "
				+ sqlLimits
				+ "ORDER BY start_session_date ASC, last_updated_date DESC",
				currentCaregiverId);
//				currentCaregiverId, currentCaregiverId);
		
		// logger.info("getTemplateSessionList >>>>>>>>> " + query);
		
		try {
			stmt = con.createStatement();
			logger.info(" >>>>>>LOG INFO TO DELETE >>>>>>>>>>> getTemplateSessionList SQL Query: " + query);
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				TemplateSession templateSession = new TemplateSession();
				templateSession.setId(rs.getString("id"));
				templateSession.setCaregiver_id(rs.getString("caregiver_id"));
				templateSession.setCaregiver_name(rs.getString("caregiver_name"));
				templateSession.setCreated_patient_id(rs.getString("created_patient_id"));
				templateSession.setPatient_id(rs.getString("patient_id"));
				if (rs.getString("patient_id") == null) {
					templateSession.setPatient_name(rs.getString("patient_name"));
				} else {
					if (rs.getString("patient_display_name").equals("")) {
						templateSession.setPatient_name(rs.getString("patient_name"));					
					} else {
						templateSession.setPatient_name(rs.getString("patient_display_name"));					
					}
				}
				templateSession.setTotal_images(rs.getInt("total_images"));
				templateSession.setCategories(rs.getString("categories"));
				templateSession.setCreated_date(rs.getDate("created_date"));
				templateSession.setLast_updated_date(rs.getDate("last_updated_date"));
				templateSession.setSession_id(rs.getString("session_id"));
				templateSession.setStart_session_date(rs.getDate("start_session_date"));
				templateSession.setDuration(rs.getTime("duration"));
				currentImage = rs.getInt("current_image");
				if (rs.wasNull()) {
					templateSession.setIsStarted(false);
					templateSession.setCurrent_image(0);
				} else {
					templateSession.setIsStarted(true);
					templateSession.setCurrent_image(rs.getInt("current_image"));
				}
				result.add(templateSession);
			}
			logger.info("getTemplateSessionList [patient_id: " + patientId
				  + ", caregiver_id: " + currentCaregiverId
				  + "] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getTemplateSessionList [patient_id: " + patientId
					+ ", caregiver_id: " + currentCaregiverId
					+ "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	public String createRunningSessionFromTemplateSession(Connection con, String templateSessionId, String caregiverId,
			String patientId, List<TemplateSessionImage> imageList) throws SQLException {
		
		String result = null;
		Statement stmt = null;
    	String queryTemplateSession = String.format("SELECT "
				+ "caregiver_id, "
				+ "patient_id, "
				+ "total_images "
				+ "FROM template_session "
				+ "WHERE id='%s';",
				templateSessionId);
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(queryTemplateSession);
			if (rs.next()) {
		    	String querySession = String.format("INSERT INTO "
						+ "session(caregiver_id, "
						+ "patient_id, "
						+ "start_session_date, "
						+ "session_finished, "
						+ "duration, "
						+ "total_images) "
						+ "VALUES('%s', '%s', now(), false, '00:00', %s) RETURNING id;",
						caregiverId,
						patientId,
						rs.getString("total_images"));
		    	ResultSet rss = stmt.executeQuery(querySession);
		    	if (rss.next()) {
					result = rss.getString("id");
					for (int i=0; i < imageList.size(); i++) {
				    	String image_query = String.format("INSERT INTO session_image(session_id,"
				    			+ "image_id, "
								+ "position_image) "
								+ "VALUES('%s','%s', %s);",
								result, imageList.get(i).getImage_id(), imageList.get(i).getPosition_image());
				    	stmt.execute(image_query);				
					}
			    	String querySessionRunning = String.format("INSERT INTO "
							+ "session_running(template_session_id, "
			    			+ "session_id, "
							+ "caregiver_id, "
							+ "patient_id, "
							+ "current_image) "
							+ "VALUES('%s', '%s', '%s', '%s', 1);",
							templateSessionId,
							result,
							caregiverId,
							patientId);
			    	stmt.execute(querySessionRunning);

					String acl_query = String.format("INSERT INTO access_control_list (record_id, persona_id, record_type, persona_type) "
							+ "VALUES ('%s','%s', 2, 1);",
							result, caregiverId);
					stmt.execute(acl_query);				
					
		    	}
			}
			logger.info("createRunningSessionFromTemplateSession with id: " + templateSessionId
				  + " ] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("createRunningSessionFromTemplateSession with id: " + templateSessionId
				  + " ] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//Retrieves from the DB all patients associated to a caregiver ID 
	public List<Patient> getCaregiverPatientsByTemplateSessionId(Connection con, String caregiverId, String templateSessionId) 
			throws SQLException {
		List<Patient> result = new ArrayList<Patient>();
		Statement stmt = null;
		String query = String.format("SELECT "
				+ "p.id, "
				+ "p.name, "
				+ "p.display_name, "
				+ "p.birth_date, "
				+ "p.education, "
				+ "p.is_active, "
				+ "(SELECT MAX(s.start_session_date) FROM session s WHERE s.patient_id = p.id) start_session_date, "
				+ "CASE WHEN tsp.record_id IS NULL THEN False ELSE true END AS alocated "                  // "CASE WHEN tsp.template_session_id IS NULL THEN False ELSE true END AS alocated "
				+ "FROM patient p "
				+ "JOIN caregiver_patient cp ON p.id = cp.patient_id "
				+ "LEFT JOIN access_control_list tsp ON (tsp.record_id = '%s' AND p.id = tsp.persona_id) " // + "LEFT JOIN template_session_patient tsp ON (tsp.template_session_id = '%s' AND p.id = tsp.patient_id) "
				+ "WHERE p.is_active = true "
				+ "AND cp.caregiver_id = '%s';", 
				templateSessionId, caregiverId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				Patient patient = new Patient();
				patient.setId(rs.getString("id"));
				patient.setName(rs.getString("name"));
				patient.setDisplayName(rs.getString("display_name"));
				patient.setBirthDate(rs.getDate("birth_date"));
				patient.setEducation(rs.getString("education"));
				patient.setProfileImageURL(
				fileStorageService.loadPatientProfileImage(rs.getString("id")+".jpeg"));
				patient.setIsActive(rs.getBoolean("alocated"));
				patient.setLastSession(rs.getDate("start_session_date"));
  				PatientChat chat =  new PatientChat();
  				patient.setChat(chat);
				result.add(patient);					
			}
			logger.info("getCaregiverPatientsByTemplateSessionId for templateSession [templateSession: " 
					  + templateSessionId + ", caregiver: " + caregiverId + "] returned 200: " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getCaregiverPatientsByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + ", caregiver: " + caregiverId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	//update the patient list of a selected templateSession 
	public String updateCaregiverPatientsByTemplateSessionId(Connection con, String templateSessionId, 
			String[] patientList) throws SQLException {

		Statement stmt = null;
		String queryDelete = String.format("DELETE FROM access_control_list acl "    // "DELETE FROM template_session_patient "
				+ "WHERE acl.record_id = '%s' AND persona_type=2 ;",                // + "WHERE template_session_patient.template_session_id = '%s';", 
				templateSessionId);

		String queryInsert = String.format("INSERT INTO access_control_list(" // "INSERT INTO template_session_patient("
				+ "record_id, " 	  								          // + "template_session_id, "
				+ "persona_id, "
				+ "record_type, "
				+ "persona_type) VALUES ('%s', ",                             // + "patient_id) VALUES ('%s', ",
				templateSessionId);

		try {
			stmt = con.createStatement();
			stmt.execute(queryDelete);
			for (int i=0 ; i<patientList.length ; i++) {
				String query = queryInsert + String.format("'%s', 1, 2);", patientList[i]); // String query = queryInsert + String.format("'%s');", patientList[i]);
				stmt.execute(query);	
			}
			logger.info("updateCaregiverPatientsByTemplateSessionId for templateSession [templateSession: " 
					  + templateSessionId + ", patientList: " + patientList + "] returned 200. ");
			return templateSessionId;
		} catch (SQLException e) {
			logger.warning("updateCaregiverPatientsByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + ", patientList: " + patientList + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}

	}
	
	//Retrieves from the DB all caregivers associated to a template session ID 
	public List<PatientCaregiver> getCaregiversByTemplateSessionId(Connection con, 
			String caregiverId, String templateSessionId, String patientId) throws SQLException {
		List<PatientCaregiver> result = new ArrayList<PatientCaregiver>();
		Statement stmt = null;
		String query = "";
		
		if (patientId.equals("any")) {
			query = String.format(
					"SELECT DISTINCT cp.caregiver_id, "
					+ "c.name, "
					+ "c.email, "
					+ "c.phone, "
					+ "c.birth_date, "
					+ "c.type, "
					+ "c.speciality, "
					+ "c.is_active, "
					+ "CASE WHEN acl.persona_id IS NULL THEN False ELSE true END AS shared "
					+ "FROM caregiver_patient cp "
					+ "INNER JOIN caregiver c ON c.id = cp.caregiver_id "
					+ "LEFT JOIN access_control_list acl ON acl.persona_id = cp.caregiver_id AND acl.record_id = '%s' ;",
					templateSessionId);
		} else {
			query = String.format(
					"SELECT cp.caregiver_id, "
					+ "cp.is_primary, "
					+ "cp.patient_relation, "
					+ "c.name, "
					+ "c.email, "
					+ "c.phone, "
					+ "c.birth_date, "
					+ "c.type, "
					+ "c.speciality, "
					+ "c.is_active, "
					+ "CASE WHEN acl.persona_id IS NULL THEN False ELSE true END AS shared "
					+ "FROM caregiver_patient cp "
					+ "INNER JOIN caregiver c ON c.id = cp.caregiver_id "
					+ "LEFT JOIN access_control_list acl ON acl.persona_id = cp.caregiver_id AND acl.record_id = '%s' "
					+ "WHERE cp.patient_id = '%s';",templateSessionId, patientId);
		}

		try {
			stmt = con.createStatement();
			logger.info(" >>>>>>LOG INFO TO DELETE >>>>>>>>>>> getCaregiversByTemplateSessionId SQL Query: " + query);
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				Caregiver caregiver = new Caregiver();
				caregiver.setId(rs.getString("caregiver_id"));
				caregiver.setName(rs.getString("name"));
				caregiver.setEmail(rs.getString("email"));
				caregiver.setPhone(rs.getString("phone"));
				caregiver.setBirthDate(rs.getDate("birth_date"));
				caregiver.setProfileImageURL(
				fileStorageService.loadCaregiverProfileImage(
						rs.getString("caregiver_id") + ".jpeg"));
				caregiver.setType(rs.getString("type"));
				caregiver.setSpeciality(rs.getString("speciality"));
				caregiver.setIsActive(rs.getBoolean("shared"));
				PatientCaregiver patientCaregiver = new PatientCaregiver();
				patientCaregiver.setCaregiver(caregiver);
				if (patientId.equals("any")) {
					patientCaregiver.setIsPrimary(false);
					patientCaregiver.setPatientRelation("");
				} else {
					patientCaregiver.setIsPrimary(rs.getBoolean("is_primary"));
					patientCaregiver.setPatientRelation(rs.getString("patient_relation"));
				}
				result.add(patientCaregiver);					
			}
			logger.info("getCaregiversByTemplateSessionId for templateSession [templateSession: " 
					  + templateSessionId + ", caregiver: " + caregiverId + "] returned 200: " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getCaregiversByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + ", caregiver: " + caregiverId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
	
	//update the patient list of a selected templateSession 
	public String updateCaregiversByTemplateSessionId(Connection con, String templateSessionId, 
			String[] caregiverList) throws SQLException {

		Statement stmt = null;
		String queryDelete = String.format("DELETE FROM access_control_list acl "
				+ "WHERE acl.record_id = '%s' AND persona_type=1 ;",
				templateSessionId);

		String queryInsert = String.format("INSERT INTO access_control_list("
				+ "record_id, "
				+ "persona_id, "
				+ "record_type, "
				+ "persona_type) VALUES ('%s', ",
				templateSessionId);

		try {
			stmt = con.createStatement();
			stmt.execute(queryDelete);
			for (int i=0 ; i<caregiverList.length ; i++) {
				String query = queryInsert + String.format("'%s', 1, 1);", caregiverList[i]);
				stmt.execute(query);	
			}
			logger.info("updateCaregiversByTemplateSessionId for templateSession [templateSession: " 
					  + templateSessionId + ", caregiverList: " + caregiverList + "] returned 200. ");
			return templateSessionId;
		} catch (SQLException e) {
			logger.warning("updateCaregiversByTemplateSessionId for templateSession [templateSession: " 
			          + templateSessionId + ", caregiverList: " + caregiverList + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}

	}

}
