/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 * @author Pedro Neves - fc46430
 * @author Bruna Vieites - fc55792
 */

package com.keepsakeBox.controller;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.keepsakeBox.dto.*;
import com.keepsakeBox.service.*;

@RestController
@CrossOrigin
public class AppController {

	//List of all Caregiver Logged Sessions
	private List<LoggedSession> loggedSessions = new ArrayList<LoggedSession>();

	//Services Declaration
	private AppService app = new AppService();
	private CaregiverService caregiver = new CaregiverService();
	private ImageService image = new ImageService();
	private PatientService patient = new PatientService();
	private SessionService session = new SessionService();
	private TemplateSessionService templateSession = new TemplateSessionService();
	private ObservationService observation = new ObservationService();
	private MessageService message = new MessageService();
	private NotificationService notification = new NotificationService();
	private CategoryService category = new CategoryService();
	private RequestService request = new RequestService();
	
	/**
	 * Gets an image associated with a thumbnail using the image id
	 * @param token - session ID associated to the logged caregiver
	 * @param caregiverId - caregiver's Id to select 
	 * @return Caregiver with the caregiverId
	 */
	@PostMapping("/thumbnail/id")
	public Thumbnail getThumbnail(@RequestBody String imageId) {
		return image.getThumbnail(imageId);
	}
	
	/**
	 * Sends image to validate
	 * @param token - session ID associated to the logged caregiver
	 * @param caregiverId - caregiver's Id to select 
	 * @return Caregiver with the caregiverId
	 */
	@PostMapping("/validate")
	public String sendImageToValidate(@RequestBody ImageToValidate imageToValidateData) {
		return image.sendImageToValidate(imageToValidateData);
	}
	
	/**
	 * Gets a caregiver with given id
	 * @param token - session ID associated to the logged caregiver
	 * @param caregiverId - caregiver's Id to select 
	 * @return Caregiver with the caregiverId
	 */
	@PostMapping("/validate/caregiver")
	public ImageToValidate[] getImagesToValidateByCaregiverId(@RequestBody String caregiverId) {
		return image.getImagesToValidateByCaregiverId(caregiverId);
	}
	
	/**
	 * Gets a caregiver with given id
	 * @param token - session ID associated to the logged caregiver
	 * @param caregiverId - caregiver's Id to select 
	 * @return Caregiver with the caregiverId
	 */
	@PostMapping("/caregiver/outside")
	public Caregiver getCaregiverOutsideById(@RequestBody String caregiverId) {
		return caregiver.getCaregiverOutsideById(caregiverId);
	}
	
	/**
	 * Gets a request with given id
	 * @param token - session ID associated to the logged caregiver
	 * @param caregiverId - caregiver's Id to select 
	 * @return Caregiver with the caregiverId
	 */
	@PostMapping("/request")
	public Request getRequestById(@RequestBody String requestId) {
		return request.getRequestByID(requestId);
	}
	
	/**
	 * Registers a request into the application
	 * @param requestData - data needed for caregiver register
	 */
	@PostMapping("/createrequest")
	public String createUploadRequest(
			@RequestParam String token,
			@RequestBody Request requestData) {
		return request.createUploadRequest(requestData);
	}
	
	/**
	 * Gets all categories from DB
	 * @param token - session token associated to the 
	 * 				  caregiver who made the request
	 * @return CategoryList with all defined categories
	 */
	@GetMapping("/categories")
	public CategoryList retrieveCategories(
			@RequestParam String token) {
		return category.retrieveCategories(
				loggedSessions, token);
	}
	
	/**
	 * Gets all categories from DB
	 * @param token - session token associated to the 
	 * 				  caregiver who made the request
	 * @return TranslateList with all defined categories translated
	 */
	@GetMapping("/categories/translations")
	public CategoryTranslation retrieveCategoriesTranslation(
			@RequestParam String token) {
		return category.retrieveCategoriesTranslations(
				loggedSessions, token);
	}

	/**
	 * Returns caregiver ID with given email
	 * @param email - from caregiver with given ID
	 * @return ResponseBasic with caregiver ID
	 */
	@GetMapping("/caregiver/id")
	public ResponseBasic getCaregiverByEmail(@RequestParam String email) {
		return caregiver.getCaregiverIDByEmail(email);
	}

	/**
	 * Registers a caregiver into the application
	 * @param caregiverRegisterData - data needed for caregiver register
	 */
	@PostMapping("/register")
	public void caregiverRegister(
			@RequestBody CaregiverRegisterData caregiverRegisterData) {
		app.register(caregiverRegisterData);
	}

	/**
	 * Logins a caregiver into the application
	 * @param loginData - data needed for caregiver login
	 * @return ResponseBasic with session token
	 */
	@PostMapping("/login")
	public ResponseBasic login(@RequestBody LoginData loginData) {
		return app.login(loggedSessions, loginData);
	}

	/**
	 * Logouts a caregiver from the application,
	 * disabling the active session ID
	 * @param token - session ID associated to the caregiver
	 * 				  who wants to logout
	 */
	@GetMapping("/logout")
	public void logout(@RequestParam String token) {
		app.logout(loggedSessions, token);
	}

