import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { SearchBar } from '../components/SearchBar';
import { ServiceProviderCard } from '../components/ServiceProviderCard';
import { JobPostCard } from '../components/JobPostCard';
import { User, JobPost } from '../types';

type TabType = 'fundis' | 'jobs';

export function ClientFundiScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('fundis');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [serviceProviders, setServiceProviders] = useState<User[]>([]);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);

  // Simulated search functionality
  const searchServiceProviders = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      ];

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

  // Simulated job posts data
  const fetchJobPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockJobs: JobPost[] = [
        {
          id: '1',
          title: 'Bathroom Renovation',
          description: 'Need a skilled plumber for complete bathroom renovation including new fixtures and tiling.',
          budget: {
            amount: 50000,
            currency: 'KES',
          },
          location: {
            address: 'Kilimani, Nairobi',
            latitude: 0,
            longitude: 0,
          },
          category: 'Plumbing',
          clientId: user?.id || '',
          status: 'open',
          createdAt: new Date(),
          requiredSkills: ['Plumbing', 'Tiling'],
        },
        {
          id: '2',
          title: 'House Painting',
          description: 'Looking for a professional painter for interior house painting, 3 bedrooms.',
          budget: {
            amount: 35000,
            currency: 'KES',
          },
          location: {
            address: 'Westlands, Nairobi',
            latitude: 0,
            longitude: 0,
          },
          category: 'Painting',
          clientId: user?.id || '',
          status: 'open',
          createdAt: new Date(),
          requiredSkills: ['Painting', 'Interior Design'],
        },
      ];

      setJobPosts(mockJobs);
    } catch (error) {
      console.error('Error fetching job posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Handle search
  const handleSearch = () => {
    if (activeTab === 'fundis') {
      searchServiceProviders(searchQuery);
    } else {
      // TODO: Implement job search
    }
  };

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activeTab === 'fundis') {
      await searchServiceProviders(searchQuery);
    } else {
      await fetchJobPosts();
    }
    setRefreshing(false);
  }, [activeTab, searchQuery, searchServiceProviders, fetchJobPosts]);

  // Initial load
  React.useEffect(() => {
    if (activeTab === 'fundis') {
      searchServiceProviders('');
    } else {
      fetchJobPosts();
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find & Hire</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'fundis' && styles.activeTab]}
          onPress={() => setActiveTab('fundis')}
        >
          <Text style={[styles.tabText, activeTab === 'fundis' && styles.activeTabText]}>
            Find Fundi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
          onPress={() => setActiveTab('jobs')}
        >
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>
            My Job Posts
          </Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        placeholder={
          activeTab === 'fundis'
            ? "Search by service, name, or location..."
            : "Search my job posts..."
        }
      />

      {activeTab === 'fundis' ? (
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
      ) : (
        <FlatList
          data={jobPosts}
          renderItem={({ item }) => (
            <JobPostCard
              jobPost={item}
              onPress={() => {
                // TODO: Navigate to job post details
                console.log('Navigate to job post:', item.id);
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
                {isLoading ? 'Loading...' : 'No job posts found'}
              </Text>
            </View>
          }
        />
      )}

      {activeTab === 'jobs' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            // TODO: Navigate to create job post
            console.log('Navigate to create job post');
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});