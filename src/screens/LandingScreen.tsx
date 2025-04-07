import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserRole } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function LandingScreen({ navigation }: Props) {
  const handleRoleSelect = (role: UserRole) => {
    navigation.navigate('Register', { role });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TaskFundi</Text>
        <Text style={styles.subtitle}>Connect with skilled service providers or find work opportunities</Text>
        
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleButton, styles.clientButton]}
            onPress={() => handleRoleSelect('client')}
          >
            <Text style={styles.roleTitle}>I need a service</Text>
            <Text style={styles.roleDescription}>Find skilled professionals for your tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.roleButton, styles.fundiButton]}
            onPress={() => handleRoleSelect('fundi')}
          >
            <Text style={styles.roleTitle}>I provide services</Text>
            <Text style={styles.roleDescription}>Offer your skills and earn money</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  roleContainer: {
    width: '100%',
    gap: 20,
  },
  roleButton: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientButton: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  fundiButton: {
    backgroundColor: '#007AFF',
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 16,
    color: '#666',
  },
  loginButton: {
    marginTop: 40,
    padding: 15,
  },
  loginText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});