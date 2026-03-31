package com.keepsakeBox.dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.keepsakeBox.dto.Category;

public class CategoryDAO {
	
	//Class Logger
	Logger logger = Logger.getLogger(ImageDAO.class.getName());

	public List<Category> retrieveCategories(Connection con) throws SQLException {
		List<Category> result = new ArrayList<Category>();
		Statement stmt = null;
		String query = "SELECT id, name, image_number FROM category ORDER BY id";
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				Category cat = new Category();
				cat.setName(rs.getString("name"));
				cat.setImage_number(rs.getInt("image_number"));
				result.add(cat);
			}
			
			logger.info("retrieveCategories returned-> " + result.toString());
			return result;
			
		} catch (SQLException e) {
			logger.warning("retrieveCategories returned error: " 
			          + e.toString());
				throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	public List<String> retrieveCategoriesTranslations(Connection con) throws SQLException {
		List<String> result = new ArrayList<String>();
		Statement stmt = null;
		String query = "SELECT name, language, translation FROM category_translation ORDER BY name";
		try {
			String translation = "";
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				translation = rs.getString("name");
				translation = translation + ":" + rs.getString("language");
				translation = translation + ":" + rs.getString("translation");
				result.add(translation);
			}
			logger.info("retrieveCategoriesTranslations returned-> " + result.toString());
			return result;
			
		} catch (SQLException e) {
			logger.warning("retrieveCategoriesTranslations returned error: " 
			          + e.toString());
				throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

}
