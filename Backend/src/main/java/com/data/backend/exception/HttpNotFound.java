package com.data.backend.exception;

public class HttpNotFound extends RuntimeException
{
    public HttpNotFound(String message)
    {
        super(message);
    }
}
