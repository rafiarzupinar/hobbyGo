import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  rightIcon,
  onRightIconPress,
  style,
  secureTextEntry,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isSecure}
          {...props}
        />
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => {
              if (secureTextEntry) {
                setIsSecure(!isSecure);
              } else if (onRightIconPress) {
                onRightIconPress();
              }
            }}
          >
            <Ionicons
              name={secureTextEntry ? (isSecure ? 'eye-off' : 'eye') : rightIcon!}
              size={24}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    color: '#111827',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  error: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
});
