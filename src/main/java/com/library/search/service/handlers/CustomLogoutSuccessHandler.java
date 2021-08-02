package com.library.search.service.handlers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class CustomLogoutSuccessHandler extends
        SimpleUrlLogoutSuccessHandler implements LogoutSuccessHandler {

    @Autowired private AdminLogoutRedirectHandler adminLogoutRedirectHandler;

    @Override
    public void onLogoutSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        String refererUrl = request.getHeader("Referer");
        // TODO: rewrite on correctly regex
        String[] splitRefererUrl = refererUrl.split("8080");

        List<GrantedAuthority> authorities = new ArrayList<>(authentication.getAuthorities());
        List<String> authoritiesNames = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        if(authoritiesNames.contains("ROLE_ADMIN")){
            Map<String, String> map = adminLogoutRedirectHandler.getMapAdminNameToLogoutRedirect();
            map.put(authentication.getName(), splitRefererUrl[1]);
            adminLogoutRedirectHandler.setMapAdminNameToLogoutRedirect(map);
            log.info("Logout handler added on " + authentication.getName() + " to " + splitRefererUrl[1]);
        }
        log.info("Logout from: " + refererUrl);
        super.onLogoutSuccess(request, response, authentication);
    }
}
