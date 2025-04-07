import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, RootStackParamList } from './types';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ClientFundiScreen } from '../screens/ClientFundiScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CreateJobScreen } from '../screens/CreateJobScreen';
import { JobDetailsScreen } from '../screens/JobDetailsScreen';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  const { user } = useAuth();
  const isClient = user?.role === 'client';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f0f0f0',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Fundi"
        component={ClientFundiScreen}
        options={{
          title: isClient ? 'Find Fundi' : 'Jobs',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={isClient ? 'search-outline' : 'briefcase-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function TabNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="CreateJob" 
        component={CreateJobScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Create New Job',
        }}
      />
      <Stack.Screen 
        name="JobDetails" 
        component={JobDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}