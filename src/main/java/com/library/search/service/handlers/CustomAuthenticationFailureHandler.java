package com.library.search.service.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class CustomAuthenticationFailureHandler
  implements AuthenticationFailureHandler {
 
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationFailure(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException exception)
      throws IOException, ServletException {

        log.info("Error: {}", exception.getMessage());
        log.info("Request: {}", IOUtils.toString(request.getReader()));
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        Map<String, Object> data = new HashMap<>();
        data.put(
          "timestamp", 
          Calendar.getInstance().getTime());
        data.put(
          "exception", 
          exception.getMessage());

        response.getOutputStream()
          .println(objectMapper.writeValueAsString(data));
    }
}