	/**
	 * Gets a caregiver with given session token
	 * @param token - session ID associated to the logged caregiver
	 * @return Caregiver associated to session token
	 */
	@GetMapping("/caregiver")
	public Caregiver getCaregiver(@RequestParam String token) {
		return caregiver.getCaregiverByToken(loggedSessions, token);
	}
	/**
	 * Gets a caregiver with given id
	 * @param token - session ID associated to the logged caregiver
	 * @param caregiverId - caregiver's Id to select 
	 * @return Caregiver with the caregiverId
	 */
	@PostMapping("/caregiver")
	public Caregiver getCaregiverById(@RequestParam String token,
			@RequestBody String caregiverId) {
		return caregiver.getCaregiverById(loggedSessions, token, caregiverId);
	}
	/**
	 * Gets list of all caregiver Patients with given session token
	 * @param token - session ID associated to the logged caregiver
	 * @return PatientList with all patients associated to the caregiver
	 */
	@GetMapping("/caregiver/patients")
	public PatientList getCaregiverPatients(@RequestParam String token) {
		return caregiver.getCaregiverPatientsByToken(loggedSessions, token, null, null);
	}
	
	/**
	 * Gets list of all caregiver Patients with given session token
	 * @param token - session ID associated to the logged caregiver
	 * @param patientId - patient Id to exclude of the returned list
	 * @return PatientList with all patients associated to the caregiver
	 */

	@PostMapping("/caregiver/patients")
	public PatientList getCaregiverPatientsById(@RequestParam String token, @RequestParam String patientId, @RequestBody String caregiverId) {
		return caregiver.getCaregiverPatientsByToken(loggedSessions, token, caregiverId, patientId);
	}

	/**
	 * Gets all caregivers associated to a patient by patient ID
	 * @param token - session token associated to the caregiver who made the request
	 * @param patientId - ID of the patient we want to get caregivers from
	 * @return PatientCaregiverList whith all caregivers associated to the patient
	 * 		   and their responsabilities with the patient
	 */
	@GetMapping("/patient/caregivers")
	public PatientCaregiverList getPatientCaregivers(
			@RequestParam String token,
			@RequestParam String patientId) {
		return patient.getPatientCaregiversByPatientID(
				loggedSessions, token, patientId);
	}

	/**
	 * Gets all observations associated to a patient by patient ID
	 * @param token - session token associated to the caregiver who made the request
	 * @param patientId - ID of the patient we want to get observations from
	 * @return PatientObservationList with all observations
	 * 		   associated to the patient
	 */
	@GetMapping("/patient/observations")
	public PatientObservationList getPatientObservations(
			@RequestParam String token, @RequestParam String patientId) {
		return observation
				.getPatientObservationsByPatientId(loggedSessions, token, patientId);
	}

	/**
	 * Adds a new patient observation with the given data
	 * @param token - session token associated to the caregiver who made the request
	 * @param addPatientObservationData - all data needed to add the observation to
	 * 									  the DB and correct patient
	 */
	@PostMapping("/patient/observation")
	public void addPatientObservation(
			@RequestParam String token,
			@RequestBody AddPatientObservationData addPatientObservationData) {
		observation
				.addPatientObservation(loggedSessions, token, addPatientObservationData);
	}

	/**
	 * Deletes a patient observation from the DB with the given ID
	 * @param token - session token associated to the caregiver who made the request
	 * @param observationId - ID of the observation to be deleted
	 */
	@GetMapping("/patient/observation/delete")
	public void deletePatientObservation(
			@RequestParam String token,
			@RequestParam String observationId) {
		observation
				.deletePatientObservationById(loggedSessions, token, observationId);
	}

	/**
	 * Updates a patient observation from the DB with given data
	 * @param token - session token associated to the caregiver who made the request
	 * @param patientObservation - observation data needed for update
	 */
	@PostMapping("/patient/observation/update")
	public void updatePatientObservation(
			@RequestParam String token,
			@RequestBody PatientObservation patientObservation) {
		observation
				.updatePatientObservation(loggedSessions, token, patientObservation);
	}

	/**
	 * Adds a new patient application personal image into the server
	 * @param token - session token associated to the caregiver who made the request
	 * @param patientId - ID of the patient whom the image belongs
	 * @param addImageData - all data needed to add image to the server
	 */
	@PostMapping("/patient/image/personal")
	public void addPatientPersonalImage(
			@RequestParam String token,
			@RequestParam String patientId,
			@RequestBody AddImageData addImageData) {
		image.addPatientPersonalImage(
				loggedSessions, token, patientId, addImageData);
	}

	/**
	 * Adds a new caregiver application personal image into the server
	 * @param token - session token associated to the caregiver who made the request
	 * @param addImageData - all data needed to add image to the server
	 */
	@PostMapping("/caregiver/image/personal")
	public void addCaregiverPersonalImage(
			@RequestParam String token,
			@RequestBody AddImageData addImageData) {
		image.addCaregiverPersonalImage(
				loggedSessions, token, addImageData);
	}

	//Gets a patient personal image given patient #Testes-Pedro ===============================================

