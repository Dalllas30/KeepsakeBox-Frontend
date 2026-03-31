/**
 * V2
 * @author Madalena Vagos - fc48667
 */

package com.keepsakeBox.rest;

import java.util.Base64;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

public class RestClient {

	public RestClient() {}

	public String sendRest(final String url, final Object data, final String method, final String auth)
			throws UnirestException {
		Gson gson = new GsonBuilder().create();
		String encodedToken = Base64.getEncoder().encodeToString(auth.getBytes());
		HttpResponse<String> response = Unirest
				.post(url + method).header("content-type", "application/json")
				.header("cache-control", "no-cache").header("Authorization", "Basic " + encodedToken)
				.body(gson.toJson(data)).asString();
		return response.getBody();
	}
}
