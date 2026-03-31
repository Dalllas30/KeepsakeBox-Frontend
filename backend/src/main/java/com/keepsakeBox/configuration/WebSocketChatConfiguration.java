/**
 * V2
 * @author André Santana - fc49451
 * 
 * Socket management for patient chats.
 * Implemented with Stomp.
 */

package com.keepsakeBox.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketChatConfiguration implements WebSocketMessageBrokerConfigurer {

	/**
	 * Registers StompEndPoints
	 */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
                .addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:4200")
                //.setAllowedOrigins("http://194.117.20.219:4200")
                .withSockJS();
    }
    
    /**
     * Configure the message broker and destination
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
    	config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/chat");
    }
}
