package com.example.project_reactnative.repository;

import com.example.project_reactnative.model.constants.Status;
import com.example.project_reactnative.model.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> getBookingsByUserIdAndStatus(Long userId, Status status);
}
