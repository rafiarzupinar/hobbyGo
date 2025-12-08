import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function WorkshopDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Workshop Detail Screen - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.foreground,
    fontSize: theme.fontSize.base,
  },
});