	/**
	 * Get defaut session from System
	 * @param token - session token associated to the
	 * 				  caregiver who made the request
	 * @param patientId - ID of the patient we want to get images from
	 * @param direction - number of the next image to go
	 * @return PersonalImageList with all images associated to the patient
	 * 					         to make a default session
	 */
	@GetMapping("/patient/images/session")
	public PersonalImageList getSessionPatientPersonalImage(
			@RequestParam String token,
			@RequestParam String patientId,
			@RequestParam String direction) {
		return image.getSessionPatientPersonalImage(
				loggedSessions, token, patientId, direction);
	}

	/**
	 * Get defaut session from System
	 * @param token - session token associated to the
	 * 				  caregiver who made the request
	 * @param sessionId - ID of the session we want to get images from
	 * @param direction - number of the next image to go
	 * @return PersonalImageList with all images associated to the patient
	 * 					         to make a default session
	 */
	@GetMapping("/session/running/image")
	public RtSessionImage getRunningRtSessionImage(
			@RequestParam String token,
			@RequestParam String sessionId,
			@RequestParam String direction) {
		return image.getRunningRtSessionImage(
				loggedSessions, token, sessionId, direction);
	}


	/**
	 * Get defaut session from System
	 * @param token - session token associated to the
	 * 				  caregiver who made the request
	 * @param sessionId - ID of the session we want to get images from
	 */
	@PostMapping("/session/update/duration")
	public void updateRtSessionDuration(
			@RequestParam String token,
			@RequestBody SessionFeedback sessionFeedback) {
		this.session.updateRtSessionDuration(
				loggedSessions, token, sessionFeedback);
	}

	/**
	 * Get defaut session from System
	 * @param token - session token associated to the
	 * 				  caregiver who made the request
	 * @param sessionId - ID of the session we want to get images from
	 */
	@PostMapping("/session/update/feedback")
	public void updateRtSessionFeedback(
			@RequestParam String token,
			@RequestBody SessionFeedback sessionFeedback) {
		this.session.updateRtSessionFeedback(
				loggedSessions, token, sessionFeedback);
	}


	@PostMapping("/session/finish")
	public void finishedSession(
			@RequestParam String token,
			@RequestParam String templateId,
			@RequestParam String patientId,
			@RequestBody SessionFeedback sessionFeedback) {
		this.session.finishSession(
				loggedSessions, token, templateId, patientId, sessionFeedback);
	}


	/**
	 * Get defaut session from System
	 * @param token - session token associated to the
	 * 				  caregiver who made the request
	 * @param sessionId - ID of the session we want to get images from
	 */
	@GetMapping("/session/feedback")
	public SessionFeedback getRtSessionFeedback(
			@RequestParam String token,
			@RequestParam String session_Id) {
		return this.session.getRtSessionFeedback(
				loggedSessions, token, session_Id);
	}


	/**
	 * Get defaut session from System
	 * @param token - session token associated to the
	 * 				  caregiver who made the request
	 * @param sessionId - ID of the session we want to get images from
	 * @param direction - number of the next image to go
	 * @return PersonalImageList with all images associated to the patient
	 * 					         to make a default session
	 */
	@PostMapping("/session/running/image/feedback/update")
	public void updateRunningRtSessionImageFeedback(
			@RequestParam String token,
			@RequestBody RtSessionImage rtSessionImage) {
		this.image.updateRunningRtSessionImageFeedback(
				loggedSessions, token, rtSessionImage);
	}

	/**
	 * Gets all patient associated personal application images from DB
	 * @param token - session token associated to the
	 * 				  caregiver who made the request
	 * @param patientId - ID of the patient we want to get images from
	 * @return PersonalImageList with all images associated to the patient
	 */
	@GetMapping("/patient/images/personal")
	public PersonalImageList getPatientPersonalImages(
			@RequestParam String token,
			@RequestParam String patientId) {
		return image.getPatientPersonalImages(
				loggedSessions, token, patientId);
	}

	/**
	 * Gets all caregiver associated personal application images from DB
	 * @param token - session token associated to the
	 * 				  caregiver who made the request
	 * @param patientId - ID of the patient we want to get images from
	 * @return PersonalImageList with all images associated to the patient
	 */
	@GetMapping("/caregiver/images/personal")
	public PersonalImageList getPatientPersonalImages(
			@RequestParam String token) {
		return image.getCaregiverPersonalImages(
				loggedSessions, token);
	}

	/**
	 * Adds a new patient into the DB and associates him
	 * Gets all images associated application images from DB
	 * @param token - session token associated to the 
	 * 				  caregiver who made the request
	 * @param patientId - ID of the patient we want to get images from
	 * @return PersonalImageList with all images associated to the patient
	 */
	@PostMapping("/images")
	public PersonalImageList getImagesByCategory(
			@RequestParam String token,
			@RequestBody ImagesFilterData imagesFilters) {
		return image.getImagesByCategory(
				loggedSessions, token, imagesFilters);
	}

