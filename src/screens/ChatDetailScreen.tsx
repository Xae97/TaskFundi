import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { chatService, Message, Conversation } from '../services/ChatService';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

type RouteParams = {
  conversationId: string;
};

export function ChatDetailScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation();
  const { conversationId } = route.params;
  const { user } = useAuth();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!conversationId) return;
    
    // Get conversation data
    const conversationData = chatService.getConversationById(conversationId);
    
    if (conversationData) {
      setConversation(conversationData);
      
      // Mark messages as read
      if (user) {
        chatService.markMessagesAsRead(conversationId, user.id);
      }
    }
    
    setLoading(false);
  }, [conversationId, user]);

  useEffect(() => {
    // Set up header with conversation info
    if (conversation) {
      const otherParticipant = getOtherParticipant(conversation);
      
      navigation.setOptions({
        title: otherParticipant?.name || 'Chat',
        headerShown: true,
        headerRight: () => (
          <View style={styles.headerContainer}>
            {conversation.jobTitle && (
              <View style={styles.jobBadge}>
                <Text style={styles.jobBadgeText} numberOfLines={1}>
                  {conversation.jobTitle}
                </Text>
              </View>
            )}
          </View>
        ),
      });
    }
  }, [conversation, navigation]);

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.userId !== user?.id);
  };

  const handleSend = () => {
    if (!message.trim() || !conversation || !user) return;
    
    const newMessage: Omit<Message, 'id'> = {
      senderId: user.id,
      text: message.trim(),
      timestamp: new Date(),
      read: false,
    };
    
    // Add message to conversation
    chatService.addMessage(conversation.id, newMessage);
    
    // Update local state
    setMessage('');
    
    // Re-fetch updated conversation
    const updatedConversation = chatService.getConversationById(conversation.id);
    if (updatedConversation) {
      setConversation(updatedConversation);
      
      // Scroll to bottom
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Group messages by date for date separators
  const getGroupedMessages = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    
    messages.forEach(message => {
      const dateString = formatMessageDate(message.timestamp);
      const lastGroup = groups[groups.length - 1];
      
      if (lastGroup && lastGroup.date === dateString) {
        lastGroup.messages.push(message);
      } else {
        groups.push({
          date: dateString,
          messages: [message],
        });
      }
    });
    
    return groups;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isFromMe = item.senderId === user?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isFromMe ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isFromMe ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isFromMe ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTimestamp,
            isFromMe ? styles.myTimestamp : styles.otherTimestamp
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderDateSeparator = (date: string) => (
    <View style={styles.dateSeparator}>
      <View style={styles.dateLine} />
      <Text style={styles.dateText}>{date}</Text>
      <View style={styles.dateLine} />
    </View>
  );

  const renderMessages = () => {
    if (!conversation) return null;
    
    const groupedMessages = getGroupedMessages(conversation.messages);
    
    return (
      <FlatList
        ref={listRef}
        data={groupedMessages}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        onContentSizeChange={() => {
          // Scroll to bottom on initial load
          listRef.current?.scrollToEnd({ animated: false });
        }}
        renderItem={({ item: group }) => (
          <View>
            {renderDateSeparator(group.date)}
            {group.messages.map((message: Message) => (
              <View key={message.id}>
                {renderMessage({ item: message })}
              </View>
            ))}
          </View>
        )}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Conversation not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.messagesContainer}>
        {renderMessages()}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.text.muted}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !message.trim() && styles.disabledSendButton
          ]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={message.trim() ? theme.colors.surface : theme.colors.text.muted} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.body,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.small,
    marginRight: theme.spacing.md,
  },
  jobBadgeText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.md,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.text.muted + '30',
  },
  dateText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.text.muted,
    marginHorizontal: theme.spacing.md,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '75%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  myMessageBubble: {
    backgroundColor: theme.colors.primary,
  },
  otherMessageBubble: {
    backgroundColor: theme.colors.surface,
    ...theme.elevation.small,
  },
  messageText: {
    fontSize: theme.typography.sizes.body,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: theme.colors.text.primary,
  },
  messageTimestamp: {
    fontSize: theme.typography.sizes.caption - 1,
    marginTop: 4,
    textAlign: 'right',
  },
  myTimestamp: {
    color: '#FFFFFF90',
  },
  otherTimestamp: {
    color: theme.colors.text.muted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    ...theme.elevation.small,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.sm,
    maxHeight: 120,
    color: theme.colors.text.primary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.elevation.small,
  },
  disabledSendButton: {
    backgroundColor: theme.colors.background,
  },
});