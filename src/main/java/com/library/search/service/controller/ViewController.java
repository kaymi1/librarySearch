package com.library.search.service.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Slf4j
public class ViewController {
    @GetMapping(value = "/login")
    public String login(){
        return "login";
    }
    @GetMapping(value = "/signup")
    public String signup(){
        return "sign-up";
    }
    @GetMapping(value = "/")
    public String allBooks(){
        return "all-books";
    }
    @GetMapping(value = "/search-book")
    public String searchBooks(){
        return "search-book";
    }
    @GetMapping(value = "/patch-book")
    public String patchBooks(){
        return "patch-book";
    }
    @GetMapping(value = "/add-book")
    public String createBook(){
        return "add-book";
    }
}
