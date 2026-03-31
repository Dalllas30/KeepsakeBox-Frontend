package com.keepsakeBox.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.ws.http.HTTPException;

import org.springframework.http.HttpStatus;

import com.keepsakeBox.dao.*;
import com.keepsakeBox.dto.*;
import com.keepsakeBox.rest.RestCalls;

public class CategoryService {
	
	//Logger
	Logger logger = Logger.getLogger(ImageService.class.getName());
		
	private CategoryDAO categoryDAO = new CategoryDAO();
	
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

	public CategoryList retrieveCategories(List<LoggedSession> loggedSessions, String token) {
		CategoryList result = new CategoryList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				
				result.setCategories(categoryDAO
						.retrieveCategories(con));
				
				logger.info("retrieveCategories responded 200: ");
				return result;

			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("retrieveCategories responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("retrieveCategories responded 500 with: " 
				  + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}
		
	public CategoryTranslation retrieveCategoriesTranslations(List<LoggedSession> loggedSessions, String token) {
		CategoryTranslation result = new CategoryTranslation();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				
				result.setCategories(categoryDAO
						.retrieveCategoriesTranslations(con));
				
				logger.info("retrieveCategoriesTranslations responded 200: ");
				return result;

			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("retrieveCategoriesTranslations responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("retrieveCategoriesTranslations responded 500 with: " 
				  + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

}
