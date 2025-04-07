import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Typography } from './Typography';

interface Props {
  title: string;
  description: string;
  location: string;
  price: string;
  category: string;
  requiredSkills: string[];
  isRemote: boolean;
  postedTime?: string;
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
  postedTime = 'Posted today',
  onPress,
}: Props) {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Dynamic shadow style based on animation
  const animatedShadowStyle = {
    shadowOpacity: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 0.3],
    }),
    shadowRadius: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [2, 8],
    }),
    elevation: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [2, 6],
    }),
  };

  // Limit skills to display
  const displaySkills = requiredSkills.slice(0, 3);
  const hasMoreSkills = requiredSkills.length > 3;

  return (
    <Animated.View
      style={[
        styles.containerOuter,
        animatedShadowStyle,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.container}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        <View style={styles.header}>
          <View style={styles.categoryBadge}>
            <Ionicons 
              name={getCategoryIcon(category)} 
              size={12} 
              color={theme.colors.primary} 
              style={styles.categoryIcon}
            />
            <Typography variant="caption" color="primary" style={styles.categoryText} numberOfLines={1}>
              {category}
            </Typography>
          </View>
          <View style={styles.priceBadge}>
            <Typography variant="bodyBold" color="primary" numberOfLines={1}>
              KSh {price}
            </Typography>
          </View>
        </View>

        <Typography variant="h4" style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Typography>
        
        <Typography variant="body" color="secondary" style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {description}
        </Typography>

        <View style={styles.locationContainer}>
          {isRemote ? (
            <>
              <Ionicons name="globe-outline" size={16} color={theme.colors.accent} />
              <Typography variant="small" color="accent" style={styles.locationText} numberOfLines={1}>
                Remote Work
              </Typography>
            </>
          ) : (
            <>
              <Ionicons name="location-outline" size={16} color={theme.colors.earth.terracotta} />
              <Typography variant="small" color="secondary" style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                {location}
              </Typography>
            </>
          )}
        </View>

        <View style={styles.skillsContainer}>
          {displaySkills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Typography variant="caption" style={styles.skillText} numberOfLines={1}>
                {skill}
              </Typography>
            </View>
          ))}
          {hasMoreSkills && (
            <View style={styles.moreSkillsBadge}>
              <Typography variant="caption" color="muted">
                +{requiredSkills.length - 3} more
              </Typography>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.postedContainer}>
            <Ionicons name="time-outline" size={14} color={theme.colors.text.secondary} />
            <Typography variant="small" color="secondary" style={styles.postedText} numberOfLines={1}>
              {postedTime}
            </Typography>
          </View>
          <View style={styles.viewDetailsButton}>
            <Typography variant="smallBold" color="accent" style={styles.viewDetailsText}>
              View Details
            </Typography>
            <Ionicons name="arrow-forward" size={16} color={theme.colors.accent} />
          </View>
        </View>

        <View style={styles.decorativePattern} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// Helper function to get icon based on category
function getCategoryIcon(category: string): keyof typeof Ionicons.glyphMap {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('tech') || categoryLower.includes('it')) 
    return 'laptop-outline';
  if (categoryLower.includes('design')) 
    return 'color-palette-outline';
  if (categoryLower.includes('cleaning')) 
    return 'sparkles-outline';
  if (categoryLower.includes('garden') || categoryLower.includes('yard')) 
    return 'leaf-outline';
  if (categoryLower.includes('repair') || categoryLower.includes('plumb')) 
    return 'construct-outline';
  if (categoryLower.includes('electric')) 
    return 'flash-outline';
  if (categoryLower.includes('transport') || categoryLower.includes('moving')) 
    return 'car-outline';
  if (categoryLower.includes('teach') || categoryLower.includes('tutor')) 
    return 'school-outline';
  if (categoryLower.includes('security')) 
    return 'shield-outline';
  return 'briefcase-outline';
}

const styles = StyleSheet.create({
  containerOuter: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  container: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    position: 'relative',
    overflow: 'hidden',
    borderColor: theme.colors.background,
    borderWidth: 1,
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
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.large,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  categoryIcon: {
    marginRight: 4,
    flexShrink: 0,
  },
  categoryText: {
    fontWeight: '500',
    flexShrink: 1,
  },
  priceBadge: {
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.large,
    maxWidth: '40%',
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  description: {
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  locationText: {
    marginLeft: theme.spacing.xs,
    flex: 1,
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
    maxWidth: '45%',
  },
  moreSkillsBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.xs,
  },
  skillText: {
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
    flex: 1,
  },
  postedText: {
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent + '10',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.circle,
    flexShrink: 0,
  },
  viewDetailsText: {
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