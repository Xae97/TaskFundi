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
            <Text style={styles.name}>{provider.name}</Text>
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
        <Text style={styles.locationText} numberOfLines={1}>
          {provider.location.address}
        </Text>
      </View>

      {skills.length > 0 && (
        <View style={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
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
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.h4,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  reviewCount: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.large,
    gap: 4,
  },
  verifiedText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.success,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  locationText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  skillBadge: {
    backgroundColor: theme.colors.earth.clay + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.large,
  },
  skillText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.earth.clay,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    gap: theme.spacing.xs,
  },
  actionButtonText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.small,
    fontWeight: '600',
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