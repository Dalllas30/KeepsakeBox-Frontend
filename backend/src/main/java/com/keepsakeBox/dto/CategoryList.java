package com.keepsakeBox.dto;

import java.util.List;

public class CategoryList {
	
	//Definition
	private List<Category> categories;

	public List<Category> getCategories() {
		return categories;
	}

	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"CategoryList [categories=%s]", 
				categories);
	}

}
