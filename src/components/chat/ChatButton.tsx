import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { chatService } from '../../services/ChatService';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

interface ChatButtonProps {
  size?: number;
  color?: string;
  style?: any;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  size = 24,
  color = theme.colors.primary,
  style
}) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Get initial unread count
      const count = chatService.getUnreadCount(user.id);
      setUnreadCount(count);

      // In a real app, you would set up listeners for new messages here
      // For this example, we'll simulate a new message every 30 seconds
      const interval = setInterval(() => {
        const newCount = chatService.getUnreadCount(user.id);
        setUnreadCount(newCount);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const handlePress = () => {
    navigation.navigate('ChatList' as never);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons name="chatbubble-outline" size={size} color={color} />
      
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});