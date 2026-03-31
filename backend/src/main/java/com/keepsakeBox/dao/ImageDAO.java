/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451

 * @author Pedro Neves - fc46430
*/

package com.keepsakeBox.dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

import javax.xml.ws.http.HTTPException;

import org.springframework.http.HttpStatus;

import com.keepsakeBox.dto.*;
import com.keepsakeBox.service.FileStorageService;

import java.util.Random;

public class ImageDAO {

	// Class Logger
	Logger logger = Logger.getLogger(ImageDAO.class.getName());

	// DAO (Data Access Objects)
	private CaregiverDAO caregiverDAO = new CaregiverDAO();

	// Services
	private FileStorageService fileStorageService = new FileStorageService();

	// Retrieves a thumbnail of an image with a given imageId
	public Thumbnail getThumbnail(Connection con, String imageId) throws SQLException {
		Thumbnail result = new Thumbnail();
		Statement stmt = null;
		String query = String.format("SELECT id, image_id, image_path FROM thumbnail WHERE image_id = '%s'", imageId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result.setId(rs.getString("id"));
				result.setImageId(rs.getString("image_id"));
				//result.setImagePath(rs.getString("image_path"));
				result.setImagePath(fileStorageService.loadApplicationImage(rs.getString("image_path"),
                        rs.getString("id") + ".jpeg"));
			}
			logger.info("getThumbnail for image with [id: " + imageId + "] returned -> " + result);
			return result;
		} catch (SQLException e) {
			logger.warning("getThumbnail for image with " + " [id: " + imageId + "] returned error: "
					+ e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB the images to validate from caregiverid without token
	public ImageToValidate[] getImagesToValidateByCaregiverId(Connection con, String caregiverId) throws SQLException {
		List<ImageToValidate> result = new ArrayList<ImageToValidate>();
		Statement stmt = null;
		String query = String.format(
				"SELECT id, target_id, category, " + "description, image_path, submission_date, username, is_private "
						+ "FROM image_to_validate WHERE caregiver_id = '%s';",
				caregiverId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				ImageToValidate image = new ImageToValidate();
				image.setId(rs.getString("id"));
				image.setCaregiverID(caregiverId);
				image.setTargetID(rs.getString("target_id"));
				image.setCategory(rs.getString("category"));
				image.setSubmissionDate(rs.getString("submission_date"));
				image.setImagePath(fileStorageService.loadApplicationImage(rs.getString("image_path"),
						rs.getString("id") + ".jpeg"));
				// image.setImageURL(fileStorageService.loadApplicationImage(rs.getString("image_path"),
				// rs.getString("id") + ".jpeg"));
				image.setDescription(rs.getString("description"));
				image.setUsername(rs.getString("username"));
				image.setIsPrivate(rs.getBoolean("is_private"));
				result.add(image);
			}
			logger.info("getCaregiverOutsidetById with caregiver " + "[id: " + caregiverId + "] returned -> " + result);
			ImageToValidate[] array = new ImageToValidate[result.size()];
			int i = 0;
			for (ImageToValidate image : result) {
				array[i] = image;
				i++;
			}
			;
			return array;
		} catch (SQLException e) {
			logger.warning("getCaregiverOutsidetById with caregiver " + "[id: " + caregiverId + "] returned error: "
					+ e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Inserts a new image for validation
	public String sendImageToValidate(Connection con, ImageToValidate imageToValidate, String imagePath)
			throws SQLException {
		String result = null;
		Statement stmt = null;
		logger.info(imageToValidate.getCaregiverID());
		String query = String.format(
				"INSERT INTO image_to_validate (caregiver_id, target_id, " + "category, description, image_path, "
						+ "submission_date, username, is_private) "
						+ "VALUES('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%b')" + " RETURNING id;",
				imageToValidate.getCaregiverID(), imageToValidate.getTargetID(), imageToValidate.getCategory(),
				imageToValidate.getDescription(), imagePath, imageToValidate.getSubmissionDate(),
				imageToValidate.getUsername(), imageToValidate.getIsPrivate());

		try {
			stmt = con.createStatement();
			// stmt.executeQuery(query);
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result = rs.getString("id");
			}
			logger.info("insertImageToValidate with " + "[description:" + imageToValidate.getDescription()
					+ "] returned -> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("insertImageToValidate with " + "[description:" + imageToValidate.getDescription()
					+ "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Inserts a new personal image into the DB
	public String insertPersonalImage(Connection con, AddImageData addImageData, ImagePolarity imagePolarity,
			String imagePath) throws SQLException {
		String result = null;
		Statement stmt = null;
		String query = String.format(
				"INSERT INTO image (created_by_id, category, " + "description, is_private, image_path, "
						+ "negative_intensity, neutral_intensity, positive_intensity, "
						+ "created_date, last_updated_date) "
						+ "VALUES('%s', '%s', '%s', '%b', '%s', '%f', '%f', '%f', " + "now(), now()) RETURNING id;",
				addImageData.getCreatedById(), addImageData.getCategory(),
				imagePath.contains("thumbnails") ? addImageData.getDescription() + "/$thumbnail"
						: addImageData.getDescription(),
				addImageData.getIsPrivate(), imagePath, imagePolarity.getNegativeIntensity(),
				imagePolarity.getNeutralIntensity(), imagePolarity.getPositiveIntensity());

		try {
			stmt = con.createStatement();
			// stmt.executeQuery(query);
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result = rs.getString("id");
			}
			logger.info("insertPersonalImage with " + "[description:" + addImageData.getDescription() + "] returned -> "
					+ result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("insertPersonalImage with " + "[description:" + addImageData.getDescription()
					+ "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Inserts a new personal thumbnail into the DB
	public String insertPersonalThumbnail(Connection con, String imageId, String imagePath) throws SQLException {
		String result = null;
		Statement stmt = null;
		String query = String.format("INSERT INTO thumbnail (image_id, image_path) VALUES('%s', '%s') RETURNING id;",
				imageId, imagePath);
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				result = rs.getString("id");
			}
			logger.info("insertPersonalThumbnail for image with " + "[id:" + imageId + "] returned -> "
					+ result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning(
					"insertPersonalThumbnail for image with " + "[id:" + imageId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Creates an association on the DB from a patient to an image
	public void associatePatientToImage(Connection con, String patientId, String imageId, boolean isFavorite)
			throws SQLException {
		Statement stmt = null;
		String query = String.format("INSERT INTO patient_personal_image " + "(patient_id, image_id, is_favorite) "
				+ "VALUES('%s','%s','%b') RETURNING patient_id;", patientId, imageId, isFavorite);
		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("associatePatientToImage with patient " + "[id: " + patientId + "] and image " + "[id: "
					+ imageId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("associatePatientToImage with patient " + "[id: " + patientId + "] and image " + "[id:"
					+ imageId + "]  returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}

	}

	// Creates an association on the DB from a caregiver to an image
	public void associateCaregiverToImage(Connection con, String caregiverId, String imageId, boolean isFavorite)
			throws SQLException {
		Statement stmt = null;
		String query = String.format("INSERT INTO caregiver_personal_image " + "(caregiver_id, image_id, is_favorite) "
				+ "VALUES('%s','%s','%b') RETURNING caregiver_id;", caregiverId, imageId, isFavorite);
		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("associateCaregiverToImage with caregiver " + "[id: " + caregiverId + "] and image " + "[id: "
					+ imageId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("associateCaregiverToImage with caregiver " + "[id: " + caregiverId + "] and image " + "[id:"
					+ imageId + "]  returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}

	}

	// Creates an association on the DB from a caregiver to an thumbnail
	public void associateCaregiverToThumbnail(Connection con, String caregiverId, String imageId, boolean isFavorite)
			throws SQLException {
		Statement stmt = null;
		String query = String.format("INSERT INTO caregiver_personal_image " + "(caregiver_id, image_id, is_favorite) "
				+ "VALUES('%s','%s','%b') RETURNING caregiver_id;", caregiverId, imageId, isFavorite);
		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("associateCaregiverToImage with caregiver " + "[id: " + caregiverId + "] and image " + "[id: "
					+ imageId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("associateCaregiverToImage with caregiver " + "[id: " + caregiverId + "] and image " + "[id:"
					+ imageId + "]  returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}

	}

	// Retrieves from the DB a personal image from the patient with given ID
	public PersonalImage getPatientPersonalImageByIds(Connection con, String patientId, String imageId)
			throws SQLException {
		PersonalImage result = new PersonalImage();
		Statement stmt = null;
		String query = String.format(
				"SELECT image.created_by_id, " + "image.category, " + "image.description, " + "image.is_personal, "
						+ "image.is_private, " + "image.image_path, " + "image.negative_intensity, "
						+ "image.neutral_intensity, " + "image.positive_intensity, " + "image.created_date, "
						+ "image.last_updated_date, " + "patient_personal_image.is_favorite "
						+ "FROM patient_personal_image join image " + "on patient_personal_image.image_id = image.id "
						+ "WHERE patient_personal_image.patient_id = '%s' " + "AND image.id = '%s';",
				patientId, imageId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {

				// Image
				Image image = new Image();
				image.setId(imageId);
				image.setCreatedById(rs.getString("created_by_id"));
				image.setCreatedBy(caregiverDAO.getSimpleCaregiverById(con, rs.getString("created_by_id")));
				image.setCategory(rs.getString("category"));
				image.setDescription(rs.getString("description"));
				image.setIsPersonal(rs.getBoolean("is_personal"));
				image.setIsPrivate(rs.getBoolean("is_private"));
				image.setImageURL(
						fileStorageService.loadApplicationImage(rs.getString("image_path"), imageId + ".jpeg"));
				image.setNegativeIntensity(rs.getDouble("negative_intensity"));
				image.setNeutralIntensity(rs.getDouble("neutral_intensity"));
				image.setPositiveIntensity(rs.getDouble("positive_intensity"));
				image.setCreatedDate(rs.getDate("created_date"));
				image.setLastUpdatedDate(rs.getDate("last_updated_date"));

				// Personal Image
				result.setImage(image);
				result.setIsFavorite(rs.getBoolean("is_favorite"));
			}
			logger.info("getPatientPersonalImageByIds with patient " + "[id:" + patientId + "] and image " + "[id: "
					+ imageId + " returned-> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getPatientPersonalImageByIds from patient " + "[id:" + patientId + "] and image " + "[id: "
					+ imageId + " returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB a personal image from the caregiver with given ID
	public PersonalImage getCaregiverPersonalImageByIds(Connection con, String caregiverId, String imageId)
			throws SQLException {
		PersonalImage result = new PersonalImage();
		Statement stmt = null;
		String query = String.format("SELECT image.created_by_id, " + "image.category, " + "image.description, "
				+ "image.is_personal, " + "image.is_private, " + "image.image_path, " + "image.negative_intensity, "
				+ "image.neutral_intensity, " + "image.positive_intensity, " + "image.created_date, "
				+ "image.last_updated_date, " + "caregiver_personal_image.is_favorite "
				+ "FROM caregiver_personal_image join image " + "on caregiver_personal_image.image_id = image.id "
				+ "WHERE caregiver_personal_image.caregiver_id = '%s' " + "AND image.id = '%s';", caregiverId, imageId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {

				// Image
				Image image = new Image();
				image.setId(imageId);
				image.setCreatedById(rs.getString("created_by_id"));
				image.setCreatedBy(caregiverDAO.getSimpleCaregiverById(con, rs.getString("created_by_id")));
				image.setCategory(rs.getString("category"));
				image.setDescription(rs.getString("description"));
				image.setIsPersonal(rs.getBoolean("is_personal"));
				image.setIsPrivate(rs.getBoolean("is_private"));
				image.setImageURL(
						fileStorageService.loadApplicationImage(rs.getString("image_path"), imageId + ".jpeg"));
				image.setNegativeIntensity(rs.getDouble("negative_intensity"));
				image.setNeutralIntensity(rs.getDouble("neutral_intensity"));
				image.setPositiveIntensity(rs.getDouble("positive_intensity"));
				image.setCreatedDate(rs.getDate("created_date"));
				image.setLastUpdatedDate(rs.getDate("last_updated_date"));

				// Personal Image
				result.setImage(image);
				result.setIsFavorite(rs.getBoolean("is_favorite"));
			}
			logger.info("getCaregiverPersonalImageByIds with caregiver " + "[id:" + caregiverId + "] and image "
					+ "[id: " + imageId + " returned-> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getCaregiverPersonalImageByIds from caregiver " + "[id:" + caregiverId + "] and image "
					+ "[id: " + imageId + " returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves the current image from the current session with given ID
	public RtSessionImage getRunningRtSessionImage(Connection con, String sessionId, String direction)
			throws SQLException {
		RtSessionImage result = new RtSessionImage();
		Statement stmt = null;

		String query = String.format("SELECT s.id, " + "si.image_id, " + "i.image_path, " + "si.observation, "
				+ "si.patient_feedback, " + "si.anxiety, " + "si.agressivity, " + "si.irritability, "
				+ "si.commitment, " + "si.joy, " + "si.enthusiasm, " + "si.communication, " + "si.apathy, "
				+ "si.patient_agressivity, " + "si.patient_sadness, " + "si.patient_isolation, " + "sr.current_image, "
				+ "s.total_images " + "FROM session as s, session_running as sr, session_image as si, image as i "
				+ "WHERE s.id='%s' " + "AND s.id = sr.session_id " + "AND s.id = si.session_id "
				+ "AND si.position_image = sr.current_image " + "AND si.image_id = i.id;", sessionId);
		try {
			// o frontEnd nunca invoca o Previous com current_image = 1 ou o Next com
			// current_image = total_images
			// contudo deveriamos fazer este testes para ter mais segurança !
			stmt = con.createStatement();
			if (direction.equals("Next")) {
				String change_position = String.format(
						"UPDATE session_running " + "SET current_image = current_image + 1 " + "WHERE session_id='%s';",
						sessionId);
				stmt.executeUpdate(change_position);
			} else if (direction.equals("Previous")) {
				String change_position = String.format(
						"UPDATE session_running " + "SET current_image = current_image - 1 " + "WHERE session_id='%s';",
						sessionId);
				stmt.executeUpdate(change_position);
			}
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {

				result.setId(rs.getString("id"));
				result.setImage_id(rs.getString("image_id"));
				result.setImageURL(fileStorageService.loadApplicationImage(rs.getString("image_path"),
						rs.getString("image_id") + ".jpeg"));
				// result.setNegativeIntensity(rs.getDouble("negative_intensity"));
				// result.setNeutralIntensity(rs.getDouble("neutral_intensity"));
				// result.setPositiveIntensity(rs.getDouble("positive_intensity"));
				result.setCurrent_image(rs.getInt("current_image"));
				result.setTotal_images(rs.getInt("total_images"));
				result.setObservation(rs.getString("observation"));
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
			}
			logger.info("getRunningRtSessionImage from session " + "[id:" + sessionId + "] returned-> "
					+ result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getRunningRtSessionImage from session " + "[id:" + sessionId + "] returned error: "
					+ e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	public void updateRunningRtSessionImageFeedback(Connection con, RtSessionImage rtSessionImage) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"UPDATE session_image AS si SET " + "observation='%s', " + "patient_feedback=%s, " + "anxiety=%s, "
						+ "agressivity=%s, " + "irritability=%s, " + "commitment=%s, " + "joy=%s, " + "enthusiasm=%s, "
						+ "communication=%s, " + "apathy=%s " + "WHERE session_id='%s' " + "AND image_id='%s' "
						+ "AND position_image=%s " + "RETURNING session_id;",
				rtSessionImage.getObservation(), rtSessionImage.getPatient_feedback(), rtSessionImage.getAnxiety(),
				rtSessionImage.getAgressivity(), rtSessionImage.getIrritability(), rtSessionImage.getCommitment(),
				rtSessionImage.getJoy(), rtSessionImage.getEnthusiasm(), rtSessionImage.getCommunication(),
				rtSessionImage.getApathy(), rtSessionImage.getId(), rtSessionImage.getImage_id(),
				rtSessionImage.getCurrent_image());
		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);

			logger.info("updateRunningRtSessionImageFeedback for session_image " + "[id:" + rtSessionImage.getId()
					+ " AND image_position:" + rtSessionImage.getCurrent_image() + "] returned 200.");
		} catch (SQLException e) {
			logger.warning("updateRunningRtSessionImageFeedback for session_image " + "[id:" + rtSessionImage.getId()
					+ " AND image_possition:" + rtSessionImage.getCurrent_image() + "] returned error: "
					+ e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB all personal images from the patient with given ID
	public List<PersonalImage> getPatientPersonalImagesByPatientId(Connection con, String patientId)
			throws SQLException {
		List<PersonalImage> result = new ArrayList<PersonalImage>();
		Statement stmt = null;
		String query = String.format("SELECT i.id, " + "i.created_by_id, " + "i.category, " + "i.description, "
				+ "i.is_personal, " + "i.is_private, " + "i.image_path, " + "i.negative_intensity, "
				+ "i.neutral_intensity, " + "i.positive_intensity, " + "i.created_date, " + "i.last_updated_date, "
				+ "p.is_favorite " + "FROM patient_personal_image p, image i " + "WHERE p.patient_id = '%s' "
				+ "AND p.image_id = i.id;", patientId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {

				// Image
				Image image = new Image();
				image.setId(rs.getString("id"));
				image.setCreatedById(rs.getString("created_by_id"));
				image.setCreatedBy(caregiverDAO.getSimpleCaregiverById(con, rs.getString("created_by_id")));
				image.setCategory(rs.getString("category"));
				image.setDescription(rs.getString("description"));
				image.setIsPersonal(rs.getBoolean("is_personal"));
				image.setIsPrivate(rs.getBoolean("is_private"));
				image.setImageURL(fileStorageService.loadApplicationImage(rs.getString("image_path"),
						rs.getString("id") + ".jpeg"));
				image.setNegativeIntensity(rs.getDouble("negative_intensity"));
				image.setNeutralIntensity(rs.getDouble("neutral_intensity"));
				image.setPositiveIntensity(rs.getDouble("positive_intensity"));
				image.setCreatedDate(rs.getDate("created_date"));
				image.setLastUpdatedDate(rs.getDate("last_updated_date"));

				// Personal Image
				PersonalImage personalImage = new PersonalImage();
				personalImage.setImage(image);
				personalImage.setIsFavorite(rs.getBoolean("is_favorite"));
				result.add(personalImage);
			}
			logger.info("getPatientImagesByPatientId from patient " + "[id:" + patientId + "] returned-> "
					+ result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getPatientImagesByPatientId from patient " + "[id:" + patientId + "] returned error: "
					+ e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB all personal images from the patient with given ID
	public List<PersonalImage> getCaregiverPersonalImagesByCaregiverId(Connection con, String caregiverId)
			throws SQLException {
		List<PersonalImage> result = new ArrayList<PersonalImage>();
		Statement stmt = null;
		String query = String.format("SELECT i.id, " + "i.created_by_id, " + "i.category, " + "i.description, "
				+ "i.is_personal, " + "i.is_private, " + "i.image_path, " + "i.negative_intensity, "
				+ "i.neutral_intensity, " + "i.positive_intensity, " + "i.created_date, " + "i.last_updated_date, "
				+ "p.is_favorite " + "FROM caregiver_personal_image p, image i " + "WHERE p.caregiver_id = '%s' "
				+ "AND p.image_id = i.id;", caregiverId);

		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {

				// Image
				Image image = new Image();
				image.setId(rs.getString("id"));
				image.setCreatedById(rs.getString("created_by_id"));
				image.setCreatedBy(caregiverDAO.getSimpleCaregiverById(con, rs.getString("created_by_id")));
				image.setCategory(rs.getString("category"));
				image.setDescription(rs.getString("description"));
				image.setIsPersonal(rs.getBoolean("is_personal"));
				image.setIsPrivate(rs.getBoolean("is_private"));
				image.setImageURL(fileStorageService.loadApplicationImage(rs.getString("image_path"),
						rs.getString("id") + ".jpeg"));
				image.setNegativeIntensity(rs.getDouble("negative_intensity"));
				image.setNeutralIntensity(rs.getDouble("neutral_intensity"));
				image.setPositiveIntensity(rs.getDouble("positive_intensity"));
				image.setCreatedDate(rs.getDate("created_date"));
				image.setLastUpdatedDate(rs.getDate("last_updated_date"));

				// Personal Image
				PersonalImage personalImage = new PersonalImage();
				personalImage.setImage(image);
				personalImage.setIsFavorite(rs.getBoolean("is_favorite"));
				result.add(personalImage);
			}
			logger.info("getCaregiverPersonalImagesByCaregiverId from caregiver " + "[id:" + caregiverId
					+ "] returned-> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getCaregiverPersonalImagesByCaregiverId from caregiver " + "[id:" + caregiverId
					+ "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB all images from a category with the filters defined =>
	// para a paginação com Offset e Limit
	// ADAPTAR esta copia do get image for a Patient
	public List<PersonalImage> getImagesByCategory(Connection con, String caregiverId, ImagesFilterData imagesFilters)
			throws SQLException {
		List<PersonalImage> result = new ArrayList<PersonalImage>();
		Statement stmt = null;
		Integer offset;
		boolean predicate = false;
		boolean hasCaregiverImages = imagesFilters.getAllPublicImage() || imagesFilters.getMyImageAll()
				|| imagesFilters.getMyImagePrivate() || imagesFilters.getMyImageFavorite();
		boolean hasPatientImages = imagesFilters.getAllPublicImage() || imagesFilters.getPatientImageAll()
				|| imagesFilters.getPatientImagePrivate() || imagesFilters.getPatientImageFavorite();
		boolean withPatient = !imagesFilters.getPatientId().equals("any");
		String query = "SELECT i.id, " + "i.created_by_id, " + "i.category, " + "i.description, " + "i.is_personal, "
				+ "i.is_private, " + "i.image_path, " + "i.negative_intensity, " + "i.neutral_intensity, "
				+ "i.positive_intensity, " + "i.created_date, " + "i.last_updated_date, ";
		if (hasCaregiverImages && hasPatientImages) {
			query = String.format(query + "CASE WHEN cpi.caregiver_id IS NOT NULL" + " THEN cpi.is_favorite"
					+ " ELSE ppi.is_favorite " + "END AS is_favorite, " + "CASE WHEN cpi.caregiver_id IS NOT NULL"
					+ " THEN 'caregiver'" + " ELSE 'patient' " + "END AS origin " + "FROM image i "
					+ "LEFT JOIN caregiver_personal_image cpi ON (i.id=cpi.image_id) "
					+ "LEFT JOIN patient_personal_image ppi ON (i.id=ppi.image_id) "
					+ "WHERE NOT (cpi.is_favorite isnull AND ppi.is_favorite isnull) "
					+ "AND i.category LIKE '%%%s%%' ", imagesFilters.getCategory());
			if (!imagesFilters.getDescription().equals("")) {
				query = query + String.format("AND LOWER(i.description) LIKE LOWER('%%%s%%') ",
						imagesFilters.getDescription());
			}
		} else if (hasCaregiverImages) {
			query = String.format(
					query + "cpi.is_favorite, " + "'caregiver' AS origin " + "FROM image i "
							+ "LEFT JOIN caregiver_personal_image cpi ON (i.id=cpi.image_id) "
							+ "WHERE NOT cpi.is_favorite isnull " + "AND i.category LIKE '%%%s%%' ",
					imagesFilters.getCategory());
			if (!imagesFilters.getDescription().equals("")) {
				query = query + String.format("AND LOWER(i.description) LIKE LOWER('%%%s%%') ",
						imagesFilters.getDescription());
			}
		} else if (hasPatientImages) {
			query = String.format(
					query + "ppi.is_favorite, " + "'patient' AS origin " + "FROM image i "
							+ "LEFT JOIN patient_personal_image ppi ON (i.id=ppi.image_id) "
							+ "WHERE NOT ppi.is_favorite isnull " + "AND i.category LIKE '%%%s%%' ",
					imagesFilters.getCategory());
			if (!imagesFilters.getDescription().equals("")) {
				query = query + String.format("AND LOWER(i.description) LIKE LOWER('%%%s%%') ",
						imagesFilters.getDescription());
			}
		} else {
			// There's no selection images
			return result;
		}
		query = query + "AND (";
		if (imagesFilters.getAllPublicImage()) {
			query = query + "(i.is_private = false)";
			predicate = true;
		}
		if (imagesFilters.getMyImageAll()) {
			if (predicate)
				query = query + " OR ";
			query = query + String.format("(cpi.caregiver_id = '%s')", caregiverId);
			predicate = true;
		}
		if (imagesFilters.getMyImagePrivate()) {
			if (predicate)
				query = query + " OR ";
			query = query + String.format("(cpi.caregiver_id = '%s' AND i.is_private = true)", caregiverId);
			predicate = true;
		}
		if (imagesFilters.getMyImageFavorite()) {
			if (predicate)
				query = query + " OR ";
			query = query + String.format("(cpi.caregiver_id = '%s' AND cpi.is_favorite = true)", caregiverId);
			predicate = true;
		}
		if (imagesFilters.getPatientImageAll() && withPatient) {
			if (predicate)
				query = query + " OR ";
			query = query + String.format("(ppi.patient_id = '%s')", imagesFilters.getPatientId());
			predicate = true;
		}
		if (imagesFilters.getPatientImagePrivate() && withPatient) {
			if (predicate)
				query = query + " OR ";
			query = query
					+ String.format("(ppi.patient_id = '%s' AND i.is_private = true)", imagesFilters.getPatientId());
			predicate = true;
		}
		if (imagesFilters.getPatientImageFavorite() && withPatient) {
			if (predicate)
				query = query + " OR ";
			query = query
					+ String.format("(ppi.patient_id = '%s' AND ppi.is_favorite = true)", imagesFilters.getPatientId());
			predicate = true;
		}
		query = query + ") ";
		query = query + "ORDER BY is_favorite DESC, last_updated_date DESC ";

		/*
		 * offset = (imagesFilters.getPage() - 1) * imagesFilters.getPageSize(); query =
		 * query + " LIMIT " + imagesFilters.getPageSize() + " OFFSET " + offset + ";";
		 */

		try {
			stmt = con.createStatement();
			logger.info(" >>>>>>LOG INFO TO DELETE >>>>>>>>>>> getImagesByCategory SQL Query: " + query);
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {

				// Image
				Image image = new Image();
				image.setId(rs.getString("id"));
				image.setCreatedById(rs.getString("created_by_id"));
				image.setCreatedBy(caregiverDAO.getSimpleCaregiverById(con, rs.getString("created_by_id")));
				image.setCategory(rs.getString("category"));
				image.setDescription(rs.getString("description"));
				image.setIsPersonal(rs.getBoolean("is_personal"));
				image.setIsPrivate(rs.getBoolean("is_private"));
				image.setImageURL(fileStorageService.loadApplicationImage(rs.getString("image_path"),
						rs.getString("id") + ".jpeg"));
				image.setNegativeIntensity(rs.getDouble("negative_intensity"));
				image.setNeutralIntensity(rs.getDouble("neutral_intensity"));
				image.setPositiveIntensity(rs.getDouble("positive_intensity"));
				image.setCreatedDate(rs.getDate("created_date"));
				image.setLastUpdatedDate(rs.getDate("last_updated_date"));

				// Personal Image
				PersonalImage personalImage = new PersonalImage();
				personalImage.setImage(image);
				personalImage.setIsFavorite(rs.getBoolean("is_favorite"));
				result.add(personalImage);
			}
			logger.info("getImagesByCategory from caregiver " + "[id:" + caregiverId + " for category: "
					+ imagesFilters.getCategory() + "] returned-> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getImagesByCategory from caregiver " + "[id:" + caregiverId + " for category: "
					+ imagesFilters.getCategory() + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Updates an images on the DB with the given data
	public void updateImageById(Connection con, Image image) throws SQLException {
		Statement stmt = null;
		String query = String.format(
				"UPDATE image SET category='%s', " + "description='%s', is_private='%b', " + "last_updated_date=now() "
						+ "WHERE id='%s' RETURNING id;",
				image.getCategory(), image.getDescription(), image.getIsPrivate(), image.getId());

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("updateImageById [id: " + image.getId() + "] returned-> " + image.toString());
		} catch (SQLException e) {
			logger.warning(
					"updateImageById with image " + "[id: " + image.getId() + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Retrieves from the DB all images from a category with the filters defined
	// ADAPTAR esta copia do get image for a Patient
	public List<RtSessionCreateData> selectImagesByCategory(Connection con, String caregiverId, String patientId,
			String category, String quantity, RtSessionCreateDataList rtslist) throws SQLException {
		List<RtSessionCreateData> result = new ArrayList<RtSessionCreateData>();
		List<String> resultIds = new ArrayList<String>();
		Statement stmt = null;
		boolean hasPatientImages = patientId.length() > 0;
		String queryCount = "SELECT count(*) ";
		String query = "SELECT i.id, " + "i.created_by_id, " + "i.category, " + "i.description, " + "i.is_personal, "
				+ "i.is_private, " + "i.image_path, " + "i.negative_intensity, " + "i.neutral_intensity, "
				+ "i.positive_intensity, " + "i.created_date, " + "i.last_updated_date, ";
		if (!hasPatientImages) {
			queryCount = queryCount + String.format("FROM image i "
					+ "LEFT JOIN caregiver_personal_image cpi ON (i.id=cpi.image_id) "
					+ "LEFT JOIN patient_personal_image ppi ON (i.id=ppi.image_id) "
					+ "WHERE NOT (cpi.is_favorite isnull AND ppi.is_favorite isnull) " + "AND ( (i.is_private = false) "
					+ "OR (cpi.caregiver_id = '%s') ) " + "AND i.category LIKE '%%%s%%' ", caregiverId, category);
			query = query + String.format("cpi.is_favorite, " + "'caregiver' AS origin " + "FROM image i "
					+ "LEFT JOIN caregiver_personal_image cpi ON (i.id=cpi.image_id) "
					+ "LEFT JOIN patient_personal_image ppi ON (i.id=ppi.image_id) "
					+ "WHERE NOT (cpi.is_favorite isnull AND ppi.is_favorite isnull) " + "AND ( (i.is_private = false) "
					+ "OR (cpi.caregiver_id = '%s') ) " + "AND i.category LIKE '%%%s%%' ", caregiverId, category);
		}
		if (hasPatientImages) {
			queryCount = queryCount + String.format(
					"FROM image i " + "LEFT JOIN caregiver_personal_image cpi ON (i.id=cpi.image_id) "
							+ "LEFT JOIN patient_personal_image ppi ON (i.id=ppi.image_id) "
							+ "WHERE NOT (cpi.is_favorite isnull AND ppi.is_favorite isnull) "
							+ "AND ( (i.is_private = false) " + "OR (cpi.caregiver_id = '%s') "
							+ "OR (ppi.patient_id = '%s') ) " + "AND i.category LIKE '%%%s%%' ",
					caregiverId, patientId, category);
			query = query + String.format(
					"CASE WHEN cpi.caregiver_id IS NOT NULL" + " THEN cpi.is_favorite" + " ELSE ppi.is_favorite "
							+ "END AS is_favorite, " + "CASE WHEN cpi.caregiver_id IS NOT NULL" + " THEN 'caregiver'"
							+ " ELSE 'patient' " + "END AS origin " + "FROM image i "
							+ "LEFT JOIN caregiver_personal_image cpi ON (i.id=cpi.image_id) "
							+ "LEFT JOIN patient_personal_image ppi ON (i.id=ppi.image_id) "
							+ "WHERE NOT (cpi.is_favorite isnull AND ppi.is_favorite isnull) "
							+ "AND ( (i.is_private = false) " + "OR (cpi.caregiver_id = '%s')"
							+ "OR (ppi.patient_id = '%s') ) " + "AND i.category LIKE '%%%s%%' ",
					caregiverId, patientId, category);
		}
		query = query + " ORDER BY i.last_updated_date LIMIT 1 OFFSET ";

		try {
			stmt = con.createStatement();
			ResultSet rsCount = stmt.executeQuery(queryCount);
			long imagesCount = 0;
			while (rsCount.next()) {
				imagesCount = rsCount.getLong(1);
			}

			int iQuantity = (int) Math.min(Long.parseLong(quantity), imagesCount);
			long[] idxs = new Random().longs(0, imagesCount).distinct().limit(iQuantity).toArray();
			Arrays.sort(idxs);
			long currentIdx = -1;

			for (int i = 0; i < idxs.length; i++) {
				if (currentIdx == -1)
					currentIdx = idxs[i];
				String querySelectOneImage = query + String.format("%s ;", idxs[i]);

				ResultSet rs = stmt.executeQuery(querySelectOneImage);

				while (rs.next()) {

					// Image
					Image image = new Image();
					image.setId(rs.getString("id"));
					image.setCreatedById(rs.getString("created_by_id"));
					image.setCreatedBy(caregiverDAO.getSimpleCaregiverById(con, rs.getString("created_by_id")));
					image.setCategory(rs.getString("category"));
					image.setDescription(rs.getString("description"));
					image.setIsPersonal(rs.getBoolean("is_personal"));
					image.setIsPrivate(rs.getBoolean("is_private"));
					image.setImageURL(fileStorageService.loadApplicationImage(rs.getString("image_path"),
							rs.getString("id") + ".jpeg"));
					image.setNegativeIntensity(rs.getDouble("negative_intensity"));
					image.setNeutralIntensity(rs.getDouble("neutral_intensity"));
					image.setPositiveIntensity(rs.getDouble("positive_intensity"));
					image.setCreatedDate(rs.getDate("created_date"));
					image.setLastUpdatedDate(rs.getDate("last_updated_date"));

					// RtSessionCreateData
					RtSessionCreateData tmpdata = new RtSessionCreateData();
					tmpdata.setImage(image);
					tmpdata.setId(image.getId());
					tmpdata.setFavorite(rs.getBoolean("is_favorite"));
					if (rtslist.containsId(tmpdata.getId()) || resultIds.contains(tmpdata.getId())) {
						// Caso a imagem selecionada já tenha sido selecionada anteriormente, tenta
						// novamente com a imagem seguinte
						if (currentIdx != (idxs[i] + 1) % imagesCount) {
							idxs[i]++;
							if (idxs[i] >= imagesCount) {
								idxs[i] = 0;
							}
							i--;
						}

					} else {
						resultIds.add(tmpdata.getId());
						result.add(tmpdata);
						currentIdx = -1;
					}
				}
			}
			logger.info("selectImagesByCategory from caregiver " + "[id:" + caregiverId + " for category: " + category
					+ "] returned-> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("selectImagesByCategory from caregiver " + "[id:" + caregiverId + " for category: "
					+ category + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Updates the favorite state of a Patient Personal Image on the DB with patient
	 * and image IDs
	 */
	public void updatePatientImageByIds(Connection con, String patientId, String imageId, boolean isFavorite)
			throws SQLException {
		Statement stmt = null;
		String query = String.format("UPDATE patient_personal_image SET is_favorite='%b' "
				+ "WHERE patient_id='%s' AND image_id='%s' " + "RETURNING image_id;", isFavorite, patientId, imageId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("updatePatientImageByIds for patient " + "[id: " + patientId + "] and image [id: " + imageId
					+ "] returned 200");
		} catch (SQLException e) {
			logger.warning("updatePatientImageByIds for patient " + "[id: " + patientId + "] and image [id: " + imageId
					+ "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Updates the favorite state of a Caregiver Personal Image on the DB with
	 * caregiver and image IDs
	 */
	public void updateCaregiverImageByIds(Connection con, String caregiverId, String imageId, boolean isFavorite)
			throws SQLException {
		Statement stmt = null;
		String query = String.format("UPDATE caregiver_personal_image SET is_favorite='%b' "
				+ "WHERE caregiver_id='%s' AND image_id='%s' " + "RETURNING image_id;", isFavorite, caregiverId,
				imageId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("updateCaregiverImageByIds for caregiver " + "[id: " + caregiverId + "] and image [id: "
					+ imageId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("updateCaregiverImageByIds for caregiver " + "[id: " + caregiverId + "] and image [id: "
					+ imageId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	// Deletes the image with given ID from the DB
	public void deleteImageById(Connection con, String imageId) throws SQLException {
		Statement stmt = null;
		String query = String.format("DELETE FROM image WHERE id='%s';", imageId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("deleteImageById [id: " + imageId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("deleteImageById with image [id: " + imageId + "] " + "returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Deletes a patient personal app image with given patient ID and image ID
	 */
	public void deletePatientPersonalImageConnection(Connection con, String patientId, String imageId)
			throws SQLException {
		Statement stmt = null;
		String query = String.format("DELETE FROM patient_personal_image " + "WHERE patient_id='%s' AND image_id='%s' "
				+ "RETURNING image_id;", patientId, imageId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("deletePatientImageByIds for patient " + "[id: " + patientId + "] and image [id: " + imageId
					+ "] returned 200");
		} catch (SQLException e) {
			logger.warning("deletePatientImageByIds for patient " + "[id: " + patientId + "] and image [id: " + imageId
					+ "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	/**
	 * Deletes a caregiver personal app image with given caregiver token and image
	 * ID
	 */
	public void deleteCaregiverPersonalImageConnection(Connection con, String caregiverId, String imageId)
			throws SQLException {
		Statement stmt = null;
		String query = String.format("DELETE FROM caregiver_personal_image "
				+ "WHERE caregiver_id='%s' AND image_id='%s' " + "RETURNING image_id;", caregiverId, imageId);

		try {
			stmt = con.createStatement();
			stmt.executeQuery(query);
			logger.info("deleteCaregiverPersonalImageConnection" + " for caregiver " + "[id: " + caregiverId
					+ "] and image [id: " + imageId + "] returned 200");
		} catch (SQLException e) {
			logger.warning("deleteCaregiverPersonalImageConnection" + " for caregiver " + "[id: " + caregiverId
					+ "] and image [id: " + imageId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	public List<RtSessionImage> getImagesSession(Connection con, String sessionId) throws SQLException {
		List<RtSessionImage> result = new ArrayList<RtSessionImage>();
		Statement stmt = null;
		String query = String.format("SELECT s.id, " + "si.image_id, " + "i.image_path, " + "si.observation, "
				+ "si.patient_feedback, " + "si.anxiety, " + "si.agressivity, " + "si.irritability, "
				+ "si.commitment, " + "si.joy, " + "si.enthusiasm, " + "si.communication, " + "si.apathy, "
				+ "si.patient_agressivity, " + "si.patient_sadness, " + "si.patient_isolation, " + "s.total_images, "
				+ "i.category " + "FROM session as s, session_image as si, image as i " + "WHERE s.id='%s' "
				+ "AND s.id = si.session_id " + "AND si.image_id = i.id;", sessionId);
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				// Image
				RtSessionImage image = new RtSessionImage();
				image.setId(rs.getString("id"));
				image.setImage_id(rs.getString("image_id"));
				image.setImageURL(fileStorageService.loadApplicationImage(rs.getString("image_path"),
						rs.getString("image_id") + ".jpeg"));
				// result.setNegativeIntensity(rs.getDouble("negative_intensity"));
				// result.setNeutralIntensity(rs.getDouble("neutral_intensity"));
				// result.setPositiveIntensity(rs.getDouble("positive_intensity"));
				// image.setCurrent_image(rs.getInt("current_image"));
				image.setTotal_images(rs.getInt("total_images"));
				image.setObservation(rs.getString("observation"));
				image.setPatient_feedback(rs.getInt("patient_feedback"));
				image.setAnxiety(rs.getInt("anxiety"));
				image.setAgressivity(rs.getInt("agressivity"));
				image.setIrritability(rs.getInt("irritability"));
				image.setCommitment(rs.getInt("commitment"));
				image.setJoy(rs.getInt("joy"));
				image.setEnthusiasm(rs.getInt("enthusiasm"));
				image.setCommunication(rs.getInt("communication"));
				image.setApathy(rs.getInt("apathy"));
				image.setPatient_agressivity(rs.getInt("patient_agressivity"));
				image.setPatient_sadness(rs.getInt("patient_sadness"));
				image.setPatient_isolation(rs.getInt("patient_isolation"));
				image.setCategory(rs.getString("category"));

				result.add(image);
				System.out.println(image);
			}
			logger.info("getImagesSession from patient " + "[id:" + sessionId + "] returned-> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getImagesSession from patient " + "[id:" + sessionId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}

	public List<PersonalImage> getImagesByTemplateSessionId(Connection con, String caregiverID,
			String templateSessionId) throws SQLException {
		List<PersonalImage> result = new ArrayList<PersonalImage>();
		Statement stmt = null;
		String query = String.format("SELECT tsi.template_session_id, " + "tsi.image_id, " + "tsi.position_image, "
				+ "i.created_by_id, " + "i.category, " + "i.description, " + "i.is_personal, " + "i.is_private, "
				+ "i.image_path, " + "i.negative_intensity, " + "i.neutral_intensity, " + "i.positive_intensity, "
				+ "i.created_date, " + "i.last_updated_date, " + "CASE WHEN cpi.caregiver_id IS NOT NULL"
				+ " THEN cpi.is_favorite" + " ELSE ppi.is_favorite " + "END AS is_favorite, "
				+ "CASE WHEN cpi.caregiver_id IS NOT NULL" + " THEN 'caregiver'" + " ELSE 'patient' "
				+ "END AS origin  " + "FROM template_session_image tsi " + "LEFT JOIN image i ON (tsi.image_id = i.id) "
				+ "LEFT JOIN caregiver_personal_image cpi ON (i.id=cpi.image_id) "
				+ "LEFT JOIN patient_personal_image ppi ON (i.id=ppi.image_id) " + "WHERE template_session_id = '%s' "
				+ "ORDER BY position_image ASC", templateSessionId);
		try {
			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {

				// Image
				Image image = new Image();
				image.setId(rs.getString("image_id"));
				image.setCreatedById(rs.getString("created_by_id"));
				image.setCreatedBy(caregiverDAO.getSimpleCaregiverById(con, rs.getString("created_by_id")));
				image.setCategory(rs.getString("category"));
				image.setDescription(rs.getString("description"));
				image.setIsPersonal(rs.getBoolean("is_personal"));
				image.setIsPrivate(rs.getBoolean("is_private"));
				image.setImageURL(fileStorageService.loadApplicationImage(rs.getString("image_path"),
						rs.getString("image_id") + ".jpeg"));
				image.setNegativeIntensity(rs.getDouble("negative_intensity"));
				image.setNeutralIntensity(rs.getDouble("neutral_intensity"));
				image.setPositiveIntensity(rs.getDouble("positive_intensity"));
				image.setCreatedDate(rs.getDate("created_date"));
				image.setLastUpdatedDate(rs.getDate("last_updated_date"));

				// Personal Image
				PersonalImage personalImage = new PersonalImage();
				personalImage.setImage(image);
				personalImage.setIsFavorite(rs.getBoolean("is_favorite"));
				result.add(personalImage);
			}
			logger.info("getImagesByTemplateSessionId for template session [id:  " + caregiverID
					+ " for template session: " + templateSessionId + "] returned-> " + result.toString());
			return result;
		} catch (SQLException e) {
			logger.warning("getImagesByTemplateSessionId for template session [id:  " + caregiverID
					+ " for template session: " + templateSessionId + "] returned error: " + e.toString());
			throw new SQLException(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
	}
}
