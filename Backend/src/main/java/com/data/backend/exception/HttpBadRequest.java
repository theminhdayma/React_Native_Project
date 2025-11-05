package com.data.backend.exception;

public class HttpBadRequest extends RuntimeException
{
    public HttpBadRequest(String message)
    {
        super(message);
    }
}
