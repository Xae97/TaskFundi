import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { SearchBar } from '../components/SearchBar';
import { ServiceProviderCard } from '../components/ServiceProviderCard';
import { User } from '../types';

export function ClientHomeScreen() {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [serviceProviders, setServiceProviders] = useState<User[]>([]);

  // Simulated search functionality
  const searchServiceProviders = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock service providers data
      const mockProviders: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'fundi',
          skills: 'Plumbing, Electrical',
          rating: 4.5,
          location: {
            latitude: 0,
            longitude: 0,
            address: 'Nairobi, Kenya'
          }
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'fundi',
          skills: 'Carpentry, Painting',
          rating: 4.8,
          location: {
            latitude: 0,
            longitude: 0,
            address: 'Mombasa, Kenya'
          }
        },
        // Add more mock providers as needed
      ];

      // Filter providers based on search query
      const filtered = query
        ? mockProviders.filter(provider => 
            provider.name.toLowerCase().includes(query.toLowerCase()) ||
            provider.skills?.toLowerCase().includes(query.toLowerCase()) ||
            provider.location.address.toLowerCase().includes(query.toLowerCase())
          )
        : mockProviders;

      setServiceProviders(filtered);
    } catch (error) {
      console.error('Error searching providers:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search when user submits
  const handleSearch = () => {
    searchServiceProviders(searchQuery);
  };

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await searchServiceProviders(searchQuery);
    setRefreshing(false);
  }, [searchQuery, searchServiceProviders]);

  // Initial load
  React.useEffect(() => {
    searchServiceProviders('');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
        <Text style={styles.subtitle}>Find the perfect service provider for your needs</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        placeholder="Search by service, name, or location..."
      />

      <FlatList
        data={serviceProviders}
        renderItem={({ item }) => (
          <ServiceProviderCard
            provider={item}
            onPress={() => {
              // TODO: Navigate to provider details
              console.log('Navigate to provider:', item.id);
            }}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Searching...' : 'No service providers found'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#ff3b30',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});