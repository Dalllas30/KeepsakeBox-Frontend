/**
 * V3
 * @author Pedro Neves - fc46430
 */


package com.keepsakeBox.dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.keepsakeBox.dto.TemplateSessionImage;

public class TemplateSessionImageDAO {
	
	//Class Logger
	Logger logger = Logger.getLogger(TemplateSessionImageDAO.class.getName());

	//Retrieves from the DB all images from the template session with given ID
	public List<TemplateSessionImage> getTemplateSessionImagesByTemplateSessionId(
			Connection con, String templateSessionId) throws SQLException {
		List<TemplateSessionImage> result = new ArrayList<TemplateSessionImage>();
		Statement stmt = null;
		String query = String.format(
				"SELECT template_session_id, "
				+ "image_id, "
				+ "position_image "
				+ "FROM template_session_image "
				+ "WHERE template_session_id = '%s';",templateSessionId);
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				//Image
				TemplateSessionImage tsi = new TemplateSessionImage();
				tsi.setTemplate_session_id(rs.getString("template_session_id"));
				tsi.setImage_id(rs.getString("image_id"));
				tsi.setPosition_image(rs.getInt("position_image"));
				result.add(tsi);
			}
			logger.info("getTemplateSessionImagesByTemplateSessionId from TemplateSessionId "
				  + "[id:" + templateSessionId + "] returned-> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getTemplateSessionImagesByTemplateSessionId from TemplateSessionId "
				  + "[id:" + templateSessionId + "] returned error: " 
		          + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	

}
