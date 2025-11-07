package com.data.backend.controller;

import com.data.backend.dto.ResponseWrapper;
import com.data.backend.dto.req.RoomSearchRequest;
import com.data.backend.dto.resp.PageResponse;
import com.data.backend.dto.resp.RoomResponse;
import com.data.backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoomController {
    
    private final RoomService roomService;
    
    @GetMapping("/search")
    public ResponseEntity<ResponseWrapper<PageResponse<RoomResponse>>> searchRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long hotelId,
            @RequestParam(required = false) String roomType,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer maxAdults,
            @RequestParam(required = false) Integer maxChildren,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection) {
        
        try {
            RoomSearchRequest request = RoomSearchRequest.builder()
                    .keyword(keyword)
                    .hotelId(hotelId)
                    .roomType(roomType)
                    .minPrice(minPrice)
                    .maxPrice(maxPrice)
                    .maxAdults(maxAdults)
                    .maxChildren(maxChildren)
                    .page(page)
                    .size(size)
                    .sortBy(sortBy)
                    .sortDirection(sortDirection)
                    .build();
            
            PageResponse<RoomResponse> response = roomService.searchRooms(request);
            
            ResponseWrapper<PageResponse<RoomResponse>> wrapper = ResponseWrapper.<PageResponse<RoomResponse>>builder()
                    .status(HttpStatus.OK)
                    .code(HttpStatus.OK.value())
                    .data(response)
                    .message("Rooms retrieved successfully")
                    .build();
            
            return ResponseEntity.ok(wrapper);
        } catch (Exception e) {
            ResponseWrapper<PageResponse<RoomResponse>> wrapper = ResponseWrapper.<PageResponse<RoomResponse>>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .code(HttpStatus.BAD_REQUEST.value())
                    .data(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(wrapper);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ResponseWrapper<RoomResponse>> getRoomById(@PathVariable Long id) {
        try {
            RoomResponse response = roomService.getRoomById(id);
            
            ResponseWrapper<RoomResponse> wrapper = ResponseWrapper.<RoomResponse>builder()
                    .status(HttpStatus.OK)
                    .code(HttpStatus.OK.value())
                    .data(response)
                    .message("Room details retrieved successfully")
                    .build();
            
            return ResponseEntity.ok(wrapper);
        } catch (Exception e) {
            ResponseWrapper<RoomResponse> wrapper = ResponseWrapper.<RoomResponse>builder()
                    .status(HttpStatus.NOT_FOUND)
                    .code(HttpStatus.NOT_FOUND.value())
                    .data(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(wrapper);
        }
    }
}

