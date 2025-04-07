import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Modal, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onFilterChange?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'rating' | 'price' | 'distance';
}

export function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = 'Search...', 
  onSubmit,
  onFilterChange 
}: Props) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});

  const handleFilterSave = (filters: SearchFilters) => {
    setActiveFilters(filters);
    onFilterChange?.(filters);
    setIsFilterVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={theme.colors.text.muted} 
          />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.text.muted}
            onSubmitEditing={onSubmit}
            returnKeyType="search"
          />
          {value.length > 0 && (
            <TouchableOpacity 
              onPress={() => onChangeText('')}
              style={styles.clearButton}
            >
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={theme.colors.text.muted} 
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.filterButton,
            Object.keys(activeFilters).length > 0 && styles.filterButtonActive
          ]}
          onPress={() => setIsFilterVisible(true)}
        >
          <Ionicons 
            name="options" 
            size={20} 
            color={Object.keys(activeFilters).length > 0 
              ? theme.colors.primary 
              : theme.colors.text.muted
            } 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.patternLine} />

      <FilterModal 
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onSave={handleFilterSave}
        initialFilters={activeFilters}
      />
    </View>
  );
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (filters: SearchFilters) => void;
  initialFilters: SearchFilters;
}

function FilterModal({ visible, onClose, onSave, initialFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const categories = ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.filterLabel}>Categories</Text>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    filters.category === category && styles.categoryChipActive
                  ]}
                  onPress={() => setFilters(f => ({
                    ...f,
                    category: f.category === category ? undefined : category
                  }))}
                >
                  <Text style={[
                    styles.categoryChipText,
                    filters.category === category && styles.categoryChipTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Sort By</Text>
            <View style={styles.sortContainer}>
              {['rating', 'price', 'distance'].map((sort) => (
                <TouchableOpacity
                  key={sort}
                  style={[
                    styles.sortButton,
                    filters.sortBy === sort && styles.sortButtonActive
                  ]}
                  onPress={() => setFilters(f => ({
                    ...f,
                    sortBy: f.sortBy === sort ? undefined : sort as SearchFilters['sortBy']
                  }))}
                >
                  <Text style={[
                    styles.sortButtonText,
                    filters.sortBy === sort && styles.sortButtonTextActive
                  ]}>
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => setFilters({})}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => onSave(filters)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.elevation.small,
  },
  input: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.primary,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  filterButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    ...theme.elevation.small,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary + '15',
  },
  patternLine: {
    position: 'absolute',
    bottom: -2,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    height: 2,
    backgroundColor: theme.colors.primary,
    opacity: 0.2,
    borderRadius: theme.borderRadius.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  modalBody: {
    padding: theme.spacing.lg,
  },
  filterLabel: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
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
  sortContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  sortButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  sortButtonText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
  },
  sortButtonTextActive: {
    color: theme.colors.surface,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  },
  resetButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.surface,
    fontWeight: '600',
  },
});