	/**
	 * Adds a new patient into the DB and associates him 
	 * to the current caregiver logged in (with given token)
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param patientRegisterData - all data need to add patient
	 * 								and patient caregiver relation
	 */
	@PostMapping("/caregiver/patient")
	public ResponseBasic addCaregiverPatient(
			@RequestParam String token,
			@RequestBody CaregiverPatientRegisterData caregiverPatientRegisterData) {
		return caregiver.addCaregiverPatient(
				loggedSessions, token, caregiverPatientRegisterData);
	}

	/**
	 * Gets a patient with given ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param patientId - ID associated to the patient
	 * 					  we want to retrieve
	 * @return Patient associated to the given NIF
	 */
	@GetMapping("/patient")
	public Patient getPatientById(
			@RequestParam String token,
			@RequestParam String patientId) {
		return patient.getPatientByID(loggedSessions, token, patientId);
	}

	/**
	 * Gets a patient name with given ID
	 * @param token - session token associated to the 
	 * 				  caregiver logged in
	 * @param patientId - ID associated to the patient 
	 * 					  we want to retrieve
	 * @return Patient Name associated to the given NIF
	 */
	@GetMapping("/patient/name")
	public ResponseBasic getPatientNameById(
			@RequestParam String token, 
			@RequestParam String patientId) {
		return patient.getPatientNameByID(loggedSessions, token, patientId);
	}

	/**
	 * Gets a session with given caregiver ID
	 * @param token - session token associated to the 
	 * 				  caregiver logged in
	 * @return Session associated to the given CaregiverID and PatientID
	 */

	@GetMapping("/session/caregiver")
	public SessionList getSessionListByCaregiver(
			@RequestParam String token) {
		return session.getSessionListByCaregiver(loggedSessions, token);
	}

	/**
	 * Gets sessions with given caregiver ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @return Session associated to the given CaregiverID
	 */
	@GetMapping("/caregiver/history")
	public SessionList getSessionListByCaregiverHistory(
			@RequestParam String token) {
		return session.getSessionListByCaregiverHistory(loggedSessions, token);
	}

	/**
	 * Gets a session with given session ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @return Session associated to the given SessionID
	 */
	@GetMapping("/caregiver/history/summary")
	public RtSessionImageList getSessionPatientImageInformation(
			@RequestParam String token,
			@RequestParam String sessionId) {
		return image.getSessionPatientImageInformation(
				loggedSessions, token, sessionId);
	}

	/**
	 * Gets the images of the session with given session ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @return Images associated to the given SessionID
	 */
	@GetMapping("/caregiver/history/summary/images")
	public RtSessionImageList getSessionImagesInformation(
			@RequestParam String token,
			@RequestParam String sessionId) {
		return image.getSessionPatientImageInformation(
				loggedSessions, token, sessionId);
	}

	/**
	 * Get the sessions with specific month
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @return Sessions in the filtered month
	 */
    @GetMapping("/caregiver/statistics")
    public SessionList getSessionListByDateCaregiver(
            @RequestParam String token,
			@RequestParam String filter,
			@RequestParam String filterYear,
			@RequestParam String patientId) {
        return session.getSessionListByDateCaregiver(loggedSessions, token, filter, filterYear, patientId);
    }

	/**
	 * Get the sessions with specific month
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @return Sessions in the filtered month
	 */
	@GetMapping("/patient/statistics")
	public SessionList getSessionListByDatePatient(
			@RequestParam String token,
			@RequestParam String patientId,
			@RequestParam String filterMonth,
			@RequestParam String filterYear) {
		return session.getSessionListByDatePatient(loggedSessions, token, patientId, filterMonth, filterYear);
	}

	/**
	 * Gets a session with given patient ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param patientId - ID associated to the patient
	 * 					  we want to retrieve
	 * @return Session associated to the given CaregiverID and PatientID
	 */
	@GetMapping("/session/patient")
	public SessionList getSessionListByPatient(
			@RequestParam String token,
			@RequestParam String patientId) {
		return session.getSessionListByPatient(loggedSessions, token, patientId);
	}
	/**
	 * Get imges list from a template session id
	 * @param token - session token associated to the 
	 * 				  caregiver who made the request
	 * @param templateSessionId - ID of the template session we want to get images from
	 * @return PersonalImageList with all images associated to the template session
	 */
	@GetMapping("/template/session/images")
	public PersonalImageList getImagesByTemplateSessionId(
			@RequestParam String token, 
			@RequestParam String templateSessionId) {
		return image.getImagesByTemplateSessionId(
				loggedSessions, token, templateSessionId);
	}

	/**
	 * Gets a session with given patient ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param patientId - ID associated to the patient
	 * 					  we want to retrieve
	 * @return Session associated to the given CaregiverID and PatientID
	 */

	@GetMapping("/template/session/patient")
	public TemplateSessionList getTemplateSessionList(
			@RequestParam String token,
			@RequestParam String patientId,
			@RequestParam String filter,
			@RequestParam String count) {
		return templateSession.getTemplateSessionList(loggedSessions, token, patientId, filter, count);
	}
	/**
	 * Gets list of all caregiver Patients for a template session with given session token
	 * @param token - session ID associated to the logged caregiver
	 * @param caregiverId - selected caregiver Id 
	 * @param templateSessionId - selected template session Id
	 * @return PatientList with all patients associated to the caregiver
	 */
	@GetMapping("/template/session/patients")
	public PatientList getCaregiverPatientsByTemplateSessionId(
			@RequestParam String token,
			@RequestParam String caregiverId,
			@RequestParam String templateSessionId) {
		return templateSession.getCaregiverPatientsByTemplateSessionId(loggedSessions, token, caregiverId, templateSessionId);		
		//return caregiver.getCaregiverPatientsByToken(loggedSessions, token, caregiverId, templateSessionId);
	}

