package com.library.search.service.controller;

import com.library.search.service.model.Book;
import com.library.search.service.payload.BookPayload;
import com.library.search.service.repository.BookRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;
import java.util.*;

@Controller
@RequestMapping(path = "/library")
@Slf4j
public class BookController {

    @Autowired private BookRepository repository;

    @PostMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> findBooks(@Valid @RequestBody BookPayload payload){
        Set<Book> resultSearching = new HashSet<>();
        log.info("Was received " + payload.toString());
        Iterable<Book> resultFromDB = repository.findByNameContainingAndAuthorContainingAndPublishedOnContaining(
                payload.getName(),
                payload.getAuthor(),
                payload.getPublishedOn()
        );
        resultFromDB.forEach(resultSearching::add);
        log.info("Response length is " + resultSearching.size());
        return ResponseEntity.
                ok(resultSearching.toArray());
    }
}
