import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JobPost } from '../types';

interface Props {
  jobPost: JobPost;
  onPress: () => void;
}

export function JobPostCard({ jobPost, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{jobPost.title}</Text>
        <View style={styles.budgetContainer}>
          <Text style={styles.budget}>
            {jobPost.budget.currency} {jobPost.budget.amount}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {jobPost.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.location}>{jobPost.location.address}</Text>
        </View>
        
        <View style={styles.skillsContainer}>
          {jobPost.requiredSkills.slice(0, 2).map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {jobPost.requiredSkills.length > 2 && (
            <Text style={styles.moreSkills}>+{jobPost.requiredSkills.length - 2}</Text>
          )}
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, styles[`status_${jobPost.status}`]]}>
          <Text style={styles.statusText}>{jobPost.status}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(jobPost.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  budgetContainer: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  budget: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  skillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 4,
  },
  skillText: {
    fontSize: 12,
    color: '#666',
  },
  moreSkills: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  status_open: {
    backgroundColor: '#e8f5e9',
  },
  status_assigned: {
    backgroundColor: '#fff3e0',
  },
  status_in_progress: {
    backgroundColor: '#e3f2fd',
  },
  status_completed: {
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});