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
      // Sanat & El Sanatları - Pembe
      '#e91e63': ['#e91e63', '#f06292'],
      // Deneyim & Öğrenme - Turuncu
      '#ff9800': ['#ff9800', '#ffb74d'],
      // Aile & Çocuk - Turkuaz
      '#00bcd4': ['#00bcd4', '#4dd0e1'],
      // Kişisel Gelişim & Sağlık - Mor
      '#9c27b0': ['#9c27b0', '#ba68c8'],
      // Performans & Sahne - Kırmızı
      '#f44336': ['#f44336', '#e57373'],
      // Teknoloji & Dijital - Mavi
      '#2196f3': ['#2196f3', '#64b5f6'],
      // Doğa & Outdoor - Yeşil
      '#4caf50': ['#4caf50', '#81c784'],
      // Moda & Giyim - Pembe
      '#ff4081': ['#ff4081', '#ff80ab'],
      // El İşi & Zanaat - Kahverengi
      '#795548': ['#795548', '#a1887f'],
      // Kültürel & Geleneksel - Koyu Mor
      '#673ab7': ['#673ab7', '#9575cd'],
      // Eski renkler (geriye dönük uyumluluk için)
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
