import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Switch,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FormInput } from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateJob'>;
};

const jobPostSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  budget: Yup.number()
    .required('Budget is required')
    .min(0, 'Budget must be greater than 0'),
  location: Yup.string().required('Location is required'),
  requiredSkills: Yup.string().required('Required skills are required'),
});

const FormStep = ({ 
  children, 
  title, 
  isActive, 
  isCompleted 
}: { 
  children: React.ReactNode; 
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}) => (
  <View style={[styles.stepContainer, !isActive && styles.stepContainerInactive]}>
    <View style={styles.stepHeader}>
      <View style={[
        styles.stepIndicator,
        isActive && styles.stepIndicatorActive,
        isCompleted && styles.stepIndicatorCompleted,
      ]}>
        {isCompleted ? (
          <Ionicons name="checkmark" size={16} color={theme.colors.surface} />
        ) : (
          <Text style={[
            styles.stepNumber,
            (isActive || isCompleted) && styles.stepNumberActive
          ]}>
            {title.charAt(0)}
          </Text>
        )}
      </View>
      <Text style={[
        styles.stepTitle,
        isActive && styles.stepTitleActive
      ]}>
        {title}
      </Text>
    </View>
    {isActive && (
      <Animated.View style={styles.stepContent}>
        {children}
      </Animated.View>
    )}
  </View>
);

export function CreateJobScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Basics', fields: ['title', 'category'] },
    { title: 'Details', fields: ['description', 'requiredSkills'] },
    { title: 'Location & Budget', fields: ['location', 'budget', 'isRemote'] },
  ];

  const handleCreateJob = async (values: any) => {
    try {
      setError(null);
      const jobPost = {
        ...values,
        budget: {
          amount: Number(values.budget),
          currency: 'KES',
        },
        location: {
          address: values.location,
          latitude: 0,
          longitude: 0,
        },
        requiredSkills: values.requiredSkills.split(',').map((s: string) => s.trim()),
        clientId: user?.id,
        status: 'open',
        createdAt: new Date(),
        isRemote: values.isRemote || false,
      };
      
      console.log('Creating job post:', jobPost);
      navigation.goBack();
    } catch (error) {
      setError('Failed to create job post. Please try again.');
      console.error('Create job error:', error);
    }
  };

  const categories = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Cleaning',
    'Moving',
    'Gardening',
    'Other'
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Post a Job</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Formik
          initialValues={{
            title: '',
            description: '',
            category: '',
            budget: '',
            location: '',
            requiredSkills: '',
            isRemote: false,
          }}
          validationSchema={jobPostSchema}
          onSubmit={handleCreateJob}
        >
          {({ handleChange, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
            <View style={styles.form}>
              <FormStep 
                title="Basics" 
                isActive={currentStep === 0}
                isCompleted={currentStep > 0}
              >
                <FormInput
                  label="Job Title"
                  value={values.title}
                  onChangeText={handleChange('title')}
                  placeholder="e.g., Bathroom Renovation"
                  error={touched.title ? errors.title : undefined}
                  icon="briefcase-outline"
                />

                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryLabel}>Category</Text>
                  <View style={styles.categoryGrid}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryChip,
                          values.category === category && styles.categoryChipActive
                        ]}
                        onPress={() => handleChange('category')(category)}
                      >
                        <Text style={[
                          styles.categoryChipText,
                          values.category === category && styles.categoryChipTextActive
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {touched.category && errors.category && (
                    <Text style={styles.errorText}>{errors.category}</Text>
                  )}
                </View>
              </FormStep>

              <FormStep 
                title="Details" 
                isActive={currentStep === 1}
                isCompleted={currentStep > 1}
              >
                <FormInput
                  label="Description"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  placeholder="Describe the job in detail..."
                  multiline
                  numberOfLines={4}
                  error={touched.description ? errors.description : undefined}
                  icon="document-text-outline"
                />
                <FormInput
                  label="Required Skills"
                  value={values.requiredSkills}
                  onChangeText={handleChange('requiredSkills')}
                  placeholder="e.g., Plumbing, Tiling"
                  error={touched.requiredSkills ? errors.requiredSkills : undefined}
                  icon="construct-outline"
                />
              </FormStep>

              <FormStep 
                title="Location & Budget" 
                isActive={currentStep === 2}
                isCompleted={currentStep > 2}
              >
                <View style={styles.remoteToggleContainer}>
                  <View style={styles.remoteToggleTextContainer}>
                    <Ionicons name="globe-outline" size={24} color={theme.colors.accent} style={styles.remoteIcon} />
                    <View>
                      <Text style={styles.remoteToggleLabel}>Remote Work Available</Text>
                      <Text style={styles.remoteToggleHint}>
                        Toggle this if the job can be done remotely
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={values.isRemote}
                    onValueChange={(value) => setFieldValue('isRemote', value)}
                    trackColor={{ false: theme.colors.background, true: theme.colors.accent + '80' }}
                    thumbColor={values.isRemote ? theme.colors.accent : '#f4f3f4'}
                  />
                </View>

                <FormInput
                  label="Location"
                  value={values.location}
                  onChangeText={handleChange('location')}
                  placeholder={values.isRemote ? "Your location or 'Remote'" : "Enter job location"}
                  error={touched.location ? errors.location : undefined}
                  icon="location-outline"
                />
                <FormInput
                  label="Budget (KES)"
                  value={values.budget}
                  onChangeText={handleChange('budget')}
                  keyboardType="numeric"
                  placeholder="Enter your budget"
                  error={touched.budget ? errors.budget : undefined}
                  icon="cash-outline"
                />
              </FormStep>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <View style={styles.buttonContainer}>
                {currentStep > 0 && (
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => setCurrentStep(step => step - 1)}
                  >
                    <Text style={styles.secondaryButtonText}>Previous</Text>
                  </TouchableOpacity>
                )}

                {currentStep < steps.length - 1 ? (
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => setCurrentStep(step => step + 1)}
                  >
                    <Text style={styles.buttonText}>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.button, 
                      styles.primaryButton,
                      isSubmitting && styles.buttonDisabled
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Post Job</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    ...theme.elevation.small,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: theme.spacing.lg,
  },
  stepContainer: {
    marginBottom: theme.spacing.lg,
  },
  stepContainerInactive: {
    opacity: 0.6,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  stepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  stepIndicatorActive: {
    backgroundColor: theme.colors.primary,
  },
  stepIndicatorCompleted: {
    backgroundColor: theme.colors.success,
  },
  stepNumber: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  stepNumberActive: {
    color: theme.colors.surface,
  },
  stepTitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  stepTitleActive: {
    color: theme.colors.text.primary,
  },
  stepContent: {
    marginTop: theme.spacing.sm,
  },
  categoryContainer: {
    marginBottom: theme.spacing.lg,
  },
  categoryLabel: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.background,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
  },
  categoryChipTextActive: {
    color: theme.colors.surface,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  button: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
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
  buttonDisabled: {
    opacity: 0.7,
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
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.small,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  remoteToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.background,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  remoteToggleTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  remoteIcon: {
    marginRight: theme.spacing.md,
  },
  remoteToggleLabel: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  remoteToggleHint: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  }
});