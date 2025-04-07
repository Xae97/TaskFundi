import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { jobService } from '../services/JobService';
import { JobPost } from '../types';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JobDetails'>;
  route: RouteProp<RootStackParamList, 'JobDetails'>;
};

export function JobDetailsScreen({ navigation, route }: Props) {
  const { jobId } = route.params;
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [job, setJob] = useState<JobPost | undefined>(jobService.getJobById(jobId));

  // Format date to display in a readable format
  const formattedDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  // Handle apply for job action
  const handleApplyForJob = () => {
    setIsApplying(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsApplying(false);
      Alert.alert(
        'Application Submitted',
        'Your application has been submitted. You will be notified if the client is interested.',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  if (!job) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  // Check if the current user is the client who posted this job
  const isJobOwner = user?.id === job.clientId;

  // Format remote work badge text based on location flexibility
  const getRemoteWorkLabel = () => {
    if (!job.location.address.toLowerCase().includes('remote') && job.isRemote) {
      return 'Can be done remotely';
    } else if (job.location.address.toLowerCase().includes('remote')) {
      return 'Fully remote';
    }
    return 'Remote work available';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Job Details</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Job Header Section */}
          <View style={styles.jobHeader}>
            <View style={styles.jobTitleRow}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{job.status.toUpperCase()}</Text>
              </View>
            </View>
            
            {/* Remote Work Badge - Display prominently at the top if it's a remote job */}
            {job.isRemote && (
              <View style={styles.remoteWorkBanner}>
                <Ionicons name="globe-outline" size={20} color={theme.colors.accent} />
                <Text style={styles.remoteWorkText}>{getRemoteWorkLabel()}</Text>
              </View>
            )}

            <View style={styles.categoryBudgetRow}>
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Category</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{job.category}</Text>
                </View>
              </View>

              <View style={styles.budgetContainer}>
                <Text style={styles.budgetLabel}>Budget</Text>
                <Text style={styles.budgetText}>
                  {job.budget.currency} {job.budget.amount.toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons 
                name={job.isRemote ? "location-outline" : "location"} 
                size={20} 
                color={theme.colors.earth.terracotta} 
              />
              <Text style={styles.detailText}>{job.location.address}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color={theme.colors.primary} />
              <Text style={styles.detailText}>Posted on {formattedDate}</Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{job.description}</Text>
          </View>

          {/* Skills Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Skills</Text>
            <View style={styles.skillsContainer}>
              {job.requiredSkills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationCard}>
              {job.isRemote ? (
                <View style={styles.remoteMapPlaceholder}>
                  <Ionicons name="globe" size={40} color={theme.colors.accent} />
                  <Text style={styles.remoteMapPlaceholderText}>Remote Work Available</Text>
                  <Text style={styles.remoteWorkDescription}>
                    This job can be completed remotely. Coordinate with the client for any specific requirements.
                  </Text>
                </View>
              ) : (
                <View style={styles.mapPlaceholder}>
                  <Ionicons name="map" size={32} color={theme.colors.earth.terracotta} />
                  <Text style={styles.mapPlaceholderText}>Map View</Text>
                </View>
              )}
              
              <Text style={styles.locationText}>{job.location.address}</Text>
              {job.isRemote && (
                <View style={styles.remoteBadge}>
                  <Ionicons name="globe-outline" size={16} color={theme.colors.accent} />
                  <Text style={styles.remoteText}>{getRemoteWorkLabel()}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Client Section (if not the job owner) */}
          {!isJobOwner && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Client</Text>
              <View style={styles.clientCard}>
                <View style={styles.clientAvatar}>
                  <Text style={styles.clientAvatarText}>C</Text>
                </View>
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>Client</Text>
                  <Text style={styles.clientLocation}>
                    <Ionicons name="location-outline" size={14} color={theme.colors.text.secondary} />
                    {' ' + job.location.address}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Apply Button (if not the job owner) */}
      {!isJobOwner && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyForJob}
            disabled={isApplying}
          >
            {isApplying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="paper-plane" size={20} color="#fff" style={styles.applyButtonIcon} />
                <Text style={styles.applyButtonText}>Apply for Job</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    ...theme.elevation.small,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  jobHeader: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.elevation.small,
  },
  jobTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  jobTitle: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.caption,
    fontWeight: '600',
  },
  remoteWorkBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent + '15',
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  remoteWorkText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.accent,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  categoryBudgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  categoryContainer: {},
  categoryLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.large,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.small,
    fontWeight: '500',
  },
  budgetContainer: {},
  budgetLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
  },
  budgetText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.earth.coffee,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  detailText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.elevation.small,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  descriptionText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: theme.colors.earth.clay + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.large,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  skillText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.earth.clay,
    fontWeight: '500',
  },
  locationCard: {
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.small,
  },
  remoteMapPlaceholder: {
    height: 150,
    backgroundColor: theme.colors.accent + '10',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
  },
  remoteMapPlaceholderText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.accent,
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
  },
  remoteWorkDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.small,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  locationText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.primary,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  remoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.accent + '10',
  },
  remoteText: {
    color: theme.colors.accent,
    fontSize: theme.typography.sizes.small,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.earth.sand,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  clientAvatarText: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: 'bold',
    color: theme.colors.earth.coffee,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  clientLocation: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
  },
  footer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
    ...theme.elevation.medium,
  },
  applyButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...theme.elevation.small,
  },
  applyButtonIcon: {
    marginRight: theme.spacing.sm,
  },
  applyButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
  },
});