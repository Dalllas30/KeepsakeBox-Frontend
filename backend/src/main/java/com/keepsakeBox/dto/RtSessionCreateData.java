package com.keepsakeBox.dto;

public class RtSessionCreateData {
	//Definition
	private String id;
	private Image image;
	private boolean isFavorite;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Image getImage() {
		return image;
	}
	public void setImage(Image image) {
		this.image = image;
	}
	public boolean isFavorite() {
		return isFavorite;
	}
	public void setFavorite(boolean isFavorite) {
		this.isFavorite = isFavorite;
	}
	
	//For Logging Proposes
	@Override
	public String toString() {
		return String.format(
				"RtSessionCreateData [id=%s, image=%s, isFavorite=%b]",
				id, image.toString(), isFavorite);
	}
}
