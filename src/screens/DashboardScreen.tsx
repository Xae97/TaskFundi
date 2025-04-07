import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/JobService';
import { JobPost } from '../types';
import { theme } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { Header } from '../components/Header';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [recentJobs, setRecentJobs] = useState<JobPost[]>([]);
  const isClient = user?.role === 'client';

  const loadDashboardData = useCallback(() => {
    const allJobs = jobService.getAllJobs();
    const userJobs = allJobs.filter(job => job.clientId === user?.id);
    const recent = userJobs.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    ).slice(0, 3);
    setRecentJobs(recent);
  }, [user?.id]);

  React.useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    loadDashboardData();
    setRefreshing(false);
  }, [loadDashboardData]);

  const getJobStatusCount = (status: JobPost['status']) => {
    return jobService.getAllJobs().filter(
      job => job.clientId === user?.id && job.status === status
    ).length;
  };

  const totalJobs = recentJobs.length;
  const activeJobs = getJobStatusCount('open') + getJobStatusCount('in-progress');
  const completedJobs = getJobStatusCount('completed');

  const renderJobCard = (job: JobPost) => (
    <TouchableOpacity 
      key={job.id}
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
    >
      <View style={styles.jobCardHeader}>
        <View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobLocation}>
            <Ionicons name="location" size={14} color={theme.colors.earth.terracotta} />
            {' '}{job.location.address}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          job.status === 'open' && styles.statusOpen,
          job.status === 'in-progress' && styles.statusInProgress,
          job.status === 'completed' && styles.statusCompleted,
        ]}>
          <Text style={styles.statusText}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Text>
        </View>
      </View>
      <Text style={styles.jobBudget}>KSh {job.budget.amount}</Text>
      <View style={styles.jobCardPattern} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header 
        title={isClient ? "Dashboard" : "Your Tasks"} 
        rightIcon="notifications-outline"
        onRightPress={() => {}} 
        variant="large"
        showLogo={true}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.userSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{user?.name}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.primaryStat]}>
            <View style={styles.statHeader}>
              <View>
                <Text style={styles.statLabel}>Active {isClient ? 'Jobs' : 'Tasks'}</Text>
                <Text style={styles.statValue}>{activeJobs}</Text>
              </View>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={isClient ? "briefcase" : "hammer"} 
                  size={32} 
                  color={theme.colors.primary} 
                />
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: totalJobs > 0 ? `${(activeJobs / totalJobs) * 100}%` : '0%' }
              ]} />
            </View>
            <Text style={styles.progressText}>
              {activeJobs} of {totalJobs} total {isClient ? 'jobs' : 'tasks'}
            </Text>
            <View style={styles.patternOverlay} />
          </View>

          <View style={styles.secondaryStats}>
            <View style={styles.statCard}>
              <View style={styles.secondaryStatContent}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                <Text style={styles.secondaryStatValue}>{completedJobs}</Text>
                <Text style={styles.secondaryStatLabel}>Completed</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.secondaryStatContent}>
                <Ionicons name="star" size={24} color={theme.colors.accent} />
                <Text style={styles.secondaryStatValue}>4.8</Text>
                <Text style={styles.secondaryStatLabel}>Rating</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Fundi' })}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentJobs.length > 0 ? (
            <View style={styles.jobsList}>
              {recentJobs.map(renderJobCard)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="documents-outline" size={48} color={theme.colors.text.muted} />
              </View>
              <Text style={styles.emptyStateTitle}>No recent activity</Text>
              <Text style={styles.emptyStateSubtext}>
                {isClient 
                  ? 'Start by posting a job or finding a service provider'
                  : 'Start by browsing available jobs'}
              </Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Fundi' })}
              >
                <Text style={styles.actionButtonText}>
                  {isClient ? 'Post a Job' : 'Find Jobs'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color={theme.colors.surface} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Fundi' })}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons 
                  name={isClient ? "search" : "briefcase"} 
                  size={24} 
                  color={theme.colors.primary} 
                />
              </View>
              <Text style={styles.quickActionText}>{isClient ? 'Find Fundi' : 'Browse Jobs'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('ChatList')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.accent + '15' }]}>
                <Ionicons name="chatbubbles" size={24} color={theme.colors.accent} />
              </View>
              <Text style={styles.quickActionText}>Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.earth.clay + '15' }]}>
                <Ionicons name="settings" size={24} color={theme.colors.earth.clay} />
              </View>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  userSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  welcomeText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  nameText: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  statsContainer: {
    padding: theme.spacing.lg,
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    ...theme.elevation.medium,
  },
  primaryStat: {
    marginBottom: theme.spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.small,
  },
  progressText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
  },
  secondaryStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  secondaryStatContent: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  secondaryStatValue: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  secondaryStatLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
  },
  section: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  seeAllText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  jobsList: {
    gap: theme.spacing.md,
  },
  jobCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    ...theme.elevation.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  jobTitle: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  jobLocation: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
  },
  jobBudget: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
    color: theme.colors.earth.coffee,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.large,
  },
  statusOpen: {
    backgroundColor: theme.colors.primary + '15',
  },
  statusInProgress: {
    backgroundColor: theme.colors.accent + '15',
  },
  statusCompleted: {
    backgroundColor: theme.colors.success + '15',
  },
  statusText: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  jobCardPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    opacity: 0.05,
    backgroundColor: theme.colors.primary,
    transform: [{ rotate: '45deg' }, { translateX: 50 }, { translateY: -50 }],
  },
  emptyState: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.elevation.medium,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyStateTitle: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    ...theme.elevation.medium,
  },
  actionButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.elevation.medium,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 150,
    height: 150,
    opacity: 0.05,
    backgroundColor: theme.colors.primary,
    transform: [{ rotate: '45deg' }, { translateX: 75 }, { translateY: -75 }],
  },
});