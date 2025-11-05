import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Welcome{user ? `, ${user.firstName}` : ''}!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover and book your perfect hotel room
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Featured Hotels
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            Browse through our collection of premium hotels and find the perfect stay for your next trip.
          </ThemedText>
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
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
