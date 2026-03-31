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

import com.keepsakeBox.dto.*;

public class TagDAO {
	
	//Logger
	Logger logger = Logger.getLogger(TagDAO.class.getName());
	
	//Retrieves patient Tags from DB with given patient ID
	public List<PatientTag> getTagsByPatientID(Connection con, 
			String patientId) throws SQLException {
		List<PatientTag> tags = new ArrayList<PatientTag>();
		Statement stmt = null;
		String query = String.format(
				"SELECT t.tag_id, "
				+ "t.nr_negative, "
				+ "t.nr_neutral, "
				+ "t.nr_positive "
				+ "FROM patient_tag t "
				+ "WHERE t.patient_id = '%s';",patientId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				PatientTag tag = new PatientTag();
				tag.setTagId(rs.getString("tag_id"));
				tag.setNrNegative(rs.getInt("nr_negative"));
				tag.setNrNeutral(rs.getInt("nr_neutral"));
				tag.setNrPositive(rs.getInt("nr_positive"));
				tags.add(tag);
			}
			logger.info("returned tags for patient [id: " 
			      + patientId + "] -> " + tags.toString());
			return tags;
		} catch (SQLException e) {
			logger.warning("returning tags for patient [id: " 
		          + patientId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

}
