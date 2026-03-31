/**
 * V2
 * @author André Santana - fc49451
 * 
 * A service build to load URLs and store files on folder Uploads.
 * Also it allows to load this files to URL again so they can be passed
 * on HTTP requests.
 */

package com.keepsakeBox.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.util.Base64;
import java.util.logging.Logger;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;

import com.keepsakeBox.dto.InternalServerErrorException;

public class FileStorageService {

	// Class Logger
	Logger logger = Logger.getLogger(FileStorageService.class.getName());

	// All Default Uploads Path
	private final Path uploadsPath = Paths.get("uploads");
	private final Path caregiverProfileImgsPath = Paths.get("uploads/caregiverProfileImgs");
	private final Path patientProfileImgsPath = Paths.get("uploads/patientProfileImgs");
	private final Path patientImagesPath = Paths.get("uploads/patient");
	private final Path caregiverImagesPath = Paths.get("uploads/caregiver");
	private final Path validateImagesPath = Paths.get("uploads/caregiver/validation");

	// Initiates Default folders if not initiated
	public void initUploadFolder() {
		try {
			if (!Files.isDirectory(uploadsPath)) {
				Files.createDirectory(uploadsPath);
			}
			if (!Files.isDirectory(caregiverProfileImgsPath)) {
				Files.createDirectory(caregiverProfileImgsPath);
			}
			if (!Files.isDirectory(patientProfileImgsPath)) {
				Files.createDirectory(patientProfileImgsPath);
			}
		} catch (IOException e) {
			throw new RuntimeException("Could not initialize folders for upload!");
		}
	}

	/**
	 * Initiates patient specific folder with imagePath that consists on
	 * upload/patient/{patientId}
	 */
	public void initPatientFolder(String imagePath) {
		try {
			if (!Files.isDirectory(patientImagesPath)) {
				Files.createDirectory(patientImagesPath);
			}
			if (!Files.isDirectory(Paths.get(imagePath))) {
				Files.createDirectory(Paths.get(imagePath));
			}
		} catch (IOException e) {
			throw new RuntimeException("Could not initialize patient specific " + "folders for upload!");
		}
	}

	/**
	 * Initiates caregiver specific folder with impagePath that consists on
	 * upload/caregiver/{caregiverId}
	 */
	public void initCaregiverFolder(String imagePath) {
		try {
			if (!Files.isDirectory(caregiverImagesPath)) {
				Files.createDirectory(caregiverImagesPath);
			}
			if (!Files.isDirectory(Paths.get(imagePath))) {
				Files.createDirectory(Paths.get(imagePath));
			}
		} catch (IOException e) {
			throw new RuntimeException("Could not initialize caregiver specific " + "folders for upload!");
		}
	}

	/**
	 * Initiates validation specific folder with impagePath that consists on
	 * upload/caregiver/{caregiverId}
	 */
	public void initValidationFolder(String imagePath) {
		try {
			if (!Files.isDirectory(validateImagesPath)) {
				Files.createDirectory(validateImagesPath);
			}
			if (!Files.isDirectory(Paths.get(imagePath))) {
				Files.createDirectory(Paths.get(imagePath));
			}
		} catch (IOException e) {
			throw new RuntimeException("Could not initialize caregiver specific " + "folders for upload!");
		}
	}

