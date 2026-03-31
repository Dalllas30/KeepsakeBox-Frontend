/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 */

package com.keepsakeBox.dto;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class InternalServerErrorException extends RuntimeException {
	
	//When it can not connect to server (extend Runtime)
	
	private static final long serialVersionUID = 1L;
	
	public InternalServerErrorException(String message) {
		super(message);
	}
}