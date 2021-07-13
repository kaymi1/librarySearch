package com.library.search.service.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookPayload {

    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String author;

    @Size(max = 4)
    private String publishedOn;
}
