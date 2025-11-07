package com.data.backend.dto.req;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomSearchRequest {
    private String keyword; // Search by room type, description, hotel name, address
    private Long hotelId;
    private String roomType;
    private Double minPrice;
    private Double maxPrice;
    private Integer maxAdults;
    private Integer maxChildren;
    
    // Pagination
    @Builder.Default
    private Integer page = 0;
    
    @Builder.Default
    private Integer size = 10;
    
    // Sorting
    private String sortBy; // price, maxAdults, maxChildren
    private String sortDirection; // ASC, DESC (default: ASC)
}

