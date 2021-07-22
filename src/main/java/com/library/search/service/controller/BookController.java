package com.library.search.service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import com.library.search.service.exception.BookAlreadyExistsException;
import com.library.search.service.exception.BookNotFoundException;
import com.library.search.service.model.*;
import com.library.search.service.payload.ApiResponse;
import com.library.search.service.payload.BookPayload;
import com.library.search.service.payload.SignInPayload;
import com.library.search.service.payload.SignUpPayload;
import com.library.search.service.repository.BookRepository;
import com.library.search.service.repository.RoleRepository;
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
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@RestController
@Slf4j
public class BookController {

    @Autowired private BookRepository bookRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> findBooks(@Valid @RequestBody BookPayload payload){
        Set<Book> resultSearching = new HashSet<>();

        log.info("Was received " + payload.toString());
        Iterable<Book> resultFromDB = bookRepository.findByNameContainingAndAuthorContainingAndPublishedOnContaining(
                payload.getName(),
                payload.getAuthor(),
                payload.getPublishedOn()
        );
        resultFromDB.forEach(resultSearching::add);
        log.info("Response length is " + resultSearching.size());
        // TODO: return payload object if it's 0
        return ResponseEntity.
                ok(resultSearching.toArray());
    }

    @PostMapping(value = "/books", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createBook(@Valid @RequestBody BookPayload payload){
        log.info("Was received " + payload.toString());
        if(
                bookRepository.existsByName(payload.getName()) &&
                bookRepository.existsByAuthor(payload.getAuthor()) &&
                bookRepository.existsByPublishedOn(payload.getPublishedOn())
        ){
            log.info("The book {} already exists", payload);
            throw new BookAlreadyExistsException("The book " + payload + " already exists");
        }
        Book book = Book.builder()
                .author(payload.getAuthor())
                .name(payload.getName())
                .publishedOn(payload.getPublishedOn())
                .build();
        Book saved = bookRepository.save(book);
        log.info("The book {} was saved", saved);

        return ResponseEntity.
                ok(saved);
    }

    @PostMapping(value = "/signup", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createUser(@Valid @RequestBody SignUpPayload payload){
        log.info("Was received " + payload.toString());
//        Role USER_ROLE = roleRepository.findById(1L).orElse(new Role(1L, "ROLE_USER"));
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
        return ResponseEntity.
                ok(new ApiResponse("User " + payload.getUsername() + " was successfully authenticate!"));
    }

    @PatchMapping(
            value = "/books/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = "application/json-patch+json")
    public ResponseEntity<?> patchBook(@PathVariable("id") Integer id, @RequestBody JsonPatch patch){
        log.info("Book id for patch: {}", id);
        log.info("Details for patch: {}", patch);
        Book patchedBook = null;
        try{
            Book book = bookRepository.findById(id).orElseThrow(BookNotFoundException::new);
            patchedBook = applyPatchToBook(patch, book);
            bookRepository.save(patchedBook);
            log.info("Book {} was saved.", patchedBook);
        } catch (JsonPatchException | JsonProcessingException e) {
            log.info("Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (BookNotFoundException e){
            log.info("Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(patchedBook);
    }

    private Book applyPatchToBook(JsonPatch patch, Book targetBook)
            throws JsonPatchException, JsonProcessingException {
        JsonNode patched = patch.apply(objectMapper.convertValue(targetBook, JsonNode.class));
        return objectMapper.treeToValue(patched, Book.class);
    }

    @GetMapping(value = "/books", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> findAll(){
        log.info("Retrieving all books");
        return ResponseEntity.
                ok(bookRepository.findAll());
    }

    @GetMapping(value = "/books/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> findBookById(@PathVariable("id") Integer id){
        log.info("Retrieving a book with id: {}", id);
        return ResponseEntity.
                ok(bookRepository.findById(id));
    }

    @DeleteMapping(value = "/books/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> findAll(@PathVariable("id") Integer id){
        log.info("Delete a book with id: {}", id);
        bookRepository.deleteById(id);
        return ResponseEntity.
                ok(new ApiResponse("Book was successfully deleted!"));
    }
}