package com.keepsakeBox.dto;

public class ImagesFilterData {
	private String caregiverId;
	private String patientId;
	private String category;
	private Boolean allPublicImage;
	private Boolean myImageAll;
	private Boolean myImagePrivate;
	private Boolean myImageFavorite;
	private Boolean patientImageAll;
	private Boolean patientImagePrivate;
	private Boolean patientImageFavorite;
	private String description;
	
	public String getCaregiverId() {
		return caregiverId;
	}
	public void setCaregiverId(String caregiverId) {
		this.caregiverId = caregiverId;
	}
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public Boolean getAllPublicImage() {
		return allPublicImage;
	}
	public void setAllPublicImage(Boolean allPublicImage) {
		this.allPublicImage = allPublicImage;
	}
	public Boolean getMyImageAll() {
		return myImageAll;
	}
	public void setMyImageAll(Boolean myImageAll) {
		this.myImageAll = myImageAll;
	}
	public Boolean getMyImagePrivate() {
		return myImagePrivate;
	}
	public void setMyImagePrivate(Boolean myImagePrivate) {
		this.myImagePrivate = myImagePrivate;
	}
	public Boolean getMyImageFavorite() {
		return myImageFavorite;
	}
	public void setMyImageFavorite(Boolean myImageFavorite) {
		this.myImageFavorite = myImageFavorite;
	}
	public Boolean getPatientImageAll() {
		return patientImageAll;
	}
	public void setPatientImageAll(Boolean patientImageAll) {
		this.patientImageAll = patientImageAll;
	}
	public Boolean getPatientImagePrivate() {
		return patientImagePrivate;
	}
	public void setPatientImagePrivate(Boolean patientImagePrivate) {
		this.patientImagePrivate = patientImagePrivate;
	}
	public Boolean getPatientImageFavorite() {
		return patientImageFavorite;
	}
	public void setPatientImageFavorite(Boolean patientImageFavorite) {
		this.patientImageFavorite = patientImageFavorite;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}

	//Logging Proposes
	@Override
	public String toString() {
	  return String.format(
	      "Image list filter [caregiverId=%s, patientId=%s, category='%s', "
	      + "description='%s' ]",
	      caregiverId, patientId, category, description);
	}

}
