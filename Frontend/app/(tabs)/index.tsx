import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { hotelService } from '@/services/hotelService';
import type { HotelResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuth();
  const [bestHotels, setBestHotels] = useState<HotelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBestHotels = async () => {
    try {
      const data = await hotelService.getBestHotels(5);
      setBestHotels(data);
    } catch (error: any) {
      console.error('Error loading best hotels:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBestHotels();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadBestHotels();
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Welcome{user ? `, ${user.firstName || 'User'}` : ''}!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover and book your perfect hotel room
        </ThemedText>

        {/* Quick Search Button */}
        <TouchableOpacity
          style={styles.quickSearchButton}
          onPress={() => router.push('/rooms')}
        >
          <Ionicons name="search" size={24} color="#fff" />
          <View style={styles.quickSearchTextContainer}>
            <ThemedText style={styles.quickSearchTitle}>Search Rooms</ThemedText>
            <ThemedText style={styles.quickSearchSubtitle}>
              Find your perfect stay
            </ThemedText>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Best Hotels Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Best Hotels
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#8B5CF6" />
            </View>
          ) : bestHotels.length === 0 ? (
            <ThemedText style={styles.emptyText}>
              No hotels available at the moment.
            </ThemedText>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hotelScroll}>
              {bestHotels.map((hotel) => (
                <TouchableOpacity key={hotel.id} style={styles.hotelCard}>
                  {hotel.image ? (
                    <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                  ) : (
                    <View style={styles.hotelImagePlaceholder}>
                      <Ionicons name="business-outline" size={30} color="#999" />
                    </View>
                  )}
                  <View style={styles.hotelCardContent}>
                    <ThemedText type="subtitle" style={styles.hotelName} numberOfLines={1}>
                      {hotel.name}
                    </ThemedText>
                    <View style={styles.hotelMeta}>
                      <Ionicons name="location-outline" size={12} color="#666" />
                      <ThemedText style={styles.hotelAddress} numberOfLines={1}>
                        {hotel.address}
                      </ThemedText>
                    </View>
                    <View style={styles.hotelRating}>
                      <View style={styles.starContainer}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < Math.floor(hotel.starRating) ? 'star' : 'star-outline'}
                            size={12}
                            color="#FFD700"
                          />
                        ))}
                        <ThemedText style={styles.ratingText}>
                          {hotel.starRating.toFixed(1)}
                        </ThemedText>
                      </View>
                    </View>
                    {hotel.startingPrice && (
                      <ThemedText style={styles.priceText}>
                        From ${hotel.startingPrice.toFixed(2)}/night
                      </ThemedText>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Easy Booking
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            Book your room in just a few taps. Fast, secure, and hassle-free.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Manage Your Bookings
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            View and manage all your bookings from the Bookings tab.
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
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
  quickSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  quickSearchTextContainer: {
    flex: 1,
  },
  quickSearchTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickSearchSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  hotelScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  hotelCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hotelImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  hotelImagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotelCardContent: {
    padding: 12,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  hotelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  hotelAddress: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  hotelRating: {
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginTop: 4,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
