package com.data.backend.dto.resp;

import com.data.backend.model.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private boolean success;
    private String message;
    private RegisterData data;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RegisterData {
        private Long id;
        private String name;
        private String email;

        @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
        private LocalDateTime createdAt;
    }

    public RegisterResponse(User user, String message) {
        this.success = true;
        this.message = message;
        this.data = new RegisterData(user.getId(), user.getName(), user.getEmail(),user.getCreatedAt());
    }
}