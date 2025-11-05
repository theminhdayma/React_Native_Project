package com.data.backend.advice_controller;

import com.data.backend.dto.ResponseWrapper;
import com.data.backend.exception.HttpBadRequest;
import com.data.backend.exception.HttpConflict;
import com.data.backend.exception.HttpForbiden;
import com.data.backend.exception.HttpNotFound;
import com.data.backend.exception.HttpUnAuthorized;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle valid exception for validation (400)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getFieldErrors().forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ResponseWrapper.builder()
                        .code(HttpStatus.BAD_REQUEST.value())
                        .status(HttpStatus.BAD_REQUEST)
                        .data(errors)
                        .message("Invalid request parameters")
                        .build()
        );
    }

    /**
     * Handle exception max upload file (400)
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ResponseWrapper.builder()
                        .code(HttpStatus.BAD_REQUEST.value())
                        .status(HttpStatus.BAD_REQUEST)
                        .data(null)
                        .message("File size exceeds limit: " + ex.getMessage())
                        .build()
        );
    }

    /**
     * Handle exception not found resource (404)
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<?> handleNoResourceFoundException(NoResourceFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ResponseWrapper.builder()
                        .code(HttpStatus.NOT_FOUND.value())
                        .status(HttpStatus.NOT_FOUND)
                        .data(null)
                        .message(ex.getMessage())
                        .build()
        );
    }

    /**
     * Handle username not found exception (404)
     */
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<?> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ResponseWrapper.builder()
                        .code(HttpStatus.NOT_FOUND.value())
                        .status(HttpStatus.NOT_FOUND)
                        .data(null)
                        .message(ex.getMessage())
                        .build()
        );
    }

    /**
     * Handle exception bad request (400)
     */
    @ExceptionHandler(HttpBadRequest.class)
    public ResponseEntity<?> handleHttpBadRequest(HttpBadRequest ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ResponseWrapper.builder()
                        .code(HttpStatus.BAD_REQUEST.value())
                        .status(HttpStatus.BAD_REQUEST)
                        .data(null)
                        .message(ex.getMessage())
                        .build()
        );
    }

    /**
     * Handle exception unauthorized (401)
     */
    @ExceptionHandler(HttpUnAuthorized.class)
    public ResponseEntity<?> handleHttpUnAuthorized(HttpUnAuthorized ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ResponseWrapper.builder()
                        .code(HttpStatus.UNAUTHORIZED.value())
                        .status(HttpStatus.UNAUTHORIZED)
                        .data(null)
                        .message(ex.getMessage())
                        .build()
        );
    }

    /**
     * Handle exception forbidden (403)
     */
    @ExceptionHandler(HttpForbiden.class)
    public ResponseEntity<?> handleHttpForbiden(HttpForbiden ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                ResponseWrapper.builder()
                        .code(HttpStatus.FORBIDDEN.value())
                        .status(HttpStatus.FORBIDDEN)
                        .data(null)
                        .message(ex.getMessage())
                        .build()
        );
    }

    /**
     * Handle exception not found (404)
     */
    @ExceptionHandler(HttpNotFound.class)
    public ResponseEntity<?> handleHttpNotFound(HttpNotFound ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ResponseWrapper.builder()
                        .code(HttpStatus.NOT_FOUND.value())
                        .status(HttpStatus.NOT_FOUND)
                        .data(null)
                        .message(ex.getMessage())
                        .build()
        );
    }

    /**
     * Handle exception conflict (409)
     */
    @ExceptionHandler(HttpConflict.class)
    public ResponseEntity<?> handleHttpConflict(HttpConflict ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                ResponseWrapper.builder()
                        .code(HttpStatus.CONFLICT.value())
                        .status(HttpStatus.CONFLICT)
                        .data(null)
                        .message(ex.getMessage())
                        .build()
        );
    }

    // Optionally, you can handle all other exceptions (500 error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseWrapper.builder()
                        .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .data(null)
                        .message("Internal server error: " + ex.getMessage())
                        .build()
        );
    }
}
