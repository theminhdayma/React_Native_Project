import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { roomService } from '@/services/roomService';
import type { RoomResponse, RoomImageInfo } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    if (id) {
      loadRoomDetail(parseInt(id));
    }
  }, [id]);

  const loadRoomDetail = async (roomId: number) => {
    try {
      setIsLoading(true);
      const data = await roomService.getRoomById(roomId);
      setRoom(data);
    } catch (error: any) {
      console.error('Error loading room detail:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load room details');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookRoom = () => {
    if (!room) return;
    // Navigate to booking screen (to be implemented)
    Alert.alert('Booking', 'Booking functionality will be implemented soon');
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starContainer}>
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < Math.floor(rating) ? 'star' : 'star-outline'}
            size={16}
            color="#FFD700"
          />
        ))}
        <ThemedText style={styles.ratingText}>{rating.toFixed(1)}</ThemedText>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (!room) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>Room not found</ThemedText>
      </View>
    );
  }

  const images = room.images || [];
  const primaryImage = images.find((img) => img.primaryImage) || images[0];
  const displayImages = showAllImages ? images : images.slice(0, 4);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Room Details
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        {primaryImage && (
          <View style={styles.mainImageContainer}>
            <Image
              source={{ uri: primaryImage.imageUrl }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            {images.length > 1 && (
              <View style={styles.imageCounter}>
                <Ionicons name="images-outline" size={16} color="#fff" />
                <ThemedText style={styles.imageCounterText}>
                  {images.length} {images.length === 1 ? 'image' : 'images'}
                </ThemedText>
              </View>
            )}
          </View>
        )}

        {/* Image Gallery */}
        {images.length > 0 && (
          <View style={styles.imageGallerySection}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Room Images ({images.length})
              </ThemedText>
              {images.length > 4 && (
                <TouchableOpacity onPress={() => setShowAllImages(!showAllImages)}>
                  <ThemedText style={styles.viewAllText}>
                    {showAllImages ? 'Show Less' : 'View All'}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={displayImages}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.galleryImageContainer,
                    selectedImageIndex === index && styles.galleryImageContainerActive,
                  ]}
                  onPress={() => setSelectedImageIndex(index)}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                  {item.primaryImage && (
                    <View style={styles.primaryBadge}>
                      <ThemedText style={styles.primaryBadgeText}>Primary</ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.galleryList}
            />
          </View>
        )}

        {/* Room Info */}
        <View style={styles.roomInfoSection}>
          <ThemedText type="title" style={styles.roomTitle}>
            {room.roomNumber} - {room.roomType || 'Standard Room'}
          </ThemedText>

          {/* Hotel Info */}
          <TouchableOpacity
            style={styles.hotelCard}
            onPress={() => {
              // Navigate to hotel detail if needed
            }}
          >
            <View style={styles.hotelHeader}>
              <Ionicons name="business" size={20} color="#8B5CF6" />
              <ThemedText type="subtitle" style={styles.hotelName}>
                {room.hotel.name}
              </ThemedText>
            </View>
            <View style={styles.hotelMeta}>
              <View style={styles.hotelMetaItem}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <ThemedText style={styles.hotelAddress} numberOfLines={1}>
                  {room.hotel.address || 'No address provided'}
                </ThemedText>
              </View>
              {room.hotel.starRating && (
                <View style={styles.hotelMetaItem}>
                  {renderStars(room.hotel.starRating)}
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Room Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={24} color="#8B5CF6" />
              <ThemedText style={styles.detailLabel}>Capacity</ThemedText>
              <ThemedText style={styles.detailValue}>
                {room.maxAdults} adults, {room.maxChildren} children
              </ThemedText>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={24} color="#8B5CF6" />
              <ThemedText style={styles.detailLabel}>Room Type</ThemedText>
              <ThemedText style={styles.detailValue}>
                {room.roomType || 'Standard'}
              </ThemedText>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#8B5CF6" />
              <ThemedText style={styles.detailLabel}>Status</ThemedText>
              <ThemedText
                style={[
                  styles.detailValue,
                  room.available ? styles.availableText : styles.unavailableText,
                ]}
              >
                {room.available ? 'Available' : 'Unavailable'}
              </ThemedText>
            </View>
          </View>

          {/* Description */}
          {room.description && (
            <View style={styles.descriptionSection}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Description
              </ThemedText>
              <ThemedText style={styles.descriptionText}>{room.description}</ThemedText>
            </View>
          )}

          {/* Rating & Reviews */}
          {(room.averageRating || room.reviewCount) && (
            <View style={styles.ratingSection}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Ratings & Reviews
              </ThemedText>
              <View style={styles.ratingInfo}>
                {room.averageRating && renderStars(room.averageRating)}
                <ThemedText style={styles.reviewCount}>
                  ({room.reviewCount || 0} {room.reviewCount === 1 ? 'review' : 'reviews'})
                </ThemedText>
              </View>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceSection}>
            <View>
              <ThemedText style={styles.priceLabel}>Price per night</ThemedText>
              <ThemedText type="title" style={styles.priceValue}>
                ${room.price.toFixed(2)}
              </ThemedText>
            </View>
            <TouchableOpacity
              style={[
                styles.bookButton,
                !room.available && styles.bookButtonDisabled,
              ]}
              onPress={handleBookRoom}
              disabled={!room.available}
            >
              <ThemedText style={styles.bookButtonText}>
                {room.available ? 'Book Now' : 'Unavailable'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  mainImageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  imageGallerySection: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  galleryList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  galleryImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  galleryImageContainerActive: {
    borderColor: '#8B5CF6',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  primaryBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  roomInfoSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  roomTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  hotelCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  hotelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
  },
  hotelMeta: {
    gap: 8,
  },
  hotelMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hotelAddress: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  availableText: {
    color: '#4caf50',
  },
  unavailableText: {
    color: '#f44336',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginTop: 8,
  },
  ratingSection: {
    marginBottom: 20,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  priceLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  bookButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


