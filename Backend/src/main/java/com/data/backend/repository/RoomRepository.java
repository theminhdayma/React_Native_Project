package com.data.backend.repository;

import com.data.backend.model.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    // Find by ID with hotel loaded
    @Query("SELECT r FROM Room r LEFT JOIN FETCH r.hotel LEFT JOIN FETCH r.images WHERE r.id = :id")
    Optional<Room> findByIdWithDetails(@Param("id") Long id);
    
    // Search rooms by keyword (name, type, description)
    @Query("SELECT r FROM Room r JOIN r.hotel h " +
           "WHERE r.available = true AND (" +
           "LOWER(r.roomType) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.address) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
           ")")
    Page<Room> searchRooms(@Param("keyword") String keyword, Pageable pageable);
    
    // Filter rooms by criteria
    @Query("SELECT r FROM Room r JOIN r.hotel h " +
           "WHERE r.available = true " +
           "AND (:hotelId IS NULL OR h.id = :hotelId) " +
           "AND (:roomType IS NULL OR LOWER(r.roomType) = LOWER(:roomType)) " +
           "AND (:minPrice IS NULL OR r.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR r.price <= :maxPrice) " +
           "AND (:maxAdults IS NULL OR r.maxAdults >= :maxAdults) " +
           "AND (:maxChildren IS NULL OR r.maxChildren >= :maxChildren)")
    Page<Room> filterRooms(
            @Param("hotelId") Long hotelId,
            @Param("roomType") String roomType,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("maxAdults") Integer maxAdults,
            @Param("maxChildren") Integer maxChildren,
            Pageable pageable
    );
    
    // Search and filter combined
    @Query("SELECT r FROM Room r JOIN r.hotel h " +
           "WHERE r.available = true " +
           "AND (:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(r.roomType) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.address) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:hotelId IS NULL OR h.id = :hotelId) " +
           "AND (:roomType IS NULL OR :roomType = '' OR LOWER(r.roomType) = LOWER(:roomType)) " +
           "AND (:minPrice IS NULL OR r.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR r.price <= :maxPrice) " +
           "AND (:maxAdults IS NULL OR r.maxAdults >= :maxAdults) " +
           "AND (:maxChildren IS NULL OR r.maxChildren >= :maxChildren)")
    Page<Room> searchAndFilterRooms(
            @Param("keyword") String keyword,
            @Param("hotelId") Long hotelId,
            @Param("roomType") String roomType,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("maxAdults") Integer maxAdults,
            @Param("maxChildren") Integer maxChildren,
            Pageable pageable
    );
    
    // Check room availability for date range
    @Query("SELECT r FROM Room r WHERE r.id = :roomId AND r.available = true " +
           "AND r.id NOT IN (" +
           "SELECT b.room.id FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.bookingStatus IN ('confirmed', 'pending') " +
           "AND ((b.checkInDate <= :checkOutDate AND b.checkOutDate >= :checkInDate))" +
           ")")
    Optional<Room> findAvailableRoomForDates(
            @Param("roomId") Long roomId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );
    
    // Find all available rooms
    Page<Room> findByAvailableTrue(Pageable pageable);
    
    // Find rooms by hotel
    Page<Room> findByHotelIdAndAvailableTrue(Long hotelId, Pageable pageable);
}

