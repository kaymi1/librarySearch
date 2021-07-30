package com.library.search.service.repository;

import com.library.search.service.model.Book;
import org.springframework.data.repository.CrudRepository;

public interface BookRepository extends CrudRepository<Book, Integer> {
    Iterable<Book> findByNameContaining(String name);
    Iterable<Book> findByAuthorContaining(String author);
    Iterable<Book> findByPublishedOnContaining(String publishedOn);
    // it's equal:
    // select * from books where name like '%{name}%' author like '%{author}%' publishedOn like '%{publishedOn}%'
    Iterable<Book> findByNameContainingAndAuthorContainingAndPublishedOnContaining(String name, String author, String publishedOn);
    Boolean existsByName(String name);
    Boolean existsByAuthor(String author);
    Boolean existsByPublishedOn(String publishedOn);
    Boolean existsByNameAndAuthorAndPublishedOn(String name, String author, String publishedOn);
}
