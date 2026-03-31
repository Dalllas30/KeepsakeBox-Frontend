/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class LoginData {

	//Definition
	private String email;
	private String password;

	//Getter and setter for: email
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	//Getter and setter for: password
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"LoginData [email=%s, password=%s]",
			    email, password);
	}
}