	/**
	 * Save list of all caregiver Patients for a template session with given session token
	 * @param token - session ID associated to the logged caregiver 
	 * @param templateSessionId - selected template session Id
	 * @param PatientList with all patients associated to the caregiver
	 * @return templateSessionId if the service has no error
	 */
	@PostMapping("/template/session/patients")
	public ResponseBasic updateCaregiverPatientsByTemplateSessionId(
			@RequestParam String token,
			@RequestParam String templateSessionId,
			@RequestBody String[] patientList) {
		return templateSession.updateCaregiverPatientsByTemplateSessionId(loggedSessions, token, templateSessionId, patientList);		
	}

	/**
	 * Gets list of all caregiver Patients for a template session with given session token
	 * @param token - session ID associated to the logged caregiver
	 * @param caregiverId - selected caregiver Id 
	 * @param templateSessionId - selected template session Id
	 * @return PatientList with all patients associated to the caregiver
	 */
	@GetMapping("/template/session/caregivers")
	public PatientCaregiverList getCaregiversByTemplateSessionId(
			@RequestParam String token,
			@RequestParam String templateSessionId,
			@RequestParam String patientId) {
		return templateSession.getCaregiversByTemplateSessionId(loggedSessions, token, templateSessionId, patientId);
	}

	/**
	 * Save list of all shared caregiver for a template session with given session token
	 * @param token - session ID associated to the logged caregiver 
	 * @param templateSessionId - selected template session Id
	 * @param caregiverList with all caregivers to be associated to the selected template session
	 * @return templateSessionId if the service has no error
	 */
	@PostMapping("/template/session/caregivers")
	public ResponseBasic updateCaregiversByTemplateSessionId(
			@RequestParam String token,
			@RequestParam String templateSessionId,
			@RequestBody String[] caregiverList) {
		return templateSession.updateCaregiversByTemplateSessionId(loggedSessions, token, templateSessionId, caregiverList);		
	}

	/**
	 * Creates a template session into the application
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param caregiverRegisterData - data needed for template session creation
	 */
	@PostMapping("/template/session/create")
	public ResponseBasic createTemplateSession(
			@RequestParam String token,
			@RequestBody TemplateSessionData templateSessionData) {
		return templateSession.createTemplateSession(loggedSessions, token, templateSessionData);
	}

	/**
	 * Updates a template session into the application
 	 * @param token - session token associated to the 
	 * 				  caregiver logged in
	 * @param templateSessionId - template session id to update
	 * @param caregiverRegisterData - data needed for template session creation
	 */
	@PostMapping("/template/session/update")
	public ResponseBasic updateTemplateSession(
			@RequestParam String token,
			@RequestParam String templateSessionId,
			@RequestBody TemplateSessionData templateSessionData) {
		return templateSession.updateTemplateSession(loggedSessions, token, templateSessionData, templateSessionId);
	}

	/**
	 * Select images for a template session into the application
 	 * @param token - session token associated to the 
	 * 				  caregiver logged in
	 * @param caregiverRegisterData - data needed for template session creation
	 */
	@PostMapping("/template/session/selectImageList")
	public RtSessionCreateDataList selectImages4TemplateSession(
			@RequestParam String token,			
			@RequestBody TemplateSessionData templateSessionData) {
		return image.selectImages4TemplateSession(loggedSessions, token, templateSessionData);
	}

	/**
	 * Removes a template session
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param templateSessionId - ID of the templateSession to be started
	 */
	@GetMapping("/template/session/start")
	public ResponseBasic startSessionFromTemplateSession(
			@RequestParam String token,
			@RequestParam String id,
			@RequestParam String patientId) {
		return templateSession.startSessionFromTemplateSession(
				loggedSessions, token, id, patientId);
	}

	/**
	 * Removes a template session
	 * @param token - session token associated to the 
	 * 				  caregiver logged in
	 * @param templateSessionId - ID of the templateSession to be deleted
	 * @param patientId - ID of the patient to be deleted
	 */
	@GetMapping("/template/session/remove")
	public void removeTemplateSession(
			@RequestParam String token, 
			@RequestParam String id,
			@RequestParam String patientId) { 
		if (patientId.equals("null")) {
			templateSession.removeTemplateSession(
					loggedSessions, token, id, null);
		} else {
			templateSession.removeTemplateSession(
					loggedSessions, token, id, patientId);			
		}
	}
	/**
	 * Updates a patient personal application image
	 * with given patient ID and image data
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param patientId - ID of the patient associated to the image
	 * @param personalImage - image data for update
	 */
	@PostMapping("/patient/image/personal/update")
	public void updatePatientImage(
			@RequestParam String token,
			@RequestParam String patientId,
			@RequestBody PersonalImage personalImage) {
		image.updatePatientPersonalImage(
				loggedSessions, token, patientId, personalImage);
	}

