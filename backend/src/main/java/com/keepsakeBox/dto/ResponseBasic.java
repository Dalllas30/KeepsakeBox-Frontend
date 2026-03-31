/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class ResponseBasic {

	//Result set as string for basic responses
	private String result;

	//Getter and setter for: result
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"ResponseBasic [result=%s]",
				result);
	}
}