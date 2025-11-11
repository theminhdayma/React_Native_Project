package com.example.project_reactnative.service.imp;

import com.example.project_reactnative.model.dto.response.HotelResponse;

import java.util.List;

public interface HotelService {
    List<HotelResponse> getHotelsByLocation(List<Long> provinceIds, String sortBy);
    HotelResponse getHotelById(Long hotelId);
}
