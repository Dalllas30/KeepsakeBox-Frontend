/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

public class ImagePolarity {

	//Definition
	private double negativeIntensity;
	private double neutralIntensity;
	private double positiveIntensity;

	//Getter and setter for: negative
	public double getNegativeIntensity() {
		return negativeIntensity;
	}

	public void setNegativeIntensity(double negativeIntensity) {
		this.negativeIntensity = negativeIntensity;
	}

	public void addNegative(double negativeIntensity) {
		this.negativeIntensity += negativeIntensity;
	}

	//Getter and setter for: neutral
	public double getNeutralIntensity() {
		return neutralIntensity;
	}

	public void setNeutralIntensity(double neutralIntensity) {
		this.neutralIntensity = neutralIntensity;
	}

	public void addNeutralIntensity(double neutralIntensity) {
		this.neutralIntensity += neutralIntensity;
	}
	
	//Getter and setter for: positive
	public double getPositiveIntensity() {
		return positiveIntensity;
	}

	public void setPositiveIntensity(double positiveIntensity) {
		this.positiveIntensity = positiveIntensity;
	}

	public void addPositiveIntensity(double positiveIntensity) {
		this.positiveIntensity += positiveIntensity;
	}

	@Override
	public String toString() {
		return String.format(
				"ImagePolarity [negativeIntensity=%f, "
				+ "neutralIntensity=%f, positiveIntensity=%f]",
				negativeIntensity, neutralIntensity, positiveIntensity);
	}
}