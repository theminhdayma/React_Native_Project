package com.data.backend.service;

import com.data.backend.dto.resp.HotelResponse;

import java.util.List;

public interface HotelService {
    List<HotelResponse> getBestHotels(int limit);
    List<HotelResponse> getAllHotels();
}