	/**
	 * Updates a caregiver personal application image
	 * with given token and image data
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param personalImage - image data for update
	 */
	@PostMapping("/caregiver/image/personal/update")
	public void updateCaregiverImage(
			@RequestParam String token,
			@RequestBody PersonalImage personalImage) {
		image.updateCaregiverPersonalImage(
				loggedSessions, token, personalImage);
	}

	/**
	 * Gets a patient personal application image with given
	 * patient ID and image ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param patientId - ID associated to the patient
	 *                    we want to get image from
	 * @param imageId - ID of the image we want to retrieve
	 * @return all image data related to image and patient
	 */
	@GetMapping("/patient/image/personal")
	public PersonalImage getPatientPersonalImage(
			@RequestParam String token,
			@RequestParam String patientId,
			@RequestParam String imageId) {
		return image.getPatientPersonalImage(
				loggedSessions, token, patientId, imageId);
	}

	/**
	 * Gets a caregiver personal application image with given
	 * token and image ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param imageId - ID of the image we want to retrieve
	 * @return all image data related to image and patient
	 */
	@GetMapping("/caregiver/image/personal")
	public PersonalImage getCaregiverPersonalImage(
			@RequestParam String token,
			@RequestParam String imageId) {
		return image.getCaregiverPersonalImage(
				loggedSessions, token, imageId);
	}

	/**
	 * Creates a notification for a patient share request
	 * from the current logged caregiver to the caregiver
	 * with the given email
	 * @param token - token associated to the caregiver
	 * 				  currently logged in
	 * @param receiverEmail - email of the caregiver who we
	 * 						  want to share a patient with
	 * @param patientId - ID of the patient we want to share
	 */
	@GetMapping("/caregiver/notify/share")
	public void caregiverNotifyShare(
			@RequestParam String token,
			@RequestParam String receiverEmail,
			@RequestParam String patientId) {
		notification.notifyShare(
				loggedSessions, token, receiverEmail, patientId);
	}

	/**
	 * Notify sender caregiver that the share request was accepted
	 * @param token - token associated to the caregiver
	 * 				  currently logged in
	 * @param senderEmail - email of the caregiver who  sent share request
	 * @param patientId - ID of the patient that was shared
	 */
	@GetMapping("/caregiver/notify/share/accept")
	public void caregiverNotifyAcceptedShare(
			@RequestParam String token,
			@RequestParam String senderEmail,
			@RequestParam String patientId) {
		notification.notifyAcceptedShare(
				loggedSessions, token, senderEmail, patientId);
	}

	/**
	 * Notify sender caregiver that the share request was denied
	 * @param token - token associated to the caregiver
	 * 				  currently logged in
	 * @param senderEmail - email of the caregiver who  sent share request
	 * @param patientId - ID of the patient that was shared
	 */
	@GetMapping("/caregiver/notify/share/deny")
	public void caregiverNotifyDeniedShare(
			@RequestParam String token,
			@RequestParam String senderEmail,
			@RequestParam String patientId) {
		notification.notifyDeniedShare(
				loggedSessions, token, senderEmail, patientId);
	}

	/**
	 * Creates a notification for a patient primary care transfer
	 * request from the current logged caregiver to the caregiver
	 * with the given email
	 * @param token - token associated to the caregiver
	 * 				  currently logged in
	 * @param senderEmail - email of the caregiver who  sent share request
	 * @param patientId - ID of the patient that was shared
	 */
	@GetMapping("/caregiver/notify/primary/transfer")
	public void caregiverPrimaryCareTransfer(
			@RequestParam String token,
			@RequestParam String receiverEmail,
			@RequestParam String patientId) {
		notification.notifyPrimaryCareTransfer(
				loggedSessions, token, receiverEmail, patientId);
	}

	/**
	 * Notify sender caregiver that the primary care
	 * transfer was accepted
	 * @param token - token associated to the caregiver
	 * 				  currently logged in
	 * @param senderEmail - email of the caregiver who  sent share request
	 * @param patientId - ID of the patient that was shared
	 */
	@GetMapping("/caregiver/notify/primary/accept")
	public void caregiverNotifyAcceptedPrimaryCare(
			@RequestParam String token,
			@RequestParam String senderEmail,
			@RequestParam String patientId) {
		notification.notifyAcceptedPrimaryCare(
				loggedSessions, token, senderEmail, patientId);
	}

	/**
	 * Notify sender caregiver that the primary care
	 * transfer was denied
	 * @param token - token associated to the caregiver
	 * 				  currently logged in
	 * @param senderEmail - email of the caregiver who  sent share request
	 * @param patientId - ID of the patient that was shared
	 */
	@GetMapping("/caregiver/notify/primary/deny")
	public void caregiverNotifyDeniedPrimaryCare(
			@RequestParam String token,
			@RequestParam String senderEmail,
			@RequestParam String patientId) {
		notification.notifyDeniedPrimaryCare(
				loggedSessions, token, senderEmail, patientId);
	}

