import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const getGradientColors = (color: string): [string, string] => {
    const colorMap: Record<string, [string, string]> = {
      '#a855f7': [theme.colors.categories.purple.from, theme.colors.categories.purple.to],
      '#ec4899': [theme.colors.categories.pink.from, theme.colors.categories.pink.to],
      '#3b82f6': [theme.colors.categories.blue.from, theme.colors.categories.blue.to],
      '#f97316': [theme.colors.categories.orange.from, theme.colors.categories.orange.to],
      '#10b981': [theme.colors.categories.green.from, theme.colors.categories.green.to],
      '#eab308': [theme.colors.categories.yellow.from, theme.colors.categories.yellow.to],
    };

    return colorMap[color] || [color, color];
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      <LinearGradient
        colors={getGradientColors(category.color)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        <Ionicons name={category.icon as any} size={32} color="#fff" />
      </LinearGradient>
      <Text style={styles.text} numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    minWidth: 80,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
    textAlign: 'center',
  },
});
