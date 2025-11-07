package com.data.backend.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private String roomType;
    private Double price;
    private Integer maxAdults;
    private Integer maxChildren;
    private String description;
    private Boolean available;
    
    // Hotel info
    private HotelInfo hotel;
    
    // Images
    private List<RoomImageInfo> images;
    
    // Average rating from reviews
    private Double averageRating;
    
    // Total number of reviews
    private Long reviewCount;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HotelInfo {
        private Long id;
        private String name;
        private String address;
        private Double starRating;
        private String image;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoomImageInfo {
        private Long id;
        private String imageUrl;
        private Boolean primaryImage;
    }
}

