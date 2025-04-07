import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';
import { theme } from '../theme';

interface Props {
  provider: User;
  onPress: () => void;
}

export function ServiceProviderCard({ provider, onPress }: Props) {
  const skills = provider.skills?.split(',').map(s => s.trim()) || [];
  // Limit the number of skills to display to prevent overflow
  const displaySkills = skills.slice(0, 3);
  const hasMoreSkills = skills.length > 3;
  const initials = provider.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && {
          transform: [{ scale: theme.animation.scale.pressed }],
          opacity: 0.9
        }
      ]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{provider.name}</Text>
            {provider.rating && (
              <View style={styles.ratingContainer}>
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color={theme.colors.accent} />
                  <Text style={styles.ratingText}>{provider.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.reviewCount}>
                  ({provider.reviews?.length || 0} reviews)
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={14} color={theme.colors.success} />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={16} color={theme.colors.text.secondary} />
        <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
          {provider.location.address}
        </Text>
      </View>

      {skills.length > 0 && (
        <View style={styles.skillsContainer}>
          {displaySkills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText} numberOfLines={1} ellipsizeMode="tail">{skill}</Text>
            </View>
          ))}
          {hasMoreSkills && (
            <View style={styles.moreSkillsBadge}>
              <Text style={styles.moreSkillsText}>+{skills.length - 3} more</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Ionicons name="briefcase-outline" size={16} color={theme.colors.surface} />
          <Text style={styles.primaryButtonText}>Hire</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.patternOverlay} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    position: 'relative',
    ...theme.elevation.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm, // Add margin to prevent overflow with the verified badge
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    flexShrink: 0, // Prevent avatar from shrinking
  },
  avatarText: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.h4,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
    flexShrink: 1, // Allow this container to shrink
  },
  name: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: theme.typography.sizes.small,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  reviewCount: {
    marginLeft: 4,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.large,
    flexShrink: 0, // Prevent badge from shrinking
  },
  verifiedText: {
    marginLeft: 4,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.success,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  locationText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    flex: 1, // Take remaining space but allow truncation
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  skillBadge: {
    backgroundColor: theme.colors.earth.clay + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.large,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    maxWidth: '30%', // Adjusted from previous value to avoid overflow
  },
  skillText: {
    color: theme.colors.earth.clay,
    fontSize: theme.typography.sizes.caption,
    fontWeight: '500',
  },
  moreSkillsBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.xs,
  },
  moreSkillsText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.sizes.caption,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.primary + '10',
    flex: 1,
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.primary,
    fontWeight: '500',
    fontSize: theme.typography.sizes.small,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    flex: 1,
    marginRight: 0,
  },
  primaryButtonText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.surface,
    fontWeight: '500',
    fontSize: theme.typography.sizes.small,
  },
  patternOverlay: {
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