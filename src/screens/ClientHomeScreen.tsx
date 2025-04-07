import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { SearchBar } from '../components/SearchBar';
import { ServiceProviderCard } from '../components/ServiceProviderCard';
import { User } from '../types';
import { theme } from '../theme';

export function ClientHomeScreen() {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [serviceProviders, setServiceProviders] = useState<User[]>([]);
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);
  const [activeSkillFilter, setActiveSkillFilter] = useState('all');

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
          },
          isRemoteAvailable: true
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
          },
          isRemoteAvailable: false
        },
        {
          id: '3',
          name: 'David Wilson',
          email: 'david@example.com',
          role: 'fundi',
          skills: 'Web Design, Programming',
          rating: 4.9,
          location: {
            latitude: 0,
            longitude: 0,
            address: 'Kisumu, Kenya'
          },
          isRemoteAvailable: true
        },
        // Add more mock providers as needed
      ];

      // Apply filters
      let filtered = mockProviders;
      
      // Text search filter
      if (query) {
        filtered = filtered.filter(provider => 
          provider.name.toLowerCase().includes(query.toLowerCase()) ||
          provider.skills?.toLowerCase().includes(query.toLowerCase()) ||
          provider.location.address.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Remote availability filter
      if (showRemoteOnly) {
        filtered = filtered.filter(provider => provider.isRemoteAvailable);
      }

      // Skill filter
      if (activeSkillFilter !== 'all') {
        filtered = filtered.filter(provider => 
          provider.skills?.toLowerCase().includes(activeSkillFilter.toLowerCase())
        );
      }

      setServiceProviders(filtered);
    } catch (error) {
      console.error('Error searching providers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, showRemoteOnly, activeSkillFilter]);

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

  // Toggle remote filter
  const toggleRemoteFilter = () => {
    const newValue = !showRemoteOnly;
    setShowRemoteOnly(newValue);
    searchServiceProviders(searchQuery);
  };

  // Set skill filter
  const applySkillFilter = (skill: string) => {
    setActiveSkillFilter(skill);
    searchServiceProviders(searchQuery);
  };

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

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="Search by service, name, or location..."
        />
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              activeSkillFilter === 'all' && styles.activeFilterChip
            ]}
            onPress={() => applySkillFilter('all')}
          >
            <Text style={[
              styles.filterText,
              activeSkillFilter === 'all' && styles.activeFilterText
            ]}>All Skills</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              activeSkillFilter === 'Plumbing' && styles.activeFilterChip
            ]}
            onPress={() => applySkillFilter('Plumbing')}
          >
            <Text style={[
              styles.filterText,
              activeSkillFilter === 'Plumbing' && styles.activeFilterText
            ]}>Plumbing</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              activeSkillFilter === 'Electrical' && styles.activeFilterChip
            ]}
            onPress={() => applySkillFilter('Electrical')}
          >
            <Text style={[
              styles.filterText,
              activeSkillFilter === 'Electrical' && styles.activeFilterText
            ]}>Electrical</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              activeSkillFilter === 'Carpentry' && styles.activeFilterChip
            ]}
            onPress={() => applySkillFilter('Carpentry')}
          >
            <Text style={[
              styles.filterText,
              activeSkillFilter === 'Carpentry' && styles.activeFilterText
            ]}>Carpentry</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              activeSkillFilter === 'Programming' && styles.activeFilterChip
            ]}
            onPress={() => applySkillFilter('Programming')}
          >
            <Text style={[
              styles.filterText,
              activeSkillFilter === 'Programming' && styles.activeFilterText
            ]}>Programming</Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity 
          style={[
            styles.remoteFilterChip,
            showRemoteOnly && styles.remoteFilterActive
          ]}
          onPress={toggleRemoteFilter}
        >
          <Ionicons 
            name="globe-outline" 
            size={18} 
            color={showRemoteOnly ? theme.colors.surface : theme.colors.accent} 
          />
          <Text style={[
            styles.remoteFilterText,
            showRemoteOnly && styles.remoteFilterTextActive
          ]}>
            Remote
          </Text>
        </TouchableOpacity>
      </View>

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
            {!isLoading && showRemoteOnly && (
              <Text style={styles.emptySubtext}>
                Try turning off the remote filter to see more results
              </Text>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: 60,
    backgroundColor: theme.colors.surface,
  },
  welcome: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  filterContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    ...theme.elevation.small,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.primary,
  },
  activeFilterText: {
    color: theme.colors.surface,
    fontWeight: '500',
  },
  remoteFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    ...theme.elevation.small,
    gap: theme.spacing.xs,
  },
  remoteFilterActive: {
    backgroundColor: theme.colors.accent,
  },
  remoteFilterText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.accent,
  },
  remoteFilterTextActive: {
    color: theme.colors.surface,
    fontWeight: '500',
  },
  list: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    ...theme.elevation.small,
  },
  emptyText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.small,
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: theme.colors.error,
    margin: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
  },
});