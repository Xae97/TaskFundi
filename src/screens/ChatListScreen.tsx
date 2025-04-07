import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { chatService, Conversation } from '../services/ChatService';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

export function ChatListScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch conversations for the current user
      const userConversations = chatService.getConversationsByUserId(user.id);
      setConversations(userConversations);
      setLoading(false);
    }
  }, [user]);

  const navigateToChat = (conversation: Conversation) => {
    navigation.navigate('ChatDetail', { conversationId: conversation.id });
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.userId !== user?.id);
  };

  const formatTime = (date: Date) => {
    // If today, show time only
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show date without year
    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise, show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getUnreadCount = (conversation: Conversation) => {
    if (!user) return 0;
    
    return conversation.messages.filter(
      message => message.senderId !== user.id && !message.read
    ).length;
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const otherParticipant = getOtherParticipant(item);
    const unreadCount = getUnreadCount(item);
    
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => navigateToChat(item)}
      >
        <View style={styles.avatarContainer}>
          {otherParticipant?.avatar ? (
            <Image 
              source={{ uri: otherParticipant.avatar }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={[
              styles.avatarPlaceholder,
              { backgroundColor: otherParticipant?.role === 'fundi' ? theme.colors.accent : theme.colors.primary }
            ]}>
              <Text style={styles.avatarText}>
                {otherParticipant ? getInitials(otherParticipant.name) : '?'}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.topRow}>
            <Text 
              style={[
                styles.name, 
                unreadCount > 0 && styles.unreadName
              ]}
              numberOfLines={1}
            >
              {otherParticipant?.name || 'Unknown User'}
            </Text>
            <Text style={styles.timestamp}>
              {formatTime(item.lastMessage.timestamp)}
            </Text>
          </View>
          
          <View style={styles.bottomRow}>
            <Text 
              style={[
                styles.message,
                unreadCount > 0 && styles.unreadMessage
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.lastMessage.senderId === user?.id ? 'You: ' : ''}
              {item.lastMessage.text}
            </Text>
            
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
            
            {item.jobTitle && (
              <View style={styles.jobTag}>
                <Text style={styles.jobTagText} numberOfLines={1}>
                  {item.jobTitle}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="chatbubble-ellipses-outline" 
            size={80} 
            color={theme.colors.text.muted} 
          />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySubtitle}>
            Your conversations with service providers will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={renderConversationItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
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
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  list: {
    paddingVertical: theme.spacing.sm,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '500',
    color: theme.colors.text.primary,
    flex: 1,
  },
  unreadName: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.text.muted,
    marginLeft: theme.spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  unreadMessage: {
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: theme.typography.sizes.caption,
    fontWeight: 'bold',
  },
  jobTag: {
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: theme.spacing.sm,
    maxWidth: 120,
  },
  jobTagText: {
    fontSize: 10,
    color: theme.colors.primary,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.h4,
    color: theme.colors.text.primary,
    fontWeight: '500',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});