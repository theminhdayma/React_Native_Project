import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { roomService } from '@/services/roomService';
import { hotelService } from '@/services/hotelService';
import type { RoomResponse, RoomSearchRequest, HotelResponse } from '@/types';

export default function RoomsScreen() {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Search and filter states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedHotelId, setSelectedHotelId] = useState<number | undefined>();
  const [roomType, setRoomType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxAdults, setMaxAdults] = useState('');
  const [maxChildren, setMaxChildren] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadHotels();
    loadRooms(true);
  }, []);

  const loadHotels = async () => {
    try {
      const data = await hotelService.getAllHotels();
      setHotels(data);
    } catch (error: any) {
      console.error('Error loading hotels:', error);
    }
  };

  const loadRooms = async (reset: boolean = false) => {
    if (isLoading || (!hasMore && !reset)) return;

    try {
      setIsLoading(true);
      const page = reset ? 0 : currentPage;

      const searchParams: RoomSearchRequest = {
        keyword: searchKeyword || undefined,
        hotelId: selectedHotelId,
        roomType: roomType || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        maxAdults: maxAdults ? parseInt(maxAdults) : undefined,
        maxChildren: maxChildren ? parseInt(maxChildren) : undefined,
        page,
        size: 10,
        sortBy: sortBy || undefined,
        sortDirection: sortDirection || undefined,
      };

      const response = await roomService.searchRooms(searchParams);

      if (reset) {
        setRooms(response.content);
        setCurrentPage(0);
      } else {
        setRooms((prev) => [...prev, ...response.content]);
      }

      setTotalPages(response.totalPages);
      setHasMore(!response.last);
      setCurrentPage(response.page);
    } catch (error: any) {
      console.error('Error loading rooms:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load rooms');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    loadRooms(true);
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedHotelId(undefined);
    setRoomType('');
    setMinPrice('');
    setMaxPrice('');
    setMaxAdults('');
    setMaxChildren('');
    setSortBy('');
    setSortDirection('ASC');
    loadRooms(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRooms(true);
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      loadRooms(false);
    }
  };

  const navigateToRoomDetail = (roomId: number) => {
    router.push(`/room-detail?id=${roomId}`);
  };

  const getPrimaryImage = (room: RoomResponse) => {
    const primaryImage = room.images?.find((img) => img.primaryImage);
    return primaryImage?.imageUrl || room.images?.[0]?.imageUrl;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Search Rooms
        </ThemedText>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isCloseToBottom && hasMore && !isLoading) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by room type, description, hotel name..."
              value={searchKeyword}
              onChangeText={setSearchKeyword}
              onSubmitEditing={handleSearch}
            />
            {searchKeyword.length > 0 && (
              <TouchableOpacity onPress={() => setSearchKeyword('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <ThemedText style={styles.searchButtonText}>Search</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersSection}>
            <ThemedText type="subtitle" style={styles.filterTitle}>
              Filters
            </ThemedText>

            {/* Hotel Filter */}
            <View style={styles.filterRow}>
              <ThemedText style={styles.filterLabel}>Hotel</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    !selectedHotelId && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedHotelId(undefined)}
                >
                  <ThemedText
                    style={[
                      styles.filterChipText,
                      !selectedHotelId && styles.filterChipTextActive,
                    ]}
                  >
                    All
                  </ThemedText>
                </TouchableOpacity>
                {hotels.map((hotel) => (
                  <TouchableOpacity
                    key={hotel.id}
                    style={[
                      styles.filterChip,
                      selectedHotelId === hotel.id && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedHotelId(hotel.id)}
                  >
                    <ThemedText
                      style={[
                        styles.filterChipText,
                        selectedHotelId === hotel.id && styles.filterChipTextActive,
                      ]}
                    >
                      {hotel.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Price Range */}
            <View style={styles.filterRow}>
              <ThemedText style={styles.filterLabel}>Price Range</ThemedText>
              <View style={styles.priceInputs}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                />
                <ThemedText style={styles.priceSeparator}>-</ThemedText>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Room Type */}
            <View style={styles.filterRow}>
              <ThemedText style={styles.filterLabel}>Room Type</ThemedText>
              <TextInput
                style={styles.filterInput}
                placeholder="e.g., Deluxe, Suite"
                value={roomType}
                onChangeText={setRoomType}
              />
            </View>

            {/* Capacity */}
            <View style={styles.filterRow}>
              <ThemedText style={styles.filterLabel}>Capacity</ThemedText>
              <View style={styles.capacityInputs}>
                <TextInput
                  style={styles.capacityInput}
                  placeholder="Adults"
                  value={maxAdults}
                  onChangeText={setMaxAdults}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.capacityInput}
                  placeholder="Children"
                  value={maxChildren}
                  onChangeText={setMaxChildren}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Sort */}
            <View style={styles.filterRow}>
              <ThemedText style={styles.filterLabel}>Sort By</ThemedText>
              <View style={styles.sortOptions}>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortBy === 'price' && styles.sortOptionActive,
                  ]}
                  onPress={() => {
                    setSortBy('price');
                    setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
                  }}
                >
                  <ThemedText
                    style={[
                      styles.sortOptionText,
                      sortBy === 'price' && styles.sortOptionTextActive,
                    ]}
                  >
                    Price
                  </ThemedText>
                  {sortBy === 'price' && (
                    <Ionicons
                      name={sortDirection === 'ASC' ? 'arrow-up' : 'arrow-down'}
                      size={16}
                      color="#8B5CF6"
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortBy === 'maxAdults' && styles.sortOptionActive,
                  ]}
                  onPress={() => {
                    setSortBy('maxAdults');
                    setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
                  }}
                >
                  <ThemedText
                    style={[
                      styles.sortOptionText,
                      sortBy === 'maxAdults' && styles.sortOptionTextActive,
                    ]}
                  >
                    Capacity
                  </ThemedText>
                  {sortBy === 'maxAdults' && (
                    <Ionicons
                      name={sortDirection === 'ASC' ? 'arrow-up' : 'arrow-down'}
                      size={16}
                      color="#8B5CF6"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetFilters}
              >
                <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  setShowFilters(false);
                  loadRooms(true);
                }}
              >
                <ThemedText style={styles.applyButtonText}>Apply</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Results */}
        <View style={styles.resultsSection}>
          <ThemedText type="subtitle" style={styles.resultsTitle}>
            {rooms.length} {rooms.length === 1 ? 'Room' : 'Rooms'} Found
          </ThemedText>

          {rooms.length === 0 && !isLoading ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#ccc" />
              <ThemedText style={styles.emptyText}>
                No rooms found. Try adjusting your search criteria.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.roomList}>
              {rooms.map((room) => (
                <TouchableOpacity
                  key={room.id}
                  style={styles.roomCard}
                  onPress={() => navigateToRoomDetail(room.id)}
                >
                  {getPrimaryImage(room) ? (
                    <Image
                      source={{ uri: getPrimaryImage(room)! }}
                      style={styles.roomImage}
                    />
                  ) : (
                    <View style={styles.roomImagePlaceholder}>
                      <Ionicons name="bed-outline" size={40} color="#999" />
                    </View>
                  )}
                  <View style={styles.roomInfo}>
                    <ThemedText type="subtitle" style={styles.roomNumber}>
                      {room.roomNumber} - {room.roomType || 'Standard Room'}
                    </ThemedText>
                    <View style={styles.hotelInfo}>
                      <Ionicons name="business-outline" size={14} color="#666" />
                      <ThemedText style={styles.hotelName} numberOfLines={1}>
                        {room.hotel.name}
                      </ThemedText>
                    </View>
                    <View style={styles.roomMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="people-outline" size={14} color="#666" />
                        <ThemedText style={styles.metaText}>
                          {room.maxAdults} adults, {room.maxChildren} children
                        </ThemedText>
                      </View>
                      {room.averageRating && (
                        <View style={styles.ratingItem}>
                          <Ionicons name="star" size={14} color="#FFD700" />
                          <ThemedText style={styles.ratingText}>
                            {room.averageRating.toFixed(1)} ({room.reviewCount || 0})
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <View style={styles.roomFooter}>
                      <View>
                        <ThemedText style={styles.priceLabel}>Price per night</ThemedText>
                        <ThemedText style={styles.priceValue}>
                          ${room.price.toFixed(2)}
                        </ThemedText>
                      </View>
                      <View style={styles.availabilityBadge}>
                        <ThemedText
                          style={[
                            styles.availabilityText,
                            !room.available && styles.availabilityTextUnavailable,
                          ]}
                        >
                          {room.available ? 'Available' : 'Unavailable'}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {isLoading && rooms.length > 0 && (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#8B5CF6" />
            </View>
          )}
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
    flex: 1,
    textAlign: 'center',
  },
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filtersSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#8B5CF6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  priceSeparator: {
    fontSize: 16,
    color: '#666',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  capacityInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  capacityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    gap: 4,
  },
  sortOptionActive: {
    backgroundColor: '#e8d5ff',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#666',
  },
  sortOptionTextActive: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsSection: {
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  roomList: {
    gap: 16,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  roomImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomInfo: {
    padding: 16,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  hotelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  hotelName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  roomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
  },
  availabilityText: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
  },
  availabilityTextUnavailable: {
    color: '#f44336',
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});


