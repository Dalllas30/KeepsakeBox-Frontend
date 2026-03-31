/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class PersonalImage {

	//Definition
	private Image image;
	private boolean isFavorite;
	
	//Getter and setter for: image
	public Image getImage() {
		return image;
	}

	public void setImage(Image image) {
		this.image = image;
	}
	
	//Getter and setter for: isFavorite
	public boolean getIsFavorite() {
		return isFavorite;
	}

	public void setIsFavorite(boolean isFavorite) {
		this.isFavorite = isFavorite;
	}

	//For Logging Proposes
	@Override
	public String toString() {
		return String.format(
				"PersonalImage [image=%s, isFavorite=%s]",
				image.toString(), isFavorite);
	}

	

	

	

	
}