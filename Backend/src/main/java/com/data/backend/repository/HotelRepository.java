package com.data.backend.repository;

import com.data.backend.model.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
    // Find top N hotels by star rating
    @Query("SELECT h FROM Hotel h WHERE h.starRating IS NOT NULL ORDER BY h.starRating DESC")
    List<Hotel> findTopByOrderByStarRatingDesc(Pageable pageable);
    
    // Find hotels by name containing keyword
    Page<Hotel> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
    
    // Find hotels by address containing keyword
    Page<Hotel> findByAddressContainingIgnoreCase(String keyword, Pageable pageable);
}

