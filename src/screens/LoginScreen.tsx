import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FormInput } from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'client' | 'fundi'>('client');

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setError(null);
      await signIn(values.email, values.password, selectedRole);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>TF</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to TaskFundi</Text>
        </View>

        <View style={styles.roleToggleContainer}>
          <TouchableOpacity 
            style={[
              styles.roleButton,
              selectedRole === 'client' && styles.roleButtonActive
            ]}
            onPress={() => setSelectedRole('client')}
          >
            <Text style={[
              styles.roleButtonText,
              selectedRole === 'client' && styles.roleButtonTextActive
            ]}>As Client</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.roleButton,
              selectedRole === 'fundi' && styles.roleButtonActive
            ]}
            onPress={() => setSelectedRole('fundi')}
          >
            <Text style={[
              styles.roleButtonText,
              selectedRole === 'fundi' && styles.roleButtonTextActive
            ]}>As Fundi</Text>
          </TouchableOpacity>
        </View>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              <FormInput
                label="Email Address"
                value={values.email}
                onChangeText={handleChange('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                error={touched.email ? errors.email : undefined}
              />
              <FormInput
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                secureTextEntry
                placeholder="Enter your password"
                error={touched.password ? errors.password : undefined}
              />
              
              <TouchableOpacity 
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {error && <Text style={styles.errorText}>{error}</Text>}
              
              <TouchableOpacity 
                style={[styles.button, isSubmitting && styles.buttonDisabled]} 
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate('Landing')}
          >
            <Text style={styles.linkText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
  linkButton: {
    padding: 4,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  roleToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    padding: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roleButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  roleButtonTextActive: {
    color: '#007AFF',
  },
});