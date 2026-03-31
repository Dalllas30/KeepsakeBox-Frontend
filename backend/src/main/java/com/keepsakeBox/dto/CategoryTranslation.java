package com.keepsakeBox.dto;

import java.util.List;

public class CategoryTranslation {
	
	//Definition
	private List<String> categories;

	public List<String> getCategories() {
		return categories;
	}

	public void setCategories(List<String> categories) {
		this.categories = categories;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"CategoryTranslation [categories=%s]", 
				categories);
	}

}
