package com.library.search.service.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignUpPayload {
    @Size(max = 255)
    private String username;

    @Size(max = 255)
    private String password;
}
