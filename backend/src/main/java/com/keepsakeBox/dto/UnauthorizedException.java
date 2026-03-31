/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends RuntimeException {
	
	// When user or password are incorrect
	private static final long serialVersionUID = 1L;

	public UnauthorizedException(String message) {
		super(message);
	}
}