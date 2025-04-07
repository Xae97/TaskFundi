import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface Props {
  title: string;
  description: string;
  location: string;
  price: string;
  category: string;
  requiredSkills: string[];
  isRemote: boolean;
  onPress: () => void;
}

export function JobPostCard({
  title,
  description,
  location,
  price,
  category,
  requiredSkills,
  isRemote,
  onPress,
}: Props) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <Text style={styles.price}>KSh {price}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      <View style={styles.locationContainer}>
        {isRemote ? (
          <>
            <Ionicons name="globe-outline" size={16} color={theme.colors.accent} />
            <Text style={[styles.locationText, styles.remoteText]}>Remote Work</Text>
          </>
        ) : (
          <>
            <Ionicons name="location-outline" size={16} color={theme.colors.earth.terracotta} />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </>
        )}
      </View>

      <View style={styles.skillsContainer}>
        {requiredSkills.map((skill, index) => (
          <View key={index} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.postedContainer}>
          <Ionicons name="time-outline" size={14} color={theme.colors.text.secondary} />
          <Text style={styles.postedText}>Posted today</Text>
        </View>
        <View style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
        </View>
      </View>

      <View style={styles.decorativePattern} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.elevation.small,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.large,
  },
  categoryText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.caption,
    fontWeight: '500',
  },
  price: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
    color: theme.colors.earth.coffee,
  },
  title: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  locationText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  remoteText: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  skillBadge: {
    backgroundColor: theme.colors.earth.clay + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.large,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  skillText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.earth.clay,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  },
  postedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postedText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.primary,
    fontWeight: '500',
    marginRight: theme.spacing.xs,
  },
  decorativePattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    opacity: 0.05,
    backgroundColor: theme.colors.primary,
    transform: [{ rotate: '45deg' }, { translateX: 60 }, { translateY: -60 }],
  },
});