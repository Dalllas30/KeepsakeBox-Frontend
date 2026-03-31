package com.keepsakeBox.dto;

public class TemplateSessionImage {
	
	private String template_session_id;
	private String image_id;
	private Integer position_image;
	
	public TemplateSessionImage() {
	}
	
	public TemplateSessionImage(String id, Integer position) {
		image_id = id;
		position_image = position;
	}
	
	//public TemplateSessionImage(String template_session_id, String image_id, int position_image) {
	//	this.template_session_id = template_session_id;
	//	this.image_id = image_id;
	//	this.position_image = position_image;
	//}
	public String getTemplate_session_id() {
		return template_session_id;
	}
	public void setTemplate_session_id(String template_session_id) {
		this.template_session_id = template_session_id;
	}
	public String getImage_id() {
		return image_id;
	}
	public void setImage_id(String image_id) {
		this.image_id = image_id;
	}
	public Integer getPosition_image() {
		return position_image;
	}
	public void setPosition_image(Integer position_image) {
		this.position_image = position_image;
	}

	//For Logging Proposes
	@Override
	public String toString() {
		return String.format(
				"TemplateSessionImage [template_session_id=%s, image_id=%s, position_image=%s]",
				template_session_id, image_id, position_image);
	}	

}
