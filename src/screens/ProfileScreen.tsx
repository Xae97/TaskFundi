import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  TextInput,
  Modal,
  Alert,
  FlatList
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

// Define the PortfolioItem interface
interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  imageUrl: string;
  clientName: string;
}

export function ProfileScreen() {
  const { user, signOut, switchUserRole, originalRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    skills: user?.skills || '',
    location: user?.location?.address || '',
    isRemoteAvailable: user?.isRemoteAvailable || false,
    bio: user?.bio || ''
  });

  const mockPortfolio: PortfolioItem[] = [
    {
      id: '1',
      title: 'Kitchen Renovation',
      description: 'Complete kitchen remodeling with new cabinets and countertops',
      date: new Date('2025-02-10'),
      imageUrl: 'https://example.com/kitchen.jpg',
      clientName: 'Robert Johnson'
    },
    {
      id: '2',
      title: 'Bathroom Plumbing',
      description: 'Fixed leaking pipes and installed new shower',
      date: new Date('2025-01-15'),
      imageUrl: 'https://example.com/bathroom.jpg',
      clientName: 'Sarah Williams'
    },
    {
      id: '3',
      title: 'Electrical Wiring',
      description: 'Rewired living room and installed new fixtures',
      date: new Date('2024-12-20'),
      imageUrl: 'https://example.com/electrical.jpg',
      clientName: 'David Thompson'
    }
  ];

  const jobStats = {
    completed: 24,
    inProgress: 3,
    totalEarned: 2750,
    avgRating: 4.8,
    onTimePercentage: 95,
    projectsThisMonth: 6
  };

  const verificationStatus = {
    isVerified: true,
    verifiedSince: new Date('2024-06-01'),
    idVerified: true,
    skillsVerified: true,
    backgroundChecked: true
  };

  const mockReviews = [
    {
      id: '1',
      rating: 5,
      comment: "Excellent work! Very professional and completed the job ahead of schedule.",
      userName: "Jane Smith",
      date: new Date('2025-03-15')
    },
    {
      id: '2',
      rating: 4,
      comment: "Good quality work and communication. Would hire again.",
      userName: "Michael Brown",
      date: new Date('2025-03-02')
    }
  ];

  const [showReviews, setShowReviews] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

  const handleSaveProfile = () => {
    Alert.alert(
      "Profile Updated",
      "Your profile has been successfully updated!",
      [{ text: "OK", onPress: () => setIsEditing(false) }]
    );
  };

  const handleRoleSwitch = async () => {
    try {
      await switchUserRole();
      Alert.alert(
        "Mode Switched", 
        `You are now in ${user?.role === 'client' ? 'Fundi' : 'Client'} mode.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error switching role:", error);
      Alert.alert("Error", "Failed to switch roles. Please try again.");
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons 
          key={i}
          name={i <= rating ? "star" : "star-outline"} 
          size={16} 
          color={i <= rating ? theme.colors.accent : theme.colors.text.muted} 
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  const renderPortfolioItem = ({ item }: { item: PortfolioItem }) => (
    <TouchableOpacity 
      style={styles.portfolioItem}
      onPress={() => {
        setSelectedPortfolioItem(item);
        setShowPortfolio(true);
      }}
    >
      <View style={styles.portfolioImagePlaceholder}>
        <Ionicons name="construct-outline" size={30} color={theme.colors.earth.terracotta} />
      </View>
      <View style={styles.portfolioItemContent}>
        <Text style={styles.portfolioItemTitle}>{item.title}</Text>
        <Text style={styles.portfolioItemDate}>
          {item.date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const isFundi = user?.role === 'fundi';
  const isOriginallyFundi = originalRole === 'fundi' || user?.skills;

  const avgRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.name}>{user?.name}</Text>
                  {verificationStatus.isVerified && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={18} 
                      color={theme.colors.success}
                      style={{marginLeft: 4}} 
                    />
                  )}
                </View>
                <View style={[
                  styles.roleBadge, 
                  isFundi ? styles.fundiBadge : styles.clientBadge
                ]}>
                  <Text style={styles.roleText}>{isFundi ? 'Fundi' : 'Client'}</Text>
                </View>
              </View>
              <Text style={styles.email}>{user?.email}</Text>
              {isFundi && avgRating > 0 && (
                <View style={styles.ratingContainer}>
                  {renderStars(avgRating)}
                  <Text style={styles.ratingText}>({avgRating.toFixed(1)})</Text>
                </View>
              )}
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color={theme.colors.earth.terracotta} />
                <Text style={styles.locationText}>{user?.location?.address || 'Location not specified'}</Text>
              </View>
            </View>
          </View>
          
          {isOriginallyFundi && user?.role !== originalRole && (
            <View style={styles.modeIndicator}>
              <Ionicons 
                name={isFundi ? "hammer-outline" : "person-outline"} 
                size={16} 
                color={theme.colors.primary}
              />
              <Text style={styles.modeText}>
                Currently in {isFundi ? 'Service Provider' : 'Client'} mode
              </Text>
            </View>
          )}
          
          {user?.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bio}>{user.bio}</Text>
            </View>
          )}
        </View>

        {!isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Switch Mode</Text>
            <TouchableOpacity 
              style={styles.roleSwitchButton}
              onPress={handleRoleSwitch}
            >
              <View style={styles.roleSwitchContent}>
                <Ionicons 
                  name="swap-horizontal" 
                  size={28} 
                  color={theme.colors.surface} 
                />
                <Text style={styles.roleSwitchText}>
                  Switch to {isFundi ? 'Client' : 'Service Provider'} Mode
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.roleSwitchDescription}>
              {isFundi 
                ? 'Switch to Client mode to hire other service providers' 
                : 'Switch to Service Provider mode to offer your services'
              }
            </Text>
          </View>
        )}

        {isFundi && !isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Statistics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{jobStats.completed}</Text>
                <Text style={styles.statLabel}>Jobs Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{jobStats.inProgress}</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{jobStats.onTimePercentage}%</Text>
                <Text style={styles.statLabel}>On-Time</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{jobStats.projectsThisMonth}</Text>
                <Text style={styles.statLabel}>This Month</Text>
              </View>
            </View>
            <View style={styles.earningsSummary}>
              <Text style={styles.earningsLabel}>Total Earnings</Text>
              <Text style={styles.earningsValue}>${jobStats.totalEarned}</Text>
            </View>
          </View>
        )}
        
        {isFundi && !isEditing && verificationStatus.isVerified && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verification</Text>
            <View style={styles.verificationContainer}>
              <View style={styles.verificationItem}>
                <Ionicons 
                  name={verificationStatus.idVerified ? "checkmark-circle" : "ellipse-outline"} 
                  size={22} 
                  color={verificationStatus.idVerified ? theme.colors.success : theme.colors.text.muted}
                />
                <Text style={[
                  styles.verificationText,
                  verificationStatus.idVerified ? styles.verifiedText : styles.unverifiedText
                ]}>
                  Identity Verified
                </Text>
              </View>
              <View style={styles.verificationItem}>
                <Ionicons 
                  name={verificationStatus.skillsVerified ? "checkmark-circle" : "ellipse-outline"} 
                  size={22} 
                  color={verificationStatus.skillsVerified ? theme.colors.success : theme.colors.text.muted}
                />
                <Text style={[
                  styles.verificationText,
                  verificationStatus.skillsVerified ? styles.verifiedText : styles.unverifiedText
                ]}>
                  Skills Verified
                </Text>
              </View>
              <View style={styles.verificationItem}>
                <Ionicons 
                  name={verificationStatus.backgroundChecked ? "checkmark-circle" : "ellipse-outline"} 
                  size={22} 
                  color={verificationStatus.backgroundChecked ? theme.colors.success : theme.colors.text.muted}
                />
                <Text style={[
                  styles.verificationText,
                  verificationStatus.backgroundChecked ? styles.verifiedText : styles.unverifiedText
                ]}>
                  Background Checked
                </Text>
              </View>
            </View>
            <Text style={styles.verificationDate}>
              Verified since {verificationStatus.verifiedSince.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </View>
        )}

        {isEditing ? (
          <View style={styles.editForm}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput 
              style={styles.input} 
              value={editedUser.name}
              onChangeText={(text) => setEditedUser({...editedUser, name: text})}
              placeholder="Your name"
            />
            
            {isFundi && (
              <>
                <Text style={styles.inputLabel}>Skills</Text>
                <TextInput 
                  style={styles.input} 
                  value={editedUser.skills}
                  onChangeText={(text) => setEditedUser({...editedUser, skills: text})}
                  placeholder="e.g. Plumbing, Electrical, Carpentry"
                />
              </>
            )}
            
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput 
              style={styles.input} 
              value={editedUser.location}
              onChangeText={(text) => setEditedUser({...editedUser, location: text})}
              placeholder="Your location"
            />

            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput 
              style={[styles.input, styles.bioInput]} 
              value={editedUser.bio}
              onChangeText={(text) => setEditedUser({...editedUser, bio: text})}
              placeholder="Tell clients about yourself..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {isFundi && (
              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.inputLabel}>Available for Remote Work</Text>
                  <Text style={styles.switchSubtitle}>Toggle this if you can provide services remotely</Text>
                </View>
                <Switch 
                  value={editedUser.isRemoteAvailable}
                  onValueChange={(value) => setEditedUser({...editedUser, isRemoteAvailable: value})}
                  trackColor={{ false: theme.colors.background, true: theme.colors.accent + '80' }}
                  thumbColor={editedUser.isRemoteAvailable ? theme.colors.accent : '#f4f3f4'}
                />
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {isFundi && user?.skills && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillsContainer}>
                  {user.skills.split(',').map((skill, index) => (
                    <View key={index} style={styles.skillBadge}>
                      <Text style={styles.skillText}>{skill.trim()}</Text>
                    </View>
                  ))}
                </View>
                {user.isRemoteAvailable && (
                  <View style={styles.remoteWorkBadge}>
                    <Ionicons name="globe-outline" size={18} color={theme.colors.accent} />
                    <Text style={styles.remoteWorkText}>Available for Remote Work</Text>
                  </View>
                )}
              </View>
            )}
            
            {isFundi && mockPortfolio.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Portfolio</Text>
                  <TouchableOpacity onPress={() => setShowPortfolio(true)}>
                    <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={mockPortfolio.slice(0, 2)}
                  renderItem={renderPortfolioItem}
                  keyExtractor={item => item.id}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.portfolioList}
                />
              </View>
            )}

            {isFundi && mockReviews.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Reviews</Text>
                  <TouchableOpacity onPress={() => setShowReviews(true)}>
                    <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
                </View>
                {mockReviews.slice(0, 2).map(review => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewName}>{review.userName}</Text>
                      <Text style={styles.reviewDate}>
                        {review.date.toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                    {renderStars(review.rating)}
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              <View style={styles.menuSection}>
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => setIsEditing(true)}
                >
                  <Ionicons name="person-outline" size={24} color={theme.colors.text.primary} />
                  <Text style={styles.menuText}>Edit Profile</Text>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.text.muted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Ionicons name="notifications-outline" size={24} color={theme.colors.text.primary} />
                  <Text style={styles.menuText}>Notifications</Text>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.text.muted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Ionicons name="card-outline" size={24} color={theme.colors.text.primary} />
                  <Text style={styles.menuText}>Payment Methods</Text>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.text.muted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Ionicons name="settings-outline" size={24} color={theme.colors.text.primary} />
                  <Text style={styles.menuText}>Settings</Text>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.text.muted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Ionicons name="help-circle-outline" size={24} color={theme.colors.text.primary} />
                  <Text style={styles.menuText}>Help & Support</Text>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.text.muted} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {!isEditing && (
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={showReviews}
        onRequestClose={() => setShowReviews(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowReviews(false)}
            >
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>All Reviews</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {mockReviews.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewName}>{review.userName}</Text>
                  <Text style={styles.reviewDate}>
                    {review.date.toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
                {renderStars(review.rating)}
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showPortfolio}
        onRequestClose={() => setShowPortfolio(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPortfolio(false)}
            >
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Portfolio</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedPortfolioItem ? (
              <View style={styles.portfolioDetailContainer}>
                <View style={styles.portfolioDetailImageContainer}>
                  <View style={styles.portfolioImagePlaceholder}>
                    <Ionicons name="construct-outline" size={60} color={theme.colors.earth.terracotta} />
                  </View>
                </View>
                <Text style={styles.portfolioDetailTitle}>{selectedPortfolioItem.title}</Text>
                <Text style={styles.portfolioDetailDate}>
                  {selectedPortfolioItem.date.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
                <Text style={styles.portfolioDetailClient}>Client: {selectedPortfolioItem.clientName}</Text>
                <Text style={styles.portfolioDetailDescription}>{selectedPortfolioItem.description}</Text>
                <TouchableOpacity 
                  style={styles.backToListButton}
                  onPress={() => setSelectedPortfolioItem(null)}
                >
                  <Text style={styles.backToListText}>Back to List</Text>
                </TouchableOpacity>
              </View>
            ) : (
              mockPortfolio.map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.portfolioListItem}
                  onPress={() => setSelectedPortfolioItem(item)}
                >
                  <View style={styles.portfolioListImagePlaceholder}>
                    <Ionicons name="construct-outline" size={40} color={theme.colors.earth.terracotta} />
                  </View>
                  <View style={styles.portfolioListContent}>
                    <Text style={styles.portfolioListTitle}>{item.title}</Text>
                    <Text style={styles.portfolioListDate}>
                      {item.date.toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Text>
                    <Text numberOfLines={2} style={styles.portfolioListDescription}>{item.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.text.muted} />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    paddingTop: 60,
    ...theme.elevation.small,
    marginBottom: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.surface,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.small,
  },
  fundiBadge: {
    backgroundColor: theme.colors.accent + '20',
  },
  clientBadge: {
    backgroundColor: theme.colors.primary + '20',
  },
  roleText: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  email: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  ratingText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginLeft: 6,
  },
  section: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    ...theme.elevation.small,
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
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  skillBadge: {
    backgroundColor: theme.colors.earth.clay + '15',
    paddingHorizontal: theme.spacing.md,
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
  remoteWorkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent + '15',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  remoteWorkText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.accent,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  reviewCard: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  reviewName: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  reviewDate: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.muted,
  },
  reviewComment: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  menuSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  menuText: {
    flex: 1,
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.primary,
  },
  signOutButton: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    ...theme.elevation.small,
  },
  signOutText: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
  },
  editForm: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    ...theme.elevation.small,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  switchSubtitle: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  button: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    ...theme.elevation.small,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    paddingTop: 60,
    backgroundColor: theme.colors.surface,
    ...theme.elevation.small,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.sm,
  },
  modeText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.primary,
    fontWeight: '500',
    marginLeft: 6,
  },
  roleSwitchButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.elevation.small,
  },
  roleSwitchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleSwitchText: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  roleSwitchDescription: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  bioContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  },
  bio: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  portfolioList: {
    paddingVertical: theme.spacing.sm,
    paddingRight: theme.spacing.md,
  },
  portfolioItem: {
    width: 140,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  portfolioImagePlaceholder: {
    height: 100,
    backgroundColor: theme.colors.earth.clay + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  portfolioItemContent: {
    padding: theme.spacing.sm,
  },
  portfolioItemTitle: {
    fontSize: theme.typography.sizes.small,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  portfolioItemDate: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.text.muted,
  },
  portfolioListItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    alignItems: 'center',
  },
  portfolioListImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.earth.clay + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.medium,
    marginRight: theme.spacing.md,
  },
  portfolioListContent: {
    flex: 1,
  },
  portfolioListTitle: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  portfolioListDate: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.muted,
    marginBottom: 4,
  },
  portfolioListDescription: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
  },
  portfolioDetailContainer: {
    padding: theme.spacing.lg,
  },
  portfolioDetailImageContainer: {
    marginBottom: theme.spacing.lg,
  },
  portfolioDetailTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  portfolioDetailDate: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  portfolioDetailClient: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  portfolioDetailDescription: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  backToListButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary + '15',
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  backToListText: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    width: '48%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  earningsSummary: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  earningsValue: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: 'bold',
    color: theme.colors.success,
  },
  verificationContainer: {
    marginBottom: theme.spacing.md,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  verificationText: {
    fontSize: theme.typography.sizes.body,
    marginLeft: theme.spacing.sm,
  },
  verifiedText: {
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  unverifiedText: {
    color: theme.colors.text.muted,
  },
  verificationDate: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
});