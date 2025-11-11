package com.example.project_reactnative.service.imp;

import com.example.project_reactnative.model.dto.request.ReviewRequest;
import com.example.project_reactnative.model.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse addReview(ReviewRequest reviewRequest);
    List<ReviewResponse> getReviewsByRoom(Long hotelId, Long roomId);
}
