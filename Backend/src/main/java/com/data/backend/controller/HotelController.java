package com.data.backend.controller;

import com.data.backend.dto.ResponseWrapper;
import com.data.backend.dto.resp.HotelResponse;
import com.data.backend.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hotels")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HotelController {
    
    private final HotelService hotelService;
    
    @GetMapping("/best")
    public ResponseEntity<ResponseWrapper<List<HotelResponse>>> getBestHotels(
            @RequestParam(defaultValue = "5") Integer limit) {
        try {
            List<HotelResponse> response = hotelService.getBestHotels(limit);
            
            ResponseWrapper<List<HotelResponse>> wrapper = ResponseWrapper.<List<HotelResponse>>builder()
                    .status(HttpStatus.OK)
                    .code(HttpStatus.OK.value())
                    .data(response)
                    .message("Best hotels retrieved successfully")
                    .build();
            
            return ResponseEntity.ok(wrapper);
        } catch (Exception e) {
            ResponseWrapper<List<HotelResponse>> wrapper = ResponseWrapper.<List<HotelResponse>>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .code(HttpStatus.BAD_REQUEST.value())
                    .data(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(wrapper);
        }
    }
    
    @GetMapping
    public ResponseEntity<ResponseWrapper<List<HotelResponse>>> getAllHotels() {
        try {
            List<HotelResponse> response = hotelService.getAllHotels();
            
            ResponseWrapper<List<HotelResponse>> wrapper = ResponseWrapper.<List<HotelResponse>>builder()
                    .status(HttpStatus.OK)
                    .code(HttpStatus.OK.value())
                    .data(response)
                    .message("All hotels retrieved successfully")
                    .build();
            
            return ResponseEntity.ok(wrapper);
        } catch (Exception e) {
            ResponseWrapper<List<HotelResponse>> wrapper = ResponseWrapper.<List<HotelResponse>>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .code(HttpStatus.BAD_REQUEST.value())
                    .data(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(wrapper);
        }
    }
}

