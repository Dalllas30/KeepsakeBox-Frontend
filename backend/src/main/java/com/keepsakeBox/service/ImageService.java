/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 * @author Pedro Neves - fc46430
 */

package com.keepsakeBox.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.ws.http.HTTPException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.keepsakeBox.dao.*;
import com.keepsakeBox.dto.*;
import com.keepsakeBox.rest.RestCalls;

public class ImageService {

	private int parafazerdeoutraforma = 0;

	// Logger
	Logger logger = Logger.getLogger(ImageService.class.getName());

	// DAO (Data Access Objects)
	private ImageDAO imageDAO = new ImageDAO();
	private PatientDAO patientDAO = new PatientDAO();

	private SessionDAO sessionDAO = new SessionDAO();

	// Services
	private RestCalls restCalls = new RestCalls();
	private FileStorageService fileStorageService = new FileStorageService();

	// Database Connection
	private Connection con = connect();

	private Connection connect() {
		try {
			return DriverManager.getConnection("jdbc:postgresql://localhost:5432/", "postgres", "postgres");
		} catch (SQLException e) {
			logger.warning("Could not connect to Database.");
			throw new InternalServerErrorException(e.toString());
		}
	}

	// Retrives a thumbnail using an imageId
	public Thumbnail getThumbnail(String imageId) {
		try {
			Thumbnail thumbnail = imageDAO.getThumbnail(con, imageId);
			logger.info("getThumbnail for image with [id: " + imageId + "] returned 200.");
			return thumbnail;
		} catch (HTTPException e) {
			logger.warning("getThumbnail for image with [id: " + imageId + "] responded 401.");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getThumbnail for image with [id: " + imageId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	// Retrieves an array of images to validate by caregiver Id without token
	public ImageToValidate[] getImagesToValidateByCaregiverId(String caregiverId) {
		try {
			ImageToValidate[] images = imageDAO.getImagesToValidateByCaregiverId(con, caregiverId);
			logger.info("getImagesToValidateByCaregiverId for caregiver [id: " + caregiverId + "] returned 200.");
			return images;
		} catch (HTTPException e) {
			logger.warning("getImagesToValidateByCaregiverId for caregiver [id: " + caregiverId + "] responded 401.");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getImagesToValidateByCaregiverId for caregiver [id: " + caregiverId
					+ "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Inserts a new patient personal app image into the application for the patient
	 * with given ID
	 */
	public String sendImageToValidate(ImageToValidate imageToValidate) {
		try {
			// Define all variables for request
			String imagePath = "uploads/caregiver/validation/" + imageToValidate.getCaregiverID();

			// Request to the database
			String imageToValidateId = this.imageDAO.sendImageToValidate(con, imageToValidate, imagePath);

			// Insert Image into uploads folder
			this.fileStorageService.uploadImageToValidate(imageToValidate.getImagePath(), imagePath,
					imageToValidateId + ".jpeg");

			logger.info(
					"sendImageToValidate for caregiver [id: " + imageToValidate.getCaregiverID() + "] responded 200: ");
			return imageToValidateId;
		} catch (HTTPException e) {
			logger.warning(
					"sendImageToValidate for caregiver [id: " + imageToValidate.getCaregiverID() + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("sendImageToValidate for caregiver [id: " + imageToValidate.getCaregiverID()
					+ "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Inserts a new patient personal app image into the application for the patient
	 * with given ID
	 */
	public void addPatientPersonalImage(List<LoggedSession> loggedSessions, String token, String patientId,
			AddImageData addImageData) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {

				// Define all variables for request
				ImagePolarity imagePolarity = this.restCalls.getImagePolarity(addImageData.getImageURL());
				String imagePath = "uploads/patient/" + patientId;
				String thumbnailPath = "uploads/patient/" + patientId + "/thumbnails";

				// Request to the database
				String imageId = this.imageDAO.insertPersonalImage(con, addImageData, imagePolarity, imagePath);
				String thumbnailId = this.imageDAO.insertPersonalThumbnail(con, imageId, thumbnailPath);

				// Insert Image into uploads folder
				this.fileStorageService.uploadPatientAppImage(addImageData.getImageURL(), imagePath, imageId + ".jpeg");

				// Insert thumbnail into thumbnail folder
				this.fileStorageService.uploadPatientAppImage(addImageData.getImageURL(), thumbnailPath,
						thumbnailId + ".jpeg");

				// Creates the connection Personal Image between Patient and Image
				Patient patient = patientDAO.getPatientById(con, patientId, actual.getCaregiverID());
				imageDAO.associatePatientToImage(con, patient.getId(), imageId, addImageData.getIsFavorite());

				// Creates the connection Personal Thumbnail between Patient and Thumbnail
				imageDAO.associatePatientToImage(con, patient.getId(), thumbnailId, addImageData.getIsFavorite());

				logger.info("addPatientPersonalImage for patient [id: " + patientId + "] responded 200: ");

			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("addPatientPersonalImage for patient [id: " + patientId + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning(
					"addPatientPersonalImage for patient [id: " + patientId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Inserts a new caregiver personal app image into the application for the
	 * caregiver with given token
	 */
	public void addCaregiverPersonalImage(List<LoggedSession> loggedSessions, String token, AddImageData addImageData) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {

				// Define all variables for request
				ImagePolarity imagePolarity = this.restCalls.getImagePolarity(addImageData.getImageURL());
				String imagePath = "uploads/caregiver/" + actual.getCaregiverID();
				String thumbnailPath = "uploads/caregiver/" + actual.getCaregiverID() + "/thumbnails";

				// Request to the database
				String imageId = this.imageDAO.insertPersonalImage(con, addImageData, imagePolarity, imagePath);
				String thumbnailId = this.imageDAO.insertPersonalThumbnail(con, imageId, thumbnailPath);

				// Insert Image into uploads folder
				this.fileStorageService.uploadCaregiverAppImage(addImageData.getImageURL(), imagePath,
						imageId + ".jpeg");

				// Insert thumbnail into thumbnail folder
				this.fileStorageService.uploadCaregiverAppImage(addImageData.getImageURL(), thumbnailPath,
						thumbnailId + ".jpeg");

				// Creates the connection Personal Image between Caregiver and Image
				imageDAO.associateCaregiverToImage(con, actual.getCaregiverID(), imageId, addImageData.getIsFavorite());

				// Creates the connection Personal Thumbnail between Caregiver and Thumbnail
				// imageDAO.associateCaregiverToThumbnail(con, actual.getCaregiverID(),
				// thumbnailId,
				// addImageData.getIsFavorite());

				logger.info("addCaregiverPersonalImage for caregiver [id: " + actual.getCaregiverID()
						+ "] responded 200: ");

			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning(
					"addCaregiverPersonalImage for caregiver [id: " + actual.getCaregiverID() + "] responded 401: ");
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("addCaregiverPersonalImage for caregiver [id: " + actual.getCaregiverID()
					+ "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Retrieves all patient personal app images associated to the patient with
	 * given ID
	 */
	public PersonalImageList getPatientPersonalImages(List<LoggedSession> loggedSessions, String token,
			String patientId) {
		PersonalImageList result = new PersonalImageList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				Patient patient = patientDAO.getPatientById(con, patientId, actual.getCaregiverID());
				result.setImages(imageDAO.getPatientPersonalImagesByPatientId(con, patient.getId()));
				logger.info("getPatientImages for patient [id: " + patientId + "] responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getPatientImages for patient [id: " + patientId + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getPatientImages for patient [id: " + patientId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Retrieves all caregiver personal app images associated to the caregiver with
	 * given token
	 */
	public PersonalImageList getCaregiverPersonalImages(List<LoggedSession> loggedSessions, String token) {
		PersonalImageList result = new PersonalImageList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setImages(imageDAO.getCaregiverPersonalImagesByCaregiverId(con, actual.getCaregiverID()));
				logger.info("getCaregiverPersonalImages for caregiver [id: " + actual.getCaregiverID()
						+ "] responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getCaregiverPersonalImages for caregiver [id: " + actual.getCaregiverID()
					+ "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getCaregiverPersonalImages for caregiver [id: " + actual.getCaregiverID()
					+ "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Retrieves all images available for a session creation
	 */
	public PersonalImageList getImagesByCategory(List<LoggedSession> loggedSessions, String token,
			ImagesFilterData imagesFilters) {
		PersonalImageList result = new PersonalImageList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setImages(imageDAO.getImagesByCategory(con, actual.getCaregiverID(), imagesFilters));
				logger.info("getImagesByCategory for caregiver [id: " + actual.getCaregiverID() + " for category: "
						+ imagesFilters.getCategory() + "] responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getImagesByCategory for caregiver [id: " + actual.getCaregiverID() + " for category: "
					+ imagesFilters.getCategory() + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getImagesByCategory for caregiver [id: " + actual.getCaregiverID() + " for category: "
					+ imagesFilters.getCategory() + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Updates a patient personal app image with given image data and given patient
	 * ID
	 */
	public void updatePatientPersonalImage(List<LoggedSession> loggedSessions, String token, String patientId,
			PersonalImage personalImage) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				imageDAO.updateImageById(con, personalImage.getImage());
				imageDAO.updatePatientImageByIds(con, patientId, personalImage.getImage().getId(),
						personalImage.getIsFavorite());
				logger.info("updatePatientImage with patient [id: " + patientId + "] and image [id: "
						+ personalImage.getImage().getId() + "] responded 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("updatePatientImage with patient [id: " + patientId + "] and image [id: "
					+ personalImage.getImage().getId() + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("updatePatientImage with patient [id: " + patientId + "] and image [id: "
					+ personalImage.getImage().getId() + "] responded 500 with:" + e.toString());
			throw new InternalServerErrorException(e.toString());
		}

	}

	/**
	 * Updates a caregiver personal app image with given image data and given
	 * caregiver token
	 */
	public void updateCaregiverPersonalImage(List<LoggedSession> loggedSessions, String token,
			PersonalImage personalImage) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				imageDAO.updateImageById(con, personalImage.getImage());
				imageDAO.updateCaregiverImageByIds(con, actual.getCaregiverID(), personalImage.getImage().getId(),
						personalImage.getIsFavorite());
				logger.info("updateCaregiverPersonalImage with caregiver [id: " + actual.getCaregiverID()
						+ "] and image [id: " + personalImage.getImage().getId() + "] responded 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("updateCaregiverPersonalImage with caregiver [id: " + actual.getCaregiverID()
					+ "] and image [id: " + personalImage.getImage().getId() + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("updateCaregiverPersonalImage with caregiver [id: " + actual.getCaregiverID()
					+ "] and image [id: " + personalImage.getImage().getId() + "] responded 500 with:" + e.toString());
			throw new InternalServerErrorException(e.toString());
		}

	}

	// Gets a patient personal app image given patient and image IDs
	public PersonalImage getPatientPersonalImage(List<LoggedSession> loggedSessions, String token, String patientId,
			String imageId) {
		PersonalImage result = null;
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result = imageDAO.getPatientPersonalImageByIds(con, patientId, imageId);
				logger.info("getPatientPersonalImage with patient [id: " + patientId + "] and image [id: " + imageId
						+ "] responded 200");
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getPatientPersonalImage with patient [id: " + patientId + "] and image [id: " + imageId
					+ "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getPatientPersonalImage with patient [id: " + patientId + "] and image [id: " + imageId
					+ "] responded 500 with:" + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	// Gets a patient personal image given patient #Testes-Pedro
	// ===============================================
	public RtSessionImage getRunningRtSessionImage(List<LoggedSession> loggedSessions, String token, String sessionId,
			String direction) {
		RtSessionImage result = null;
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result = imageDAO.getRunningRtSessionImage(con, sessionId, direction);
				logger.info("getRunningRtSessionImage for session [id: " + sessionId + "] responded 200:"
						+ result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning(
					"getRunningRtSessionImage for session [id: " + sessionId + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning(
					"getRunningRtSessionImage for session [id: " + sessionId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	public void updateRunningRtSessionImageFeedback(List<LoggedSession> loggedSessions, String token,
			RtSessionImage rtSessionImage) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				imageDAO.updateRunningRtSessionImageFeedback(con, rtSessionImage);
				logger.info("updateRunningRtSessionImageFeedback [id: " + "[id:" + rtSessionImage.getId()
						+ " AND image_position:" + rtSessionImage.getCurrent_image() + "] returned 200.");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("updateRunningRtSessionImageFeedback [id: " + "[id:" + rtSessionImage.getId()
					+ " AND image_possition:" + rtSessionImage.getCurrent_image() + "] responded 401: " + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("updateRunningRtSessionImageFeedback [id: " + "[id:" + rtSessionImage.getId()
					+ " AND image_possition:" + rtSessionImage.getCurrent_image() + "] responded 500 with: "
					+ e.toString());
			throw new InternalServerErrorException(e.toString());
		}

	}

	// Gets a patient personal image given patient #Testes-Pedro
	// ===============================================
	public PersonalImageList getSessionPatientPersonalImage(List<LoggedSession> loggedSessions, String token,
			String patientId, String direction) {
		List<PersonalImage> buffer = new ArrayList<PersonalImage>();
		List<PersonalImage> SelectedImage = new ArrayList<PersonalImage>();
		PersonalImageList result = new PersonalImageList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				Patient patient = patientDAO.getPatientById(con, patientId, actual.getCaregiverID());
				// if (buffer == null) {
				buffer = imageDAO.getPatientPersonalImagesByPatientId(con, patient.getId());
				if (direction.equals("0")) {
					SelectedImage.add(buffer.get(parafazerdeoutraforma));
				} else if (direction.equals("1")) {
					if (parafazerdeoutraforma < buffer.size() - 1) {
						SelectedImage.add(buffer.get(++parafazerdeoutraforma));
					} else {
						SelectedImage.add(buffer.get(parafazerdeoutraforma));
					}
				} else if (direction.equals("-1")) {
					if (parafazerdeoutraforma > 0) {
						SelectedImage.add(buffer.get(--parafazerdeoutraforma));
					} else {
						SelectedImage.add(buffer.get(parafazerdeoutraforma));
					}

				}
				// }
				result.setImages(SelectedImage);
				logger.info("getPatientImages for patient [id: " + patientId + "] responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getPatientImages for patient [id: " + patientId + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getPatientImages for patient [id: " + patientId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	// Get defaut session from System using all photos from a patient
	public PersonalImage getSessionPatientPersonalImageBis(List<LoggedSession> loggedSessions, String token,
			String patientId, String imageId) {
		PersonalImage result = null;
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result = imageDAO.getPatientPersonalImageByIds(con, patientId, imageId);
				logger.info("getPatientPersonalImage with patient [id: " + patientId + "] and image [id: " + imageId
						+ "] responded 200");
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getSessionPatientPersonalImage with patient [id: " + patientId + "] and image [id: "
					+ imageId + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getSessionPatientPersonalImage with patient [id: " + patientId + "] and image [id: "
					+ imageId + "] responded 500 with:" + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	// Gets a caregiver personal app image given caregiver and image IDs
	public PersonalImage getCaregiverPersonalImage(List<LoggedSession> loggedSessions, String token, String imageId) {
		PersonalImage result = null;
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result = imageDAO.getCaregiverPersonalImageByIds(con, actual.getCaregiverID(), imageId);
				logger.info("getCaregiverPersonalImage with caregiver [id: " + actual.getCaregiverID()
						+ "] and image [id: " + imageId + "] responded 200");
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getCaregiverPersonalImage with caregiver [id: " + actual.getCaregiverID()
					+ "] and image [id: " + imageId + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getCaregiverPersonalImage with caregiver [id: " + actual.getCaregiverID()
					+ "] and image [id: " + imageId + "] responded 500 with:" + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Deletes a patient personal app image with given patient ID and image ID
	 */
	public void deletePatientPersonalImage(List<LoggedSession> loggedSessions, String token, String patientId,
			String imageId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				imageDAO.deletePatientPersonalImageConnection(con, patientId, imageId);
				logger.info("deletePatientPersonalImage with patient [id: " + patientId + "] and image [id: " + imageId
						+ "] responded 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("deletePatientPersonalImage with patient [id: " + patientId + "] and image [id: " + imageId
					+ "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("deletePatientPersonalImage with patient [id: " + patientId + "] and image [id: " + imageId
					+ "] responded 500 with:" + e.toString());
			throw new InternalServerErrorException(e.toString());
		}

	}

	/**
	 * Deletes a caregiver personal app image with given caregiver token and image
	 * ID
	 */
	public void deleteCaregiverPersonalImage(List<LoggedSession> loggedSessions, String token, String imageId) {
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				imageDAO.deleteCaregiverPersonalImageConnection(con, actual.getCaregiverID(), imageId);
				logger.info("deleteCaregiverPersonalImage with caregiver [id: " + actual.getCaregiverID()
						+ "] and image [id: " + imageId + "] responded 200");
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("deleteCaregiverPersonalImage with caregiver [id: " + actual.getCaregiverID()
					+ "] and image [id: " + imageId + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("deleteCaregiverPersonalImage with caregiver [id: " + actual.getCaregiverID()
					+ "] and image [id: " + imageId + "] responded 500 with:" + e.toString());
			throw new InternalServerErrorException(e.toString());
		}

	}

	public RtSessionImageList getSessionPatientImageInformation(List<LoggedSession> loggedSessions, String token,
			String sessionId) {
		RtSessionImageList result = new RtSessionImageList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				// Session session = sessionDAO.getSessionListByPatient()
				/*
				 * Patient patient = patientDAO .getPatientById(con, patientId,
				 * actual.getCaregiverID());
				 */
				result.setImages(imageDAO.getImagesSession(con, sessionId));
				logger.info("getPatientImages for patient [id: " + sessionId + "] responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getPatientImages for patient [id: " + sessionId + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getPatientImages for patient [id: " + sessionId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Select random images available for a session creation
	 */
	public RtSessionCreateDataList selectImages4TemplateSession(List<LoggedSession> loggedSessions, String token,
			TemplateSessionData templateSessionData) {
		RtSessionCreateDataList result = new RtSessionCreateDataList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				String category = "";
				String quantity;

				for (int i = 0; i < templateSessionData.getTotal_images(); i++) {
					String info = templateSessionData.getImage_list()[i];
					int twopoints = info.indexOf(':');
					if (twopoints > 0) {
						category = info.substring(0, twopoints);
						quantity = info.substring(twopoints + 1, info.length());
						result.addRtSessionCreateData(imageDAO.selectImagesByCategory(con, actual.getCaregiverID(),
								templateSessionData.getPatient_id(), category, quantity, result));

					}
					logger.info("selectImages4TemplateSession for caregiver [id: " + actual.getCaregiverID()
							+ " for categories: " + templateSessionData.getImage_list() + "] responded 200:"
							+ result.toString());
				}
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("selectImages4TemplateSession for caregiver [id: " + actual.getCaregiverID()
					+ " for categories: " + templateSessionData.getImage_list() + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning(
					"selectImages4TemplateSession for caregiver [id: " + actual.getCaregiverID() + " for categories: "
							+ templateSessionData.getImage_list() + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Retrieves all images available for an existing template session
	 */
	public PersonalImageList getImagesByTemplateSessionId(List<LoggedSession> loggedSessions, String token,
			String templateSessionId) {
		PersonalImageList result = new PersonalImageList();
		LoggedSession actual = new LoggedSession(null, null, null);
		for (int i = 0; i < loggedSessions.size(); i++) {
			if (loggedSessions.get(i).getToken().equals(token)) {
				actual = loggedSessions.get(i);
				break;
			}
		}
		try {
			if (actual.getToken() != null && !actual.getToken().isEmpty()) {
				result.setImages(
						imageDAO.getImagesByTemplateSessionId(con, actual.getCaregiverID(), templateSessionId));
				logger.info("getImagesByTemplateSessionId for template session [id: " + actual.getCaregiverID()
						+ " for template session: " + templateSessionId + "] responded 200:" + result.toString());
				return result;
			} else {
				throw new HTTPException(HttpStatus.UNAUTHORIZED.value());
			}
		} catch (HTTPException e) {
			logger.warning("getImagesByTemplateSessionId for template session [id: " + actual.getCaregiverID()
					+ " for template session: " + templateSessionId + "] responded 401:" + e.toString());
			throw new UnauthorizedException("user or password incorrect");
		} catch (Exception e) {
			logger.warning("getImagesByTemplateSessionId for template session [id: " + actual.getCaregiverID()
					+ " for template session: " + templateSessionId + "] responded 500 with: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

}
