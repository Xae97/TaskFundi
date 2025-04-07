import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { FormInput } from '../components/FormInput';
import { RootStackParamList } from '../navigation/types';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
  route: RouteProp<RootStackParamList, 'Register'>;
};

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  skills: Yup.string().when('role', {
    is: 'fundi',
    then: (schema) => schema.required('Skills are required'),
    otherwise: (schema) => schema.optional(),
  }),
});

export function RegisterScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (values: any) => {
    try {
      setError(null);
      await signUp(values);
      // Navigate to the main tabs
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {role === 'client' ? 'Create Client Account' : 'Create Service Provider Account'}
      </Text>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          phone: '',
          address: '',
          skills: '',
          role,
        }}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.form}>
            <FormInput
              label="Full Name"
              value={values.name}
              onChangeText={handleChange('name')}
              error={touched.name ? errors.name : undefined}
            />
            <FormInput
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.email ? errors.email : undefined}
            />
            <FormInput
              label="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              secureTextEntry
              error={touched.password ? errors.password : undefined}
            />
            <FormInput
              label="Phone Number"
              value={values.phone}
              onChangeText={handleChange('phone')}
              keyboardType="phone-pad"
              error={touched.phone ? errors.phone : undefined}
            />
            <FormInput
              label="Address"
              value={values.address}
              onChangeText={handleChange('address')}
              error={touched.address ? errors.address : undefined}
            />
            {role === 'fundi' && (
              <FormInput
                label="Skills (separate with commas)"
                value={values.skills}
                onChangeText={handleChange('skills')}
                multiline
                numberOfLines={3}
                error={touched.skills ? errors.skills : undefined}
              />
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
    marginTop: 60,
  },
  form: {
    gap: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});