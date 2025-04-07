import { User } from '../types';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    userId: string;
    name: string;
    avatar?: string;
    role: 'client' | 'fundi';
  }[];
  lastMessage: Message;
  jobId?: string;
  jobTitle?: string;
  messages: Message[];
}

// Mock data for conversations
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participants: [
      { userId: '1', name: 'Test Client', role: 'client' },
      { userId: '2', name: 'Test Fundi', role: 'fundi' },
    ],
    lastMessage: {
      id: '101',
      senderId: '2',
      text: 'I can start the plumbing work tomorrow at 9 AM if that works for you.',
      timestamp: new Date('2025-04-06T14:30:00'),
      read: false,
    },
    jobId: '1',
    jobTitle: 'Kitchen Plumbing Repair',
    messages: [
      {
        id: '100',
        senderId: '1',
        text: 'Hi, I need help with my kitchen sink. Are you available this week?',
        timestamp: new Date('2025-04-06T14:15:00'),
        read: true,
      },
      {
        id: '101',
        senderId: '2',
        text: 'I can start the plumbing work tomorrow at 9 AM if that works for you.',
        timestamp: new Date('2025-04-06T14:30:00'),
        read: false,
      },
    ],
  },
  {
    id: '2',
    participants: [
      { userId: '1', name: 'Test Client', role: 'client' },
      { userId: '3', name: 'John Electrician', role: 'fundi' },
    ],
    lastMessage: {
      id: '201',
      senderId: '1',
      text: 'Thank you for providing the quote. When can you start?',
      timestamp: new Date('2025-04-05T10:45:00'),
      read: true,
    },
    jobId: '3',
    jobTitle: 'Electrical Wiring Installation',
    messages: [
      {
        id: '200',
        senderId: '3',
        text: 'I\'ve reviewed your electrical installation requirements. The total cost will be around 15,000 KES.',
        timestamp: new Date('2025-04-05T10:30:00'),
        read: true,
      },
      {
        id: '201',
        senderId: '1',
        text: 'Thank you for providing the quote. When can you start?',
        timestamp: new Date('2025-04-05T10:45:00'),
        read: true,
      },
    ],
  },
  {
    id: '3',
    participants: [
      { userId: '4', name: 'Jane Smith', role: 'client' },
      { userId: '2', name: 'Test Fundi', role: 'fundi' },
    ],
    lastMessage: {
      id: '301',
      senderId: '4',
      text: 'I\'ve sent you the paint colors I\'d like for the living room.',
      timestamp: new Date('2025-04-06T16:20:00'),
      read: true,
    },
    jobId: '2',
    jobTitle: 'House Painting Project',
    messages: [
      {
        id: '300',
        senderId: '2',
        text: 'Which color scheme are you considering for the house?',
        timestamp: new Date('2025-04-06T16:10:00'),
        read: true,
      },
      {
        id: '301',
        senderId: '4',
        text: 'I\'ve sent you the paint colors I\'d like for the living room.',
        timestamp: new Date('2025-04-06T16:20:00'),
        read: true,
      },
    ],
  },
];

class ChatService {
  private conversations: Conversation[] = MOCK_CONVERSATIONS;

  getAllConversations(): Conversation[] {
    return this.conversations;
  }

  getConversationById(id: string): Conversation | undefined {
    return this.conversations.find(conversation => conversation.id === id);
  }

  getConversationsByUserId(userId: string): Conversation[] {
    return this.conversations.filter(conversation =>
      conversation.participants.some(participant => participant.userId === userId)
    );
  }

  addMessage(conversationId: string, message: Omit<Message, 'id'>): Message {
    const conversation = this.conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    const newMessage: Message = {
      id: Math.random().toString(),
      ...message,
    };
    
    conversation.messages.push(newMessage);
    conversation.lastMessage = newMessage;
    
    return newMessage;
  }

  markMessagesAsRead(conversationId: string, userId: string): void {
    const conversation = this.conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      return;
    }
    
    // Mark all messages from other participants as read
    conversation.messages.forEach(message => {
      if (message.senderId !== userId && !message.read) {
        message.read = true;
      }
    });
  }

  getUnreadCount(userId: string): number {
    let count = 0;
    
    this.conversations.forEach(conversation => {
      if (conversation.participants.some(p => p.userId === userId)) {
        const unreadMessages = conversation.messages.filter(
          message => message.senderId !== userId && !message.read
        );
        count += unreadMessages.length;
      }
    });
    
    return count;
  }

  createConversation(newConversation: Omit<Conversation, 'id'>): Conversation {
    const conversation: Conversation = {
      id: Math.random().toString(),
      ...newConversation,
    };
    
    this.conversations.push(conversation);
    return conversation;
  }
}

export const chatService = new ChatService();