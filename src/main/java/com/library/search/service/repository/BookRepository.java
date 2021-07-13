package com.library.search.service.repository;

import com.library.search.service.model.Book;
import org.springframework.data.repository.CrudRepository;

public interface BookRepository extends CrudRepository<Book, Long> {
    Iterable<Book> findByNameContainingAndAuthorContainingAndPublishedOnContaining(String name, String author, String publishedOn);
}
