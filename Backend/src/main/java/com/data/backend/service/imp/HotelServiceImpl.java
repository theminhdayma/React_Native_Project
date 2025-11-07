package com.data.backend.service.imp;

import com.data.backend.dto.resp.HotelResponse;
import com.data.backend.model.Hotel;
import com.data.backend.model.Room;
import com.data.backend.repository.HotelRepository;
import com.data.backend.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {
    
    private final HotelRepository hotelRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<HotelResponse> getBestHotels(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Hotel> hotels = hotelRepository.findTopByOrderByStarRatingDesc(pageable);
        
        return hotels.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<HotelResponse> getAllHotels() {
        List<Hotel> hotels = hotelRepository.findAll();
        
        return hotels.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private HotelResponse convertToResponse(Hotel hotel) {
        // Calculate available rooms count and starting price
        Long availableRoomsCount = 0L;
        Double startingPrice = null;
        
        if (hotel.getRooms() != null && !hotel.getRooms().isEmpty()) {
            availableRoomsCount = hotel.getRooms().stream()
                    .filter(Room::isAvailable)
                    .count();
            
            startingPrice = hotel.getRooms().stream()
                    .filter(Room::isAvailable)
                    .map(Room::getPrice)
                    .min(Double::compareTo)
                    .orElse(null);
        }
        
        return HotelResponse.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .address(hotel.getAddress())
                .starRating(hotel.getStarRating())
                .description(hotel.getDescription())
                .image(hotel.getImage())
                .availableRoomsCount(availableRoomsCount)
                .startingPrice(startingPrice)
                .build();
    }
}

