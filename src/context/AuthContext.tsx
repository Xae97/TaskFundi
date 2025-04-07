import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    skills?: string;
    role: UserRole;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock database of users
let MOCK_USERS = [
  {
    id: '1',
    name: 'Test Client',
    email: 'client@test.com',
    password: 'password123',
    role: 'client' as UserRole,
    location: {
      latitude: 0,
      longitude: 0,
      address: 'Test Address',
    },
  },
  {
    id: '2',
    name: 'Test Fundi',
    email: 'fundi@test.com',
    password: 'password123',
    role: 'fundi' as UserRole,
    location: {
      latitude: 0,
      longitude: 0,
      address: 'Test Address',
    },
    skills: 'Plumbing, Electrical, Carpentry',
  },
];

// Key for storing registered users in AsyncStorage
const REGISTERED_USERS_KEY = 'registered_users';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
    loadRegisteredUsers();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRegisteredUsers = async () => {
    try {
      const registeredUsersJson = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      if (registeredUsersJson) {
        const registeredUsers = JSON.parse(registeredUsersJson);
        MOCK_USERS = [...MOCK_USERS, ...registeredUsers];
      }
    } catch (error) {
      console.error('Error loading registered users:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user with matching credentials
    const foundUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    // Remove password before storing
    const { password: _, ...userWithoutPassword } = foundUser;
    await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    skills?: string;
    role: UserRole;
  }) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    if (MOCK_USERS.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: Math.random().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In a real app, this would be hashed
      role: userData.role,
      location: {
        latitude: 0,
        longitude: 0,
        address: userData.address,
      },
      ...(userData.skills ? { skills: userData.skills } : {}),
    };

    // Add to mock database
    MOCK_USERS.push(newUser);

    // Store registered users
    try {
      const registeredUsersJson = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      const registeredUsers = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];
      registeredUsers.push(newUser);
      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
    } catch (error) {
      console.error('Error storing registered user:', error);
    }

    // Store current user without password
    const { password: _, ...userWithoutPassword } = newUser;
    await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('No account found with this email');
    }

    // In a real app, this would send a password reset email
    console.log('Password reset email sent to:', email);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signIn, 
      signUp, 
      signOut,
      forgotPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}