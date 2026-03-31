/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.sql.Date;

public class Image {

	//Definition
	private String id;
	private String createdById;
	private SimpleCaregiver createdBy;
	private String category;
	private String description;
	private boolean isPersonal;
	private boolean isPrivate;
	private String imageURL;
	private double negativeIntensity;
	private double neutralIntensity;
	private double positiveIntensity;
	private Date createdDate;
	private Date lastUpdatedDate;
	
	
	//Getter and setter for: id
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	//Getter and setter for: createdById
	public String getCreatedById() {
		return createdById;
	}

	public void setCreatedById(String createdById) {
		this.createdById = createdById;
	}
	
	//Getter and setter for: createdBy
	public SimpleCaregiver getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(SimpleCaregiver createdBy) {
		this.createdBy = createdBy;
	}
		
	//Getter and setter for: category
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
	
	//Getter and setter for: description
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	//Getter and setter for: isPersonal
	public boolean getIsPersonal() {
		return isPersonal;
	}

	public void setIsPersonal(boolean isPersonal) {
		this.isPersonal = isPersonal;
	}
	
	//Getter and setter for: isPrivate
	public boolean getIsPrivate() {
		return isPrivate;
	}

	public void setIsPrivate(boolean isPrivate) {
		this.isPrivate = isPrivate;
	}
	
	//Getter and setter for: imageURL
	public String getImageURL() {
		return imageURL;
	}

	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}
	
	//Getter and setter for: negativeIntensity
	public double getNegativeIntensity() {
		return negativeIntensity;
	}

	public void setNegativeIntensity(double negativeIntensity) {
		this.negativeIntensity = negativeIntensity;
	}
	
	//Getter and setter for: neutralIntensity
	public double getNeutralIntensity() {
		return neutralIntensity;
	}

	public void setNeutralIntensity(double neutralIntensity) {
		this.neutralIntensity = neutralIntensity;
	}
	
	//Getter and setter for: positiveIntensity
	public double getPositiveIntensity() {
		return positiveIntensity;
	}

	public void setPositiveIntensity(double positiveIntensity) {
		this.positiveIntensity = positiveIntensity;
	}
	
	//Getter and setter for: createdDate
	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	
	//Getter and setter for: lastUpdatedDate
	public Date getLastUpdatedDate() {
		return lastUpdatedDate;
	}

	public void setLastUpdatedDate(Date lastUpdatedDate) {
		this.lastUpdatedDate = lastUpdatedDate;
	}

	//For Logging Proposes
	@Override
	public String toString() {
		if (createdBy==null) {
			return String.format(
					"Image simplified [id=%s, imageURL=%s, ",
					id, imageURL);
		} else {
			return String.format(
				"Image [id=%s, createdById=%s, createdBy=%s, "
				+ "category=%s, description=%s, "
				+ "isPersonal=%b, isPrivate=%b, imageURL=%s, "
				+ "negativeIntensity=%f, neutralIntensity=%f, "
				+ "positiveIntensity=%f, "
				+ "createdDate=%s, lastUpdatedDate=%s]",
				id, createdById, createdBy.toString(), 
				category, description, 
				isPersonal, isPrivate, imageURL,
				negativeIntensity, neutralIntensity, positiveIntensity,
				createdDate, lastUpdatedDate);
		}
	}

	
	
}