	/**
	 * Notify another caregiver that the primary caregiver wants
	 * to leave patient care and give him the patient primar care
	 * @param token - token associated to the caregiver
	 * 				  currently logged in
	 * @param receiverEmail - email of the caregiver to be the new primary
	 * @param patientId - ID of the patient where the action will be executed
	 */
	@GetMapping("/caregiver/notify/primary/leave")
	public void caregiverNotifyPrimaryLeaveCare(
			@RequestParam String token,
			@RequestParam String receiverEmail,
			@RequestParam String patientId) {
		notification.notifyPrimaryLeaveCare(
				loggedSessions, token, receiverEmail, patientId);
	}

	/**
	 * Notify another caregiver that the primary caregiver leave request
	 * was accepted by the other caregiver
	 * @param token - token associated to the caregiver
	 * 				  currently logged in
	 * @param senderEmail - email of the caregiver who wanted to leave the patient
	 * @param patientId - ID of the patient where the action will be executed
	 */
	@GetMapping("/caregiver/notify/primary/leave/accept")
	public void caregiverNotifyAcceptedPrimaryLeaveCare(
			@RequestParam String token,
			@RequestParam String senderEmail,
			@RequestParam String patientId) {
		notification.notifyAcceptedPrimaryLeaveCare(
				loggedSessions, token, senderEmail, patientId);
	}

	/**
	 * Notify another caregiver that the primary caregiver leave request
	 * was denied by the other caregiver
	 * @param token - token associated to the caregiver
	 * 				  currently logged in
	 * @param senderEmail - email of the caregiver who wanted to leave the patient
	 * @param patientId - ID of the patient where the action will be executed
	 */
	@GetMapping("/caregiver/notify/primary/leave/deny")
	public void caregiverNotifyDeniedPrimaryLeaveCare(
			@RequestParam String token,
			@RequestParam String senderEmail,
			@RequestParam String patientId) {
		notification.notifyDeniedPrimaryLeaveCare(
				loggedSessions, token, senderEmail, patientId);
	}

	/**
	 * Removes a primary caregiver from a patient and assigns a new one
	 * @param token - token associated to the caregiver
	 * 				  to be the new primary
	 * @param caregiverId - email of the caregiver to be removed
	 * @param patientId - ID of the patient where the action will be executed
	 */
	@GetMapping("/caregiver/patient/primary/leave")
	public void caregiverPrimaryLeaveCare(
			@RequestParam String token,
			@RequestParam String caregiverId,
			@RequestParam String patientId) {
		caregiver.primaryLeaveCare(
				loggedSessions, token, caregiverId, patientId);
	}

	/**
	 * Notify sender caregiver that the primary care
	 * transfer was denied
	 * @param token - token associated to the caregiver
	 * 				  currently logged in
	 * @param senderEmail - email of the caregiver who  sent share request
	 * @param patientId - ID of the patient that was shared
	 */
	@GetMapping("/caregiver/notify/caregiver/removed")
	public void caregiverNotifyRemovedFromPatient(
			@RequestParam String token,
			@RequestParam String receiverEmail,
			@RequestParam String patientId) {
		notification.notifyRemovedFromPatient(
				loggedSessions, token, receiverEmail, patientId);
	}

	/**
	 * Associates an existing patient to other caregiver
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param caregiverPatientAssociationData - all data need to associate new patient
	 */
	@PostMapping("/caregiver/patient/share")
	public void associateExistingPatient(
			@RequestParam String token,
			@RequestBody CaregiverPatientAssociationData caregiverPatientAssociationData) {
		caregiver.associateExistingPatient(
				loggedSessions, token, caregiverPatientAssociationData);
	}

	/**
	 * Transfers a primary care to another caregiver
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param oldPrimary - old primary caregiver ID
	 * @param patientId - ID of the patient where the action
	 * 					  will be executed
	 */
	@GetMapping("/caregiver/patient/primary/transfer")
	public void transferPrimaryCare(
			@RequestParam String token,
			@RequestParam String oldPrimary,
			@RequestParam String patientId) {
		caregiver.transferPrimaryCare(
				loggedSessions, token, oldPrimary, patientId);
	}

	/**
	 * A caregiver leaves a patient care
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param patientId - ID of the patient where the action
	 * 					  will be executed
	 */
	@GetMapping("/caregiver/patient/leave")
	public void transferPrimaryCare(
			@RequestParam String token,
			@RequestParam String patientId) {
		caregiver.leavePatientCare(
				loggedSessions, token, patientId);
	}

	/**
	 * Removes a caregiver from a patient
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param caregiverId - ID of the caregiver to be deleted
	 * @param patientId - ID of the patient where the action
	 * 					  will be executed
	 */
	@GetMapping("/caregiver/patient/leave/forced")
	public void removeCaregiverFromPatient(
			@RequestParam String token,
			@RequestParam String caregiverId,
			@RequestParam String patientId) {
		caregiver.removeCaregiverFromPatient(
				loggedSessions, token, caregiverId, patientId);
	}

