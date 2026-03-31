/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import java.util.List;

public class PersonalImageList {
	
	//Definition
	private List<PersonalImage> images;

	//Getter and setter for: images
	public List<PersonalImage> getImages() {
		return images;
	}
	public void setImages(List<PersonalImage> images) {
		this.images = images;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"PersonalImageList [images=%s]", 
				images);
	}

}
