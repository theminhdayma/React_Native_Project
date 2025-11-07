package com.data.backend.service;

import com.data.backend.dto.req.RoomSearchRequest;
import com.data.backend.dto.resp.PageResponse;
import com.data.backend.dto.resp.RoomResponse;

public interface RoomService {
    PageResponse<RoomResponse> searchRooms(RoomSearchRequest request);
    RoomResponse getRoomById(Long id);
}

