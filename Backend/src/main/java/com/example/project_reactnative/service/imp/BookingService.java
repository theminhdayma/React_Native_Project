package com.example.project_reactnative.service.imp;

import com.example.project_reactnative.model.constants.Status;
import com.example.project_reactnative.model.dto.request.BookingRequest;
import com.example.project_reactnative.model.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse booking(BookingRequest bookingRequest);

    List<BookingResponse> getBookingsByStatus(Long userId, Status status);
}
