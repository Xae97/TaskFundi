import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/JobService';
import { JobPost } from '../types';
import { SearchBar } from '../components/SearchBar';
import { JobPostCard } from '../components/JobPostCard';
import { theme } from '../theme';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function FundiHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [availableJobs, setAvailableJobs] = useState<JobPost[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);

  // Load jobs data
  const loadJobs = useCallback(() => {
    const allJobs = jobService.getAllJobs().filter(job => job.status === 'open');
    setAvailableJobs(allJobs);
    applyFilters(allJobs, activeFilter, showRemoteOnly);
  }, [activeFilter, showRemoteOnly]);

  // Initial load
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Handle search with remote filter
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      applyFilters(availableJobs, activeFilter, showRemoteOnly);
      return;
    }

    const results = jobService.searchJobs(searchQuery);
    const openJobs = results.filter(job => job.status === 'open');
    applyFilters(openJobs, activeFilter, showRemoteOnly);
  };

  // Apply category and remote filters
  const applyFilters = (jobs: JobPost[], categoryFilter: string, remoteOnly: boolean) => {
    let filtered = jobs;

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(job => 
        job.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Apply remote filter
    if (remoteOnly) {
      filtered = filtered.filter(job => job.isRemote);
    }

    setFilteredJobs(filtered);
  };

  // Handle category filter change
  const applyFilter = (filter: string) => {
    setActiveFilter(filter);
    applyFilters(availableJobs, filter, showRemoteOnly);
  };

  // Handle remote filter toggle
  const toggleRemoteFilter = () => {
    const newValue = !showRemoteOnly;
    setShowRemoteOnly(newValue);
    applyFilters(availableJobs, activeFilter, newValue);
  };

  // Get skills that match the service provider's skills
  const getMatchingSkills = (jobSkills: string[]) => {
    if (!user?.skills) return [];
    const userSkills = user.skills.split(',').map(skill => skill.trim().toLowerCase());
    return jobSkills.filter(skill => 
      userSkills.includes(skill.toLowerCase())
    );
  };

  // Navigate to job details
  const navigateToJobDetails = (jobId: string) => {
    navigation.navigate('JobDetails', { jobId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Find Jobs</Text>
          <Text style={styles.subtitle}>Browse and apply to available jobs</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>2</Text>
          </View>
          <Ionicons 
            name="notifications-outline" 
            size={24} 
            color={theme.colors.text.primary} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="Search jobs, skills, or locations..."
        />
      </View>

      {/* Filter and Remote Toggle Row */}
      <View style={styles.filterSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              activeFilter === 'all' && styles.activeFilterChip
            ]}
            onPress={() => applyFilter('all')}
          >
            <Text style={[
              styles.filterText,
              activeFilter === 'all' && styles.activeFilterText
            ]}>All Jobs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              activeFilter === 'Plumbing' && styles.activeFilterChip
            ]}
            onPress={() => applyFilter('Plumbing')}
          >
            <Text style={[
              styles.filterText,
              activeFilter === 'Plumbing' && styles.activeFilterText
            ]}>Plumbing</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              activeFilter === 'Electrical' && styles.activeFilterChip
            ]}
            onPress={() => applyFilter('Electrical')}
          >
            <Text style={[
              styles.filterText,
              activeFilter === 'Electrical' && styles.activeFilterText
            ]}>Electrical</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              activeFilter === 'Painting' && styles.activeFilterChip
            ]}
            onPress={() => applyFilter('Painting')}
          >
            <Text style={[
              styles.filterText,
              activeFilter === 'Painting' && styles.activeFilterText
            ]}>Painting</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              activeFilter === 'Carpentry' && styles.activeFilterChip
            ]}
            onPress={() => applyFilter('Carpentry')}
          >
            <Text style={[
              styles.filterText,
              activeFilter === 'Carpentry' && styles.activeFilterText
            ]}>Carpentry</Text>
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
        data={filteredJobs}
        renderItem={({ item }) => {
          const matchingSkills = getMatchingSkills(item.requiredSkills);
          const isGoodMatch = matchingSkills.length > 0;

          return (
            <View>
              {isGoodMatch && (
                <View style={styles.matchBanner}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                  <Text style={styles.matchText}>
                    {matchingSkills.length > 1 
                      ? `${matchingSkills.length} skills match your profile` 
                      : '1 skill matches your profile'}
                  </Text>
                </View>
              )}
              <JobPostCard
                title={item.title}
                description={item.description}
                location={item.location.address}
                price={item.budget.amount.toString()}
                category={item.category}
                requiredSkills={item.requiredSkills}
                isRemote={item.isRemote || false}
                onPress={() => navigateToJobDetails(item.id)}
              />
            </View>
          );
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.jobsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={theme.colors.text.muted} />
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filters to find more opportunities
              {showRemoteOnly ? ' or turn off remote-only filter' : ''}
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.elevation.small,
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
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationCount: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
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
  jobsList: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  matchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.success + '10',
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.xs,
  },
  matchText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.success,
    fontWeight: '500',
    marginLeft: theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    ...theme.elevation.small,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});