import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Split name into first and last name
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setIsLoading(true);
    try {
      await register({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.mobileNumber || undefined,
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle} />
              <Text style={styles.logoText}>live Green</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Register Now!</Text>
            <Text style={styles.subtitle}>Enter your information below</Text>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                autoCapitalize="words"
                placeholderTextColor="#999"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999"
              />
            </View>

            {/* Mobile Number Input - Optional */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number (optional)"
                value={formData.mobileNumber}
                onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Registering...' : 'Register'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Already a member? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    borderRightWidth: 0,
    marginRight: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8B5CF6',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#000',
  },
  loginLink: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
});
