import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchBar, SearchFilters } from '../components/SearchBar';
import { JobPostCard } from '../components/JobPostCard';
import { ServiceProviderCard } from '../components/ServiceProviderCard';
import { RootStackParamList } from '../navigation/types';
import { JobPost, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/JobService';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ClientFundiScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'jobs' | 'fundis'>('jobs');
  const [refreshing, setRefreshing] = useState(false);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [serviceProviders, setServiceProviders] = useState<User[]>([]);

  // Initial load
  React.useEffect(() => {
    loadData();
  }, []);

  // Load data based on active tab
  const loadData = useCallback(async () => {
    if (activeTab === 'jobs') {
      const jobs = jobService.getAllJobs();
      setJobPosts(jobs);
    } else {
      // TODO: Load service providers
      setServiceProviders([]);
    }
  }, [activeTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleSearch = useCallback(() => {
    if (activeTab === 'jobs') {
      const filteredJobs = jobService.searchJobs(searchQuery);
      setJobPosts(filteredJobs);
    } else {
      // TODO: Implement service provider search
    }
  }, [searchQuery, activeTab]);

  const handleFilterChange = useCallback((filters: SearchFilters) => {
    if (activeTab === 'jobs') {
      const filteredJobs = jobService.filterJobs({
        category: filters.category,
        minBudget: filters.priceRange?.min,
        maxBudget: filters.priceRange?.max,
      });
      setJobPosts(filteredJobs);
    }
  }, [activeTab]);

  const renderJobPost = ({ item }: { item: JobPost }) => (
    <JobPostCard
      title={item.title}
      description={item.description}
      location={item.location.address}
      price={item.budget.amount.toString()}
      category={item.category}
      requiredSkills={item.requiredSkills}
      onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
    />
  );

  const renderServiceProvider = ({ item }: { item: User }) => (
    <ServiceProviderCard
      provider={item}
      onPress={() => console.log('Navigate to provider details:', item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {activeTab === 'jobs' ? 'Find Jobs' : 'Service Providers'}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
          onPress={() => setActiveTab('jobs')}
        >
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>
            Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'fundis' && styles.activeTab]}
          onPress={() => setActiveTab('fundis')}
        >
          <Text style={[styles.tabText, activeTab === 'fundis' && styles.activeTabText]}>
            Fundis
          </Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        onFilterChange={handleFilterChange}
        placeholder={activeTab === 'jobs' ? "Search jobs..." : "Search service providers..."}
      />

      <FlatList
        data={activeTab === 'jobs' ? jobPosts : serviceProviders}
        renderItem={activeTab === 'jobs' ? renderJobPost : renderServiceProvider}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'jobs'
                ? 'No job posts found'
                : 'No service providers found'}
            </Text>
          </View>
        }
      />

      {activeTab === 'jobs' && user?.role === 'client' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateJob')}
        >
          <Ionicons name="add" size={24} color={theme.colors.surface} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.elevation.small,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  list: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.body,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: Platform.OS === 'ios' ? 40 : 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.elevation.medium,
  },
});