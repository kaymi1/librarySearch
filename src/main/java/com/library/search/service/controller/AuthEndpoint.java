package com.library.search.service.controller;

import com.library.search.service.exception.UserAlreadyExistsException;
import com.library.search.service.handlers.AdminRedirectPageAfterLogoutHandler;
import com.library.search.service.model.Role;
import com.library.search.service.model.User;
import com.library.search.service.payload.ApiResponse;
import com.library.search.service.payload.SignInPayload;
import com.library.search.service.payload.SignUpPayload;
import com.library.search.service.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.Map;

@RestController
@Slf4j
public class AuthEndpoint {

    @Autowired private UserRepository userRepository;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired private AdminRedirectPageAfterLogoutHandler adminRedirectPageAfterLogoutHandler;

    @PostMapping(value = "/signup", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createUser(@Valid @RequestBody SignUpPayload payload){
        log.info("Was received " + payload.toString());
        if(userRepository.existsByUsername(payload.getUsername())){
            log.info("The user {} already exists", payload.getUsername());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        User user = User.builder()
                .password(bCryptPasswordEncoder.encode(payload.getPassword()))
                .username(payload.getUsername())
                .roles(new HashSet<>() {{
                    add(new Role(1L, "ROLE_USER"));
                }})
                .build();
        User saved = userRepository.save(user);

        log.info("The user {} was saved", saved);
        return ResponseEntity.
                ok(saved);
    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody SignInPayload payload){
        log.info("Was received: {}", payload.toString());
        Authentication authentication = null;
        try{
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            payload.getUsername(),
                            payload.getPassword()
                    )
            );
        } catch (AuthenticationException e){
            return ResponseEntity.
                    status(HttpStatus.BAD_REQUEST).build();
        }
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        Map<String, String> map = adminRedirectPageAfterLogoutHandler.getMapAdminNameToLogoutRedirect();
        if(map.containsKey(payload.getUsername())){
            String redirect = map.get(payload.getUsername());
            return ResponseEntity.
                    ok(new ApiResponse(redirect));
        }
        return ResponseEntity.
                ok(new ApiResponse("/"));
    }

    @GetMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUser(@AuthenticationPrincipal User user){
        log.info("Was received: {}", user);
        return ResponseEntity.
                ok(user);
    }
}
