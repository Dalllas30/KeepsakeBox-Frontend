/**
 * V2
 * @author Madalena Vagos - fc48667
 * @author André Santana - fc49451
 * 
 * Main function of Spring Boot that start RESTful Service.
 */

package com.keepsakeBox;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

import java.util.Locale;

@EnableAutoConfiguration(exclude={DataSourceAutoConfiguration.class})
@SpringBootApplication
public class KeepsakeBoxApplication{
	public static void main(String[] args) {
		Locale.setDefault(Locale.UK);
		SpringApplication.run(KeepsakeBoxApplication.class, args);
	}

}
