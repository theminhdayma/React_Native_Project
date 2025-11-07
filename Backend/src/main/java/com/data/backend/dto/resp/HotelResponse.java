package com.data.backend.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelResponse {
    private Long id;
    private String name;
    private String address;
    private Double starRating;
    private String description;
    private String image;
    
    // Count of available rooms
    private Long availableRoomsCount;
    
    // Starting price (lowest room price)
    private Double startingPrice;
}

