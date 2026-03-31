/**
 * V2
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class SimpleCaregiver {
	
	//Definition
	private String id;
	private String name;
	private String email;
	
	//Getter and setter for: id
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	//Getter and setter for: name
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	//Getter and setter for: email
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	//Logging Proposes
	@Override
	public String toString() {
	  return String.format(
	      "SimpleCaregiver [id=%s, "
	      + "name=%s, email=%s]",
	      id, name, email);
	}

}
