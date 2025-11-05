package com.data.backend.exception;

public class HttpUnAuthorized extends RuntimeException
{
    public HttpUnAuthorized(String message)
    {
        super(message);
    }
}
