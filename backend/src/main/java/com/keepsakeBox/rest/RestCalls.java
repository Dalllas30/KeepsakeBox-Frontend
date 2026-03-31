/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.rest;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.keepsakeBox.dto.*;

import clarifai2.api.ClarifaiBuilder;
import clarifai2.api.ClarifaiClient;
import clarifai2.api.request.model.PredictRequest;
import clarifai2.dto.input.ClarifaiInput;
import clarifai2.dto.model.Model;
import clarifai2.dto.model.output.ClarifaiOutput;
import clarifai2.dto.prediction.Concept;

public class RestCalls {

	//Class Logger
	Logger logger = Logger.getLogger(RestCalls.class.getName());
	
	//Clarifai and Rest Client
	private RestClient client;
	private final String token = "p6uw7jfylatxte9t341z";
	final ClarifaiClient clarifaiClient = new ClarifaiBuilder("3de01b7ebcec404eac15d2210d9b661d").buildSync();
	
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

	/**
	 * Using an api it gets the polarity of an image
	 * For test it uses 0 values.
	 */
	public ImagePolarity getImagePolarity(String imageURL) throws Exception {
		ImagePolarity imagePolarity = new ImagePolarity();

		try {
			/*
			 * String response = client.sendRest("http://localhost:9090/ws-intensitivity/",
			 * image, "get_images_intensitivity", token);
			 * 
			 * ObjectMapper mapper = new ObjectMapper(); body = mapper.readValue(response,
			 * ResponseIntensity.class);
			 */
			//TODO Example above
			
			//TEST Version
			imagePolarity.setNegativeIntensity(0.0);
			imagePolarity.setNeutralIntensity(0.0);
			imagePolarity.setPositiveIntensity(0.0);
			return imagePolarity;

		} catch (Exception e) {
			logger.warning("ERROR with getImagePolarity: " + e.toString());
			throw new Exception(e);
		}
	}

}