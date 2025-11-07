package com.data.backend.service.imp;

import com.data.backend.dto.req.RoomSearchRequest;
import com.data.backend.dto.resp.PageResponse;
import com.data.backend.dto.resp.RoomResponse;
import com.data.backend.exception.HttpNotFound;
import com.data.backend.model.Room;
import com.data.backend.model.RoomImage;
import com.data.backend.repository.RoomRepository;
import com.data.backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    
    private final RoomRepository roomRepository;
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<RoomResponse> searchRooms(RoomSearchRequest request) {
        // Create pageable with sorting
        Sort sort = createSort(request.getSortBy(), request.getSortDirection());
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);
        
        Page<Room> roomPage;
        
        // Check if we have search criteria
        boolean hasKeyword = request.getKeyword() != null && !request.getKeyword().trim().isEmpty();
        boolean hasFilters = request.getHotelId() != null || 
                            request.getRoomType() != null ||
                            request.getMinPrice() != null ||
                            request.getMaxPrice() != null ||
                            request.getMaxAdults() != null ||
                            request.getMaxChildren() != null;
        
        if (hasKeyword || hasFilters) {
            // Use search and filter method
            roomPage = roomRepository.searchAndFilterRooms(
                    request.getKeyword(),
                    request.getHotelId(),
                    request.getRoomType(),
                    request.getMinPrice(),
                    request.getMaxPrice(),
                    request.getMaxAdults(),
                    request.getMaxChildren(),
                    pageable
            );
        } else {
            // Get all available rooms
            roomPage = roomRepository.findByAvailableTrue(pageable);
        }
        
        // Convert to response
        List<RoomResponse> content = roomPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PageResponse.<RoomResponse>builder()
                .content(content)
                .page(roomPage.getNumber())
                .size(roomPage.getSize())
                .totalElements(roomPage.getTotalElements())
                .totalPages(roomPage.getTotalPages())
                .first(roomPage.isFirst())
                .last(roomPage.isLast())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new HttpNotFound("Room not found with id: " + id));
        
        return convertToResponse(room);
    }
    
    private RoomResponse convertToResponse(Room room) {
        // Calculate average rating - lazy load reviews
        Double averageRating = null;
        Long reviewCount = 0L;
        try {
            if (room.getReviews() != null && !room.getReviews().isEmpty()) {
                reviewCount = (long) room.getReviews().size();
                averageRating = room.getReviews().stream()
                        .filter(r -> r.getRating() != null)
                        .mapToDouble(r -> r.getRating())
                        .average()
                        .orElse(0.0);
            }
        } catch (Exception e) {
            // Reviews might not be loaded, skip
        }
        
        // Convert hotel info
        RoomResponse.HotelInfo hotelInfo = null;
        try {
            if (room.getHotel() != null) {
                hotelInfo = RoomResponse.HotelInfo.builder()
                        .id(room.getHotel().getId())
                        .name(room.getHotel().getName())
                        .address(room.getHotel().getAddress())
                        .starRating(room.getHotel().getStarRating())
                        .image(room.getHotel().getImage())
                        .build();
            }
        } catch (Exception e) {
            // Hotel might not be loaded
        }
        
        // Convert images - lazy load
        List<RoomResponse.RoomImageInfo> images = null;
        try {
            if (room.getImages() != null && !room.getImages().isEmpty()) {
                images = room.getImages().stream()
                        .map(img -> RoomResponse.RoomImageInfo.builder()
                                .id(img.getId())
                                .imageUrl(img.getImageUrl())
                                .primaryImage(img.isPrimaryImage())
                                .build())
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            // Images might not be loaded
        }
        
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType())
                .price(room.getPrice())
                .maxAdults(room.getMaxAdults())
                .maxChildren(room.getMaxChildren())
                .description(room.getDescription())
                .available(room.isAvailable())
                .hotel(hotelInfo)
                .images(images)
                .averageRating(averageRating)
                .reviewCount(reviewCount)
                .build();
    }
    
    private Sort createSort(String sortBy, String sortDirection) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            return Sort.by(Sort.Direction.ASC, "id");
        }
        
        Sort.Direction direction = "DESC".equalsIgnoreCase(sortDirection) 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC;
        
        // Map sortBy to actual field names
        String fieldName = mapSortField(sortBy);
        
        return Sort.by(direction, fieldName);
    }
    
    private String mapSortField(String sortBy) {
        switch (sortBy.toLowerCase()) {
            case "price":
                return "price";
            case "maxadults":
            case "max_adults":
                return "maxAdults";
            case "maxchildren":
            case "max_children":
                return "maxChildren";
            case "roomtype":
            case "room_type":
                return "roomType";
            default:
                return "id";
        }
    }
}