	/**
	 * Uploads a caregiver profile image (it also can replace)
	 * 
	 * @param imageURL  - image URL to save as caregiver profile image
	 * @param imageName - name of the caregiver profile image to save on folders
	 *                  (image path name)
	 */
	public void uploadCaregiverProfileImage(String imageURL, String imageName) {
		try {
			this.initUploadFolder();
			File file = new File("uploads/caregiverProfileImgs/" + imageName);
			this.uploadImage(imageURL, file);
			logger.info("uploadCaregiverProfileImage returned 200");
		} catch (Exception e) {
			logger.warning("uploadCaregiverProfileImage responded 500: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Uploads a patient profile image (it also can replace)
	 * 
	 * @param imageURL  - image URL to save as patient profile image
	 * @param imageName - name of the patient profile image to save on folders
	 *                  (image path name)
	 */
	public void uploadPatientProfileImage(String imageURL, String imageName) {
		try {
			this.initUploadFolder();
			File file = new File("uploads/patientProfileImgs/" + imageName);
			this.uploadImage(imageURL, file);
			logger.info("uploadPatientProfileImage returned 200");
		} catch (Exception e) {
			logger.warning("uploadPatientProfileImage responded 500: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Uploads an app patient image to a specific patient folder
	 * 
	 * @param imageURL  - app image URL to save on folders
	 * @param imagePath - path which consists on upload/patient/{patientId}
	 * @param imageName - image name (image path name) which consists on
	 *                  {imageID}.jpeg
	 */
	public void uploadPatientAppImage(String imageURL, String imagePath, String imageName) {
		try {
			this.initPatientFolder(imagePath);
			File file = new File(imagePath + "/" + imageName);
			if (imagePath.contains("/thumbnails")) {
				this.uploadThumbnail(imageURL, file);
			} else {
				this.uploadImage(imageURL, file);
			}
			;
			// Logging
			logger.info("uploadPatientAppImage returned 200");
		} catch (Exception e) {
			logger.warning("uploadPatientAppImage responded 500" + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Uploads an app caregiver image to a specific caregiver folder
	 * 
	 * @param imageURL  - app image URL to save on folders
	 * @param imagePath - path which consists on upload/caregiver/{caregiverId}
	 * @param imageName - image name (image path name) which consists on
	 *                  {imageID}.jpeg
	 */
	public void uploadCaregiverAppImage(String imageURL, String imagePath, String imageName) {
		try {
			this.initCaregiverFolder(imagePath);
			File file = new File(imagePath + "/" + imageName);
			if (imagePath.contains("/thumbnails")) {
				this.uploadThumbnail(imageURL, file);
			} else {
				this.uploadImage(imageURL, file);
			}
			;

			// Logging
			logger.info("uploadCaregiverAppImage returned 200");
		} catch (Exception e) {
			logger.warning("uploadCaregiverAppImage responded 500" + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Uploads an image for validation
	 * 
	 * @param imageURL  - app image URL to save on folders
	 * @param imagePath - path which consists on upload/caregiver/{caregiverId}
	 * @param imageName - image name (image path name) which consists on
	 *                  {imageID}.jpeg
	 */
	public void uploadImageToValidate(String imageURL, String imagePath, String imageName) {
		try {
			this.initValidationFolder(imagePath);
			File file = new File(imagePath + "/" + imageName);
			this.uploadImage(imageURL, file);

			// Logging
			logger.info("uploadImageToValidate returned 200");
		} catch (Exception e) {
			logger.warning("uploadImageToValidate responded 500" + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Upload an image into the folders with a file which already is the destination
	 * and imageURL
	 * 
	 * @param imageURL - image URL to convert to image file
	 * @param file     - file wich consists on the destination of the image
	 *                 converted
	 */
	public void uploadImage(String imageURL, File file) {
		try {
			// Tranforms ImageURL into File
			String base64Image = imageURL.split(",")[1];
			byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
			BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));

			if (image.getWidth() > 2560 || image.getHeight() > 2560) {
				Dimension imgSize = new Dimension(image.getHeight(), image.getWidth());
				Dimension borderSize = new Dimension(2560, 2560);
				Dimension scaledSize = getScaledDimension(imgSize, borderSize);
				image = resizeImage(image, scaledSize.height, scaledSize.width);
			}
			ImageIO.write(image, "jpeg", file);

			logger.info("uploadImage [file: " + file.getName() + "] returned 200.");

		} catch (Exception e) {
			logger.warning("uploadImage [file: " + file.getName() + "] responded 500: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	// get image dimensions
	public Dimension getScaledDimension(Dimension imageSize, Dimension boundary) {

		double widthRatio = boundary.getWidth() / imageSize.getWidth();
		double heightRatio = boundary.getHeight() / imageSize.getHeight();
		double ratio = Math.min(widthRatio, heightRatio);

		return new Dimension((int) (imageSize.width * ratio), (int) (imageSize.height * ratio));
	}

	/**
	 * Upload a thumbnail into the folders with a file which already is the
	 * destination and imageURL
	 * 
	 * @param imageURL - image URL to convert to thumbnail file
	 * @param file     - file which consists on the destination of the thumbnail
	 *                 converted
	 */
	public void uploadThumbnail(String imageURL, File file) {
		try {
			// Tranforms ImageURL into File
			String base64Image = imageURL.split(",")[1];
			byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
			BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
			Dimension imgSize = new Dimension(image.getHeight(), image.getWidth());
			Dimension borderSize = new Dimension(400, 400);
			Dimension scaledSize = getScaledDimension(imgSize, borderSize);
			image = resizeImage(image, scaledSize.height, scaledSize.width);
			// BufferedImage thumbnail = resizeImage(image, 185, 170);
			ImageIO.write(image, "jpeg", file);

			logger.info("uploadThumbnail [file: " + file.getName() + "] returned 200.");
		} catch (Exception e) {
			logger.warning("uploadThumbnail [file: " + file.getName() + "] responded 500: " + e.toString());
			throw new InternalServerErrorException(e.toString());
		}
	}

	/**
	 * Resizes an image
	 * 
	 * @param originalImage - original image to be resized
	 * @param targetWidth   - desired width of the resized image, in pixels
	 * @param targetHeight  - desired height of the resized image, in pixels
	 * @return resized image
	 * @throws Exception
	 */
	public BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight)
			throws IOException {
		BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
		Graphics2D graphics2D = resizedImage.createGraphics();
		graphics2D.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
		graphics2D.dispose();
		return resizedImage;
	}

	/**
	 * Loads a caregiver profile image from upload folders
	 * 
	 * @param fileName - filename which consists on {caregiverId}.png
	 * @return caregiver profile image URL
	 */
	public String loadCaregiverProfileImage(String fileName) {
		Path filePath = caregiverProfileImgsPath.resolve(fileName);
		return "data:image/jpeg;base64," + this.loadImage(filePath);
	}

	/**
	 * Loads a patient profile image from upload folders
	 * 
	 * @param fileName - filename which consists on {patientId}.png
	 * @return patient profile image URL
	 */
	public String loadPatientProfileImage(String fileName) {
		Path filePath = patientProfileImgsPath.resolve(fileName);
		return "data:image/jpeg;base64," + this.loadImage(filePath);
	}

	/**
	 * Loads an application image either from a caregiver or patient from folders
	 * 
	 * @param imagePath - For caregiver it consists on
	 *                  upload/caregiver/{caregiverId}; For patient it consists on
	 *                  upload/patient/{patientId}
	 * @param imageName - image name (image path name) which consists on
	 *                  {imageID}.jpeg
	 * @return application image URL
	 */
	public String loadApplicationImage(String imagePath, String imageName) {
		Path personalImagePath = Paths.get(imagePath);
		Path filePath = personalImagePath.resolve(imageName);
		return "data:image/jpeg;base64," + this.loadImage(filePath);
	}

	/**
	 * Loads an image from uploads folder with a filePath defined
	 * 
	 * @param filePath - file path which points to the image we want to load
	 * @return image loaded as URL on base64
	 */
	public String loadImage(Path filePath) {
		try {
			Resource resource = new UrlResource(filePath.toUri());
			byte[] fileContent = FileUtils.readFileToByteArray(filePath.toFile());
			String encodedString = Base64.getEncoder().encodeToString(fileContent);

			if (resource.exists() || resource.isReadable()) {
				logger.info("loadImage [file: " + filePath.getFileName() + "] returned 200.");
				return encodedString;
			} else {
				logger.warning("loadImage [file: " + filePath.getFileName() + "] responded 500: ");
				throw new RuntimeException("could not load the file");
			}
		} catch (MalformedURLException e) {
			logger.warning(
					"loadImage [file: " + filePath.getFileName() + "] responded 500: " + e.getMessage().toString());
			throw new RuntimeException(e);
		} catch (IOException e) {
			logger.warning(
					"loadImage [file: " + filePath.getFileName() + "] responded 500: " + e.getMessage().toString());
			throw new RuntimeException(e);
		}
	}

}