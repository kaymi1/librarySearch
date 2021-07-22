package com.library.search.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication
public class LibrarySearchApplication {
    public static void main(String[] args) {
        SpringApplication.run(LibrarySearchApplication.class, args);
    }
    // TODO: add mvc config to handle view
}
