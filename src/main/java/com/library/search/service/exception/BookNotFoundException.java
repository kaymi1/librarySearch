package com.library.search.service.exception;

import java.util.function.Supplier;

public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(){super("The book was not found!");}
}
