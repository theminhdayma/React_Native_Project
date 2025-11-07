import { StyleSheet, ScrollView, View, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { hotelService } from '@/services/hotelService';
import type { HotelResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export default function HotelsScreen() {
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHotels = async () => {
    try {
      const data = await hotelService.getBestHotels(10);
      setHotels(data);
    } catch (error: any) {
      console.error('Error loading hotels:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadHotels();
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.content}>
        <View style={styles.headerSection}>
          <View>
            <ThemedText type="title" style={styles.title}>
              Hotels
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Browse available hotels and book your stay
            </ThemedText>
          </View>
          <TouchableOpacity
            style={styles.searchRoomsButton}
            onPress={() => router.push('/rooms')}
          >
            <Ionicons name="search" size={20} color="#fff" />
            <ThemedText style={styles.searchRoomsButtonText}>
              Search Rooms
            </ThemedText>
          </TouchableOpacity>
        </View>

        {hotels.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              No hotels available at the moment. Check back later!
            </ThemedText>
          </View>
        ) : (
          <View style={styles.hotelList}>
            {hotels.map((hotel) => (
              <TouchableOpacity key={hotel.id} style={styles.hotelCard}>
                {hotel.image ? (
                  <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                ) : (
                  <View style={styles.hotelImagePlaceholder}>
                    <Ionicons name="business-outline" size={40} color="#999" />
                  </View>
                )}
                <View style={styles.hotelInfo}>
                  <ThemedText type="subtitle" style={styles.hotelName}>
                    {hotel.name}
                  </ThemedText>
                  <View style={styles.hotelMeta}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <ThemedText style={styles.hotelAddress} numberOfLines={1}>
                      {hotel.address}
                    </ThemedText>
                  </View>
                  {hotel.starRating && (
                    <View style={styles.hotelRating}>
                      <View style={styles.starContainer}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < Math.floor(hotel.starRating || 0) ? 'star' : 'star-outline'}
                            size={14}
                            color="#FFD700"
                          />
                        ))}
                        <ThemedText style={styles.ratingText}>
                          {(hotel.starRating || 0).toFixed(1)}
                        </ThemedText>
                      </View>
                    </View>
                  )}
                  <View style={styles.hotelFooter}>
                    <View>
                      <ThemedText style={styles.roomsText}>
                        {hotel.availableRoomsCount || 0} rooms available
                      </ThemedText>
                      {hotel.startingPrice && (
                        <ThemedText style={styles.priceText}>
                          From ${hotel.startingPrice.toFixed(2)}/night
                        </ThemedText>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ThemedView>
    </ScrollView>
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
  content: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  searchRoomsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  searchRoomsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  hotelList: {
    gap: 16,
  },
  hotelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  hotelImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotelInfo: {
    padding: 16,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  hotelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  hotelAddress: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  hotelRating: {
    marginBottom: 12,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  roomsText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
});
