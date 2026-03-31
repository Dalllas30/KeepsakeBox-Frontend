package com.keepsakeBox.dto;

public class Category {
	
	private String name;
	private Integer image_number;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getImage_number() {
		return image_number;
	}
	public void setImage_number(Integer image_number) {
		this.image_number = image_number;
	}
	
	//For logging proposes
		@Override
		public String toString() {
			return String.format(
					"Category [name=%s, image_number=%s]", 
					name, image_number);
		}

}