	/**
	 * Updates a caregiver with the given data
	 * @param token - session token associated to the
	 * 				  caregiver logged in and we want
	 * 				  to update
	 * @param updatedCaregiver - all data needed for update
	 */
	@PostMapping("/caregiver/update")
	public void updateCaregiver(
			@RequestParam String token,
			@RequestBody Caregiver updatedCaregiver) {
		caregiver.updateCaregiver(loggedSessions, token, updatedCaregiver);
	}

	/**
	 * Gets all chats associated to patients that are associated to
	 * the current logged caregiver
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @return all needed timestamps and data of the chats associated to
	 * 		   patients that are associated to the current caregiver
	 */
	@GetMapping("/caregiver/chats")
	public CaregiverPatientChatList getCaregiverPatientMessages(
			@RequestParam String token) {
		return message.getCaregiverPatientChats(loggedSessions, token);
	}

	/**
	 * Gets all messages associated to a patient chat that are associated to
	 * the current logged caregiver
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param chatId - ID of the chat we want to retrieve messages from
	 * @return all messages of the patient chat with given ID associated to
	 * 		   to the current caregiver
	 */
	@GetMapping("/caregiver/chat/messages")
	public PatientChatMessageList getPatientChatMessages(
			@RequestParam String token,
			@RequestParam String chatId) {
		return message.getPatientChatMessages(
				loggedSessions, token, chatId);
	}

	/**
	 * Maps chat with given chat ID and inserts a new message
	 * @param chatId - ID of the chat we want to send message to
	 * @param messageData - all data related to the message we
	 * 						want to send
	 * @return new message sent to the chat
	 */
	@MessageMapping("/send/{chatId}")
	@SendTo("/topic/{chatId}")
	public PatientChatMessage patientMessages(
			@DestinationVariable String chatId,
			PatientChatMessageData messageData){
		return message.insertPatientChatMessage(chatId, messageData);
	}

	/**
	 * Updates last message read date for caregiver with given data
	 * which has chat and caregiver ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param updateData - all data needed to execute the update
	 * 					   of last message read for a caregiver
	 * 					   on a chat
	 */
	@PostMapping("/caregiver/chat/messages/last/update")
	public void updateLastMessageReadByCaregiverOnChat(
			@RequestParam String token,
			@RequestBody CaregiverLastMessageRead updateData) {
		message.updateLastMessageReadByCaregiverOnChat(
				loggedSessions,token, updateData);
	}

	/**
	 * Gets all current caregiver (sender and receiver) notifications
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @return CaregiverNotificationList with all notification that were sent
	 * 		   and received by this caregiver
	 */
	@GetMapping("/caregiver/notifications")
	public CaregiverNotificationList getCaregiverNotifications(
			@RequestParam String token) {
		return notification.getCaregiverNotifications(
				loggedSessions, token);
	}

	/**
	 * Deletes a notification with given ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param notificationId - ID of the notification to be deleted
	 */
	@GetMapping("/caregiver/notification/delete")
	public void deleteNotification(
			@RequestParam String token,
			@RequestParam String notificationId) {
		notification.deleteNotification(
				loggedSessions,token,notificationId);
	}

	/**
	 * Deletes a patient personal application image
	 * with given patient ID and image ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param patientId - ID of the patient associated to the image
	 * @param imageId - ID of the image fir deletion
	 */
	@GetMapping("/patient/image/personal/delete")
	public void updatePatientImage(
			@RequestParam String token,
			@RequestParam String patientId,
			@RequestParam String imageId) {
		image.deletePatientPersonalImage(
				loggedSessions, token, patientId, imageId);
	}

	/**
	 * Deletes a caregiver personal application image
	 * with given token and image ID
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param imageId - ID of the image fir deletion
	 */
	@GetMapping("/caregiver/image/personal/delete")
	public void updateCaregiverImage(
			@RequestParam String token,
			@RequestParam String imageId) {
		image.deleteCaregiverPersonalImage(
				loggedSessions, token, imageId);
	}

	/**
	 * Validates a password for the caregiver
	 * with the given token
	 * @param token - of the caregiver
	 * @param password - to be validated
	 */
	@GetMapping("/caregiver/password")
	public void validatePassword(
			@RequestParam String token,
			@RequestParam String password) {
		app.validatePassword(
				loggedSessions, token, password);
	}

	/**
	 * Changes a password for the caregiver
	 * with the given token
	 * @param token - of the caregiver
	 * @param password - to be validated
	 */
	@GetMapping("/caregiver/password/update")
	public void changePassword(
			@RequestParam String token,
			@RequestParam String password) {
		app.changePassword(
				loggedSessions, token, password);
	}

	/**
	 * Updates a patient info with caregiver token
	 * and given patient data
	 * @param token - session token associated to the
	 * 				  caregiver logged in
	 * @param patient - all data needed to execute the update
	 * 					the patient update
	 */
	@PostMapping("/patient/update")
	public void updatePatientInfo(
			@RequestParam String token,
			@RequestBody Patient patient) {
		this.patient.updatePatientInfo(
				loggedSessions,token, patient);
	}
	@GetMapping("/caregiver/list")
	public CaregiverList getCaregiverList(
			@RequestParam String token) {
		return caregiver.getCaregiverList(loggedSessions, token);
	}
}