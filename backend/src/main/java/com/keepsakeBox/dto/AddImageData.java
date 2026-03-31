/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class AddImageData {

	//Definition
	private String category;
	private String description;
	private String imageURL;
	private String createdById;
	private boolean isPrivate;
	private boolean isFavorite;
	
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

	//Getter and setter for: imageURL
	public String getImageURL() {
		return imageURL;
	}

	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}
	
	//Getter and setter for: createdById
	public String getCreatedById() {
		return createdById;
	}

	public void setCreatedById(String createdById) {
		this.createdById = createdById;
	}
	
	//Getter and setter for: isPrivate
	public boolean getIsPrivate() {
		return isPrivate;
	}

	public void setIsPrivate(boolean isPrivate) {
		this.isPrivate = isPrivate;
	}
	
	//Getter and setter for: isFavorite
	public boolean getIsFavorite() {
		return isFavorite;
	}

	public void getIsFavorite(boolean isFavorite) {
		this.isFavorite = isFavorite;
	}

	//For Logging Proposes
	@Override
	public String toString() {
		return String.format(
				"AddImageData [category=%s, description=%s, "
				+ "imageURL=%s, createdById=%s"
				+ "isPrivate=%b, isFavorite=%b]",
				category, description, imageURL, 
				createdById, isPrivate, isFavorite);
	}
